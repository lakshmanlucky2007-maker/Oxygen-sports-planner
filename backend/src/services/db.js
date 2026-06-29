const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();

const isPostgres = process.env.DATABASE_URL && 
  (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'));

let pgPool = null;
let sqliteDb = null;

if (isPostgres) {
  console.log('Database configuration: PostgreSQL');
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  console.log('Database configuration: SQLite (local)');
  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Failed to open SQLite database:', err.message);
    } else {
      console.log(`SQLite database opened successfully at ${dbPath}`);
    }
  });
}

// Helper to convert PostgreSQL style parameter syntax ($1, $2, etc.) to SQLite style (?)
function pgToSqliteQuery(sql, params = []) {
  let sqliteSql = sql;
  // Replace $1, $2, etc with ?
  sqliteSql = sqliteSql.replace(/\$(\d+)/g, '?');
  return sqliteSql;
}

// Database helper that returns a Promise
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (isPostgres) {
      pgPool.query(sql, params, (err, res) => {
        if (err) return reject(err);
        resolve({ rows: res.rows });
      });
    } else {
      const sqliteSql = pgToSqliteQuery(sql, params);
      
      // Map params for SQLite if needed (e.g. serialize arrays/objects to JSON strings)
      const sqliteParams = params.map(param => {
        if (Array.isArray(param)) {
          return JSON.stringify(param);
        }
        if (param !== null && typeof param === 'object') {
          return JSON.stringify(param);
        }
        return param;
      });

      const isSelect = sqliteSql.trim().toUpperCase().startsWith('SELECT');

      if (isSelect) {
        sqliteDb.all(sqliteSql, sqliteParams, (err, rows) => {
          if (err) return reject(err);
          
          // Parse stringified columns back into objects/arrays
          const parsedRows = rows.map(row => {
            const newRow = { ...row };
            for (const key in newRow) {
              const val = newRow[key];
              if (typeof val === 'string') {
                if ((val.startsWith('[') && val.endsWith(']')) || (val.startsWith('{') && val.endsWith('}'))) {
                  try {
                    newRow[key] = JSON.parse(val);
                  } catch (e) {
                    // Not valid JSON, leave as string
                  }
                }
              }
            }
            return newRow;
          });
          
          resolve({ rows: parsedRows });
        });
      } else {
        sqliteDb.run(sqliteSql, sqliteParams, function(err) {
          if (err) return reject(err);
          resolve({ rows: [], lastID: this.lastID, changes: this.changes });
        });
      }
    }
  });
}

async function initDb() {
  if (isPostgres) {
    console.log('Initializing PostgreSQL database tables...');
    try {
      const initSqlPath = path.resolve(__dirname, '../../migrations/init.sql');
      const sql = fs.readFileSync(initSqlPath, 'utf8');
      await pgPool.query(sql);
      
      // Attempt pg migrations if columns are missing
      try {
        await pgPool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(128) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            avatar TEXT,
            role VARCHAR(50) DEFAULT 'Parent',
            created_at TIMESTAMP DEFAULT NOW()
          );
          ALTER TABLE generations ADD COLUMN IF NOT EXISTS planning_mode VARCHAR(20) DEFAULT 'Parent';
          ALTER TABLE generations ADD COLUMN IF NOT EXISTS player_weight DECIMAL(5,1);
          ALTER TABLE generations ADD COLUMN IF NOT EXISTS player_experience VARCHAR(50);
          ALTER TABLE generations ADD COLUMN IF NOT EXISTS user_id VARCHAR(128) REFERENCES users(id);
          ALTER TABLE generations ADD COLUMN IF NOT EXISTS player_name VARCHAR(100);
        `);
      } catch (colErr) {
        console.warn('Postgres alter columns skipped or failed:', colErr.message);
      }
      
      console.log('PostgreSQL database initialized.');
    } catch (err) {
      console.error('Failed to initialize PostgreSQL:', err.message);
      throw err;
    }
  } else {
    console.log('Initializing SQLite database tables...');
    const createTables = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar TEXT,
        role TEXT DEFAULT 'Parent',
        provider TEXT DEFAULT 'EMAIL',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS generations (
        id TEXT PRIMARY KEY,
        sport TEXT NOT NULL,
        age INTEGER NOT NULL CHECK (age BETWEEN 6 AND 25),
        height REAL,
        height_unit TEXT DEFAULT 'cm',
        player_level TEXT,
        current_equipment TEXT NOT NULL,
        budget_min INTEGER,
        budget_max INTEGER,
        goals TEXT,
        coach_name TEXT,
        prompt_version TEXT,
        ai_response TEXT,
        response_time_ms INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        planning_mode TEXT DEFAULT 'Parent',
        player_weight REAL,
        player_experience TEXT,
        user_id TEXT REFERENCES users(id),
        player_name TEXT
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        generation_id TEXT REFERENCES generations(id),
        rating INTEGER CHECK (rating BETWEEN 1 AND 5),
        thumbs TEXT CHECK (thumbs IN ('up', 'down')),
        comment TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        label TEXT,
        emoji TEXT,
        color TEXT,
        sport TEXT,
        age INTEGER,
        height REAL,
        height_unit TEXT DEFAULT 'cm',
        player_level TEXT,
        current_equipment TEXT,
        budget_min INTEGER,
        budget_max INTEGER,
        goals TEXT,
        is_active INTEGER DEFAULT 1
      );

      CREATE INDEX IF NOT EXISTS idx_generations_sport ON generations(sport);
      CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at);
      CREATE INDEX IF NOT EXISTS idx_feedback_generation_id ON feedback(generation_id);
    `;

    return new Promise((resolve, reject) => {
      sqliteDb.exec(createTables, (err) => {
        if (err) {
          console.error('Failed to initialize SQLite tables:', err.message);
          return reject(err);
        }
        console.log('SQLite database initialized. Checking for schema migrations...');
        
        sqliteDb.all("PRAGMA table_info(users)", (err, userCols) => {
          if (err) {
            console.error('Failed to query SQLite user column metadata:', err.message);
            return reject(err);
          }
          
          const userColNames = userCols.map(c => c.name);
          const userPromises = [];
          
          if (!userColNames.includes('provider')) {
            userPromises.push(new Promise((res) => {
              sqliteDb.run("ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'EMAIL'", (err) => {
                if (err) console.error('Migration failed for user provider:', err.message);
                res();
              });
            }));
          }
          
          Promise.all(userPromises).then(async () => {
            // Repair timestamp columns to prevent Prisma DateTime mapping crashes
            await new Promise((res) => {
              sqliteDb.run(`
                UPDATE users 
                SET created_at = datetime(CAST(created_at AS INTEGER) / 1000, 'unixepoch') 
                WHERE created_at NOT LIKE '%-%' AND created_at IS NOT NULL AND length(created_at) >= 10
              `, (err) => {
                if (err) console.error('Failed to repair users timestamps:', err.message);
                res();
              });
            });

            await new Promise((res) => {
              sqliteDb.run(`
                UPDATE generations 
                SET created_at = datetime(CAST(created_at AS INTEGER) / 1000, 'unixepoch') 
                WHERE created_at NOT LIKE '%-%' AND created_at IS NOT NULL AND length(created_at) >= 10
              `, (err) => {
                if (err) console.error('Failed to repair generations timestamps:', err.message);
                res();
              });
            });

            await new Promise((res) => {
              sqliteDb.run(`
                UPDATE feedback 
                SET created_at = datetime(CAST(created_at AS INTEGER) / 1000, 'unixepoch') 
                WHERE created_at NOT LIKE '%-%' AND created_at IS NOT NULL AND length(created_at) >= 10
              `, (err) => {
                if (err) console.error('Failed to repair feedback timestamps:', err.message);
                res();
              });
            });

            sqliteDb.all("PRAGMA table_info(generations)", (err, columns) => {
              if (err) {
                console.error('Failed to query SQLite column metadata:', err.message);
                return reject(err);
              }
              
              const columnNames = columns.map(c => c.name);
              const alterPromises = [];
              
              if (!columnNames.includes('planning_mode')) {
                alterPromises.push(new Promise((res) => {
                  sqliteDb.run("ALTER TABLE generations ADD COLUMN planning_mode TEXT DEFAULT 'Parent'", (err) => {
                    if (err) console.error('Migration failed for planning_mode:', err.message);
                    res();
                  });
                }));
              }
              
              if (!columnNames.includes('player_weight')) {
                alterPromises.push(new Promise((res) => {
                  sqliteDb.run("ALTER TABLE generations ADD COLUMN player_weight REAL", (err) => {
                    if (err) console.error('Migration failed for player_weight:', err.message);
                    res();
                  });
                }));
              }
              
              if (!columnNames.includes('player_experience')) {
                alterPromises.push(new Promise((res) => {
                  sqliteDb.run("ALTER TABLE generations ADD COLUMN player_experience TEXT", (err) => {
                    if (err) console.error('Migration failed for player_experience:', err.message);
                    res();
                  });
                }));
              }
              
              if (!columnNames.includes('user_id')) {
                alterPromises.push(new Promise((res) => {
                  sqliteDb.run("ALTER TABLE generations ADD COLUMN user_id TEXT REFERENCES users(id)", (err) => {
                    if (err) console.error('Migration failed for user_id:', err.message);
                    res();
                  });
                }));
              }
              
              if (!columnNames.includes('player_name')) {
                alterPromises.push(new Promise((res) => {
                  sqliteDb.run("ALTER TABLE generations ADD COLUMN player_name TEXT", (err) => {
                    if (err) console.error('Migration failed for player_name:', err.message);
                    res();
                  });
                }));
              }
              
              Promise.all(alterPromises).then(() => {
                console.log('SQLite migrations check completed.');
                resolve();
              });
            });
          });
        });
      });
    });
  }
}

module.exports = {
  query,
  initDb,
  isPostgres
};
