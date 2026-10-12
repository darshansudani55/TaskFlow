require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const statsRoutes = require('./routes/statsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─────────────────────────────────────────────
// CORS
// ─────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// ─────────────────────────────────────────────
// Body Parsing
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
// API Routes
// NOTE: /api/tasks/stats must be mounted BEFORE /api/tasks
// so that "stats" is not treated as a task :id parameter
// ─────────────────────────────────────────────
app.use('/api/tasks/stats', statsRoutes);
app.use('/api/tasks', taskRoutes);

// ─────────────────────────────────────────────
// 404 — Unknown Route
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TaskFlow API running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
  });
};

// Only start the server when this file is run directly (not during tests)
if (require.main === module) {
  startServer();
}

module.exports = app;
