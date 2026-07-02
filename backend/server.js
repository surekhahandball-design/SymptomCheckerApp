import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

import connectDB from './config/database.js';
import { env } from './config/env.js';
import { seedDatabase } from './utils/seeder.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import symptomRoutes from './routes/symptoms.js';
import diseaseRoutes from './routes/diseases.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import historyRoutes from './routes/history.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

const app = express();

// CORS — allow multiple dev origins (5173, 5174, 5175, etc.)
app.use(cors({
  origin(origin, callback) {
    // Allow non-browser tools (Postman, curl) and same-origin requests
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(helmet());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: env.maxRequestsPerMinute,
  message: { success: false, message: 'Too many requests from this IP, please try again later' },
});
app.use('/api/', limiter);

// Body parser — must be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Dev request logger for auth routes
if (env.nodeEnv === 'development') {
  app.use('/api/auth', (req, _res, next) => {
    console.log(`[AUTH] ${req.method} ${req.originalUrl}`, req.body);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

let server;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  server = app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
    console.log(`CORS origins: ${env.corsOrigins.join(', ')}`);
  });
};

const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  if (!server) {
    process.exit(0);
    return;
  }

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
