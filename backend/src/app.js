require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./services/db');
const seeder = require('./services/seeder');

const generateRouter = require('./routes/generate');
const historyRouter = require('./routes/history');
const feedbackRouter = require('./routes/feedback');
const analyticsRouter = require('./routes/analytics');
const templatesRouter = require('./routes/templates');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing/deployment flexibility
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-pin', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/generate', authMiddleware, generateRouter);
app.use('/api/history', authMiddleware, historyRouter);
app.use('/api/feedback', authMiddleware, feedbackRouter);
app.use('/api/analytics', authMiddleware, analyticsRouter);
app.use('/api/templates', authMiddleware, templatesRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: db.isPostgres ? 'PostgreSQL' : 'SQLite' });
});

// Error handling middleware (should be registered last)
app.use(errorHandler);

// Initialize DB and start server
async function startServer() {
  try {
    // 1. Init Database Tables
    await db.initDb();
    
    // 2. Seed Database if empty
    await seeder.seedDatabase();

    // 3. Start Express Server
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
