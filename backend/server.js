const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const langMiddleware = require('./src/middlewares/lang');
const { general: generalLimiter } = require('./src/middlewares/rateLimiter');
const errorHandler = require('./src/middlewares/errorHandler');
const apiRoutes = require('./src/routes');

async function bootstrap() {
  await connectDB();

  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({
    origin: env.CLIENT_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  }));
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(langMiddleware);
  app.use('/api/', generalLimiter);

  app.use('/api/v1', apiRoutes);

  app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
  app.use(errorHandler);

  app.listen(env.PORT, () => {
    console.log(`[server] Listening on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

bootstrap().catch((err) => {
  console.error('[bootstrap] Fatal:', err);
  process.exit(1);
});
