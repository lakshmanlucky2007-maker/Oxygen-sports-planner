const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Middleware to verify Admin PIN
router.use((req, res, next) => {
  const pin = req.headers['x-admin-pin'] || req.query.pin;
  const adminPin = process.env.ADMIN_PIN || '1234';
  
  if (pin !== adminPin) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Invalid Admin PIN'
    });
  }
  next();
});

// GET /api/analytics - Fetch all analytics metrics
router.get('/', async (req, res, next) => {
  try {
    const isPg = db.isPostgres;
    const falseVal = isPg ? 'FALSE' : '0';

    // 1. Total Generations
    const totalRes = await db.query(`SELECT COUNT(*) as count FROM generations WHERE is_deleted = ${falseVal}`);
    const totalGenerations = parseInt(totalRes.rows[0]?.count || 0);

    // 2. Today's Generations
    const todaySql = isPg
      ? `SELECT COUNT(*) as count FROM generations WHERE is_deleted = FALSE AND created_at >= CURRENT_DATE`
      : `SELECT COUNT(*) as count FROM generations WHERE is_deleted = 0 AND created_at >= date('now', 'start of day')`;
    const todayRes = await db.query(todaySql);
    const todayGenerations = parseInt(todayRes.rows[0]?.count || 0);

    // 3. Average Rating
    const avgRatingRes = await db.query('SELECT AVG(rating) as avg FROM feedback');
    const avgRatingRaw = parseFloat(avgRatingRes.rows[0]?.avg);
    const avgRating = isNaN(avgRatingRaw) ? 0.0 : Math.round(avgRatingRaw * 10) / 10;

    // 4. Average Response Time
    const avgResTimeRes = await db.query(`SELECT AVG(response_time_ms) as avg FROM generations WHERE is_deleted = ${falseVal}`);
    const avgResponseTimeMs = Math.round(parseFloat(avgResTimeRes.rows[0]?.avg) || 0);

    // 5. Top Sport
    const topSportRes = await db.query(`
      SELECT sport, COUNT(*) as count 
      FROM generations 
      WHERE is_deleted = ${falseVal}
      GROUP BY sport 
      ORDER BY count DESC 
      LIMIT 1
    `);
    const topSport = topSportRes.rows[0]?.sport || 'None';

    // Google vs Email Users
    const googleUsersRes = await db.query("SELECT COUNT(*) as count FROM users WHERE provider = 'GOOGLE'");
    const totalGoogleUsers = parseInt(googleUsersRes.rows[0]?.count || 0);

    const emailUsersRes = await db.query("SELECT COUNT(*) as count FROM users WHERE provider = 'EMAIL' OR provider IS NULL OR provider = ''");
    const totalEmailUsers = parseInt(emailUsersRes.rows[0]?.count || 0);

    // 6. Quality Trend (last 14 days)
    const trendSql = isPg
      ? `
        SELECT TO_CHAR(g.created_at, 'YYYY-MM-DD') as date, AVG(f.rating) as avg, COUNT(g.id) as count
        FROM generations g
        LEFT JOIN feedback f ON f.generation_id = g.id
        WHERE g.is_deleted = FALSE AND g.created_at >= NOW() - INTERVAL '14 days'
        GROUP BY TO_CHAR(g.created_at, 'YYYY-MM-DD')
        ORDER BY date ASC
      `
      : `
        SELECT strftime('%Y-%m-%d', g.created_at) as date, AVG(f.rating) as avg, COUNT(g.id) as count
        FROM generations g
        LEFT JOIN feedback f ON f.generation_id = g.id
        WHERE g.is_deleted = 0 AND g.created_at >= datetime('now', '-14 days')
        GROUP BY strftime('%Y-%m-%d', g.created_at)
        ORDER BY date ASC
      `;
    const trendRes = await db.query(trendSql);
    const qualityTrend = trendRes.rows.map(r => ({
      date: r.date,
      avgRating: r.avg ? Math.round(parseFloat(r.avg) * 10) / 10 : 0.0,
      count: parseInt(r.count || 0)
    }));

    // 7. Daily Counts (last 7 days)
    const dailySql = isPg
      ? `
        SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count
        FROM generations
        WHERE is_deleted = FALSE AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
        ORDER BY date ASC
      `
      : `
        SELECT strftime('%Y-%m-%d', created_at) as date, COUNT(*) as count
        FROM generations
        WHERE is_deleted = 0 AND created_at >= datetime('now', '-7 days')
        GROUP BY strftime('%Y-%m-%d', created_at)
        ORDER BY date ASC
      `;
    const dailyRes = await db.query(dailySql);
    const dailyCounts = dailyRes.rows.map(r => ({
      date: r.date,
      count: parseInt(r.count || 0)
    }));

    // 8. Sport Distribution
    const distRes = await db.query(`
      SELECT sport, COUNT(*) as count 
      FROM generations 
      WHERE is_deleted = ${falseVal}
      GROUP BY sport
      ORDER BY count DESC
    `);
    const sportDistribution = distRes.rows.map(r => {
      const count = parseInt(r.count || 0);
      const percentage = totalGenerations > 0 ? Math.round((count / totalGenerations) * 100) : 0;
      return {
        sport: r.sport,
        count,
        percentage
      };
    });

    // 9. Age Groups
    const ageRes = await db.query(`
      SELECT 
        SUM(CASE WHEN age BETWEEN 6 AND 12 THEN 1 ELSE 0 END) as junior,
        SUM(CASE WHEN age BETWEEN 13 AND 17 THEN 1 ELSE 0 END) as teen,
        SUM(CASE WHEN age >= 18 THEN 1 ELSE 0 END) as senior,
        COUNT(*) as total
      FROM generations
      WHERE is_deleted = ${falseVal}
    `);
    
    const juniorVal = parseInt(ageRes.rows[0]?.junior || 0);
    const teenVal = parseInt(ageRes.rows[0]?.teen || 0);
    const seniorVal = parseInt(ageRes.rows[0]?.senior || 0);
    const ageTotal = parseInt(ageRes.rows[0]?.total || 0);

    const ageGroups = [
      {
        group: "Junior (6-12)",
        count: juniorVal,
        percentage: ageTotal > 0 ? Math.round((juniorVal / ageTotal) * 100) : 0
      },
      {
        group: "Teen (13-17)",
        count: teenVal,
        percentage: ageTotal > 0 ? Math.round((teenVal / ageTotal) * 100) : 0
      },
      {
        group: "Senior (18+)",
        count: seniorVal,
        percentage: ageTotal > 0 ? Math.round((seniorVal / ageTotal) * 100) : 0
      }
    ];

    // 10. Recent Generations Table (Limit 10)
    const recentSql = `
      SELECT 
        g.id, 
        g.sport, 
        g.age, 
        g.player_level as "level", 
        g.player_name as "playerName",
        f.rating,
        g.response_time_ms as "responseTimeMs",
        g.created_at as "createdAt",
        u.provider as "provider"
      FROM generations g
      LEFT JOIN users u ON u.id = g.user_id
      LEFT JOIN feedback f ON f.generation_id = g.id
      WHERE g.is_deleted = ${falseVal}
      ORDER BY g.created_at DESC
      LIMIT 10
    `;
    const recentRes = await db.query(recentSql);

    // 11. Prompt Quality Table
    const promptQualitySql = `
      SELECT 
        g.prompt_version as "promptVersion",
        AVG(f.rating) as "avgScore",
        COUNT(g.id) as "testsRun",
        MIN(g.created_at) as "date"
      FROM generations g
      LEFT JOIN feedback f ON f.generation_id = g.id
      WHERE g.is_deleted = ${falseVal}
      GROUP BY g.prompt_version
      ORDER BY "date" DESC
    `;
    const promptRes = await db.query(promptQualitySql);
    const promptQuality = promptRes.rows.map((r, i) => ({
      promptVersion: r.promptVersion,
      avgScore: r.avgScore ? Math.round(parseFloat(r.avgScore) * 10) / 10 : 0.0,
      testsRun: parseInt(r.testsRun || 0),
      date: r.date,
      status: i === 0 ? 'Active' : 'Archived' // Mark newest version as active
    }));

    res.json({
      success: true,
      totalGenerations,
      todayGenerations,
      avgRating,
      avgResponseTimeMs,
      topSport,
      totalGoogleUsers,
      totalEmailUsers,
      qualityTrend,
      dailyCounts,
      sportDistribution,
      ageGroups,
      recentGenerations: recentRes.rows.map(r => ({
        id: r.id,
        sport: r.sport,
        age: r.age,
        level: r.level,
        playerName: r.playerName || 'N/A',
        rating: r.rating ? parseFloat(r.rating) : null,
        responseTimeMs: r.responseTimeMs,
        createdAt: r.createdAt,
        provider: r.provider || 'EMAIL'
      })),
      promptQuality
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
