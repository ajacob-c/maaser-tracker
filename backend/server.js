require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import utilities
const logger = require("./utils/logger");
const { errorHandler, handleDatabaseError } = require("./utils/errorHandler");
const requestLogger = require("./middleware/requestLogger");
const { generalLimiter, authLimiter, dataModificationLimiter } = require("./middleware/rateLimiter");

// Import routes
const authRoutes = require("./routes/auth");
const incomeRoutes = require("./routes/income");
const tzedakaRoutes = require("./routes/tzedaka");
const summaryRoutes = require("./routes/summary");

const app = express();
//app.use(cors());
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply stricter rate limiting to authentication routes
app.use("/auth", authLimiter, authRoutes);

// Apply data modification rate limiting to routes that modify data
app.use("/income", dataModificationLimiter, incomeRoutes);
app.use("/tzedaka", dataModificationLimiter, tzedakaRoutes);

// Summary routes (read-only) use general rate limiting
app.use("/summary", summaryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
    errorCode: 'ROUTE_NOT_FOUND'
  });
});

const PORT = process.env.PORT || 5000;

// Database connection with error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected successfully');
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch(err => {
    logger.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

