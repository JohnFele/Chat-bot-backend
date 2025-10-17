// import 'dotenv/config';
import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import compression from 'compression';
import morgan from 'morgan';
import config from './src/config/index.js';
import { securityMiddleware } from './src/middleware/security.middleware.js';

import chatRoutes from './src/routes/gemini.routes.js';
import errorHandler from './src/middleware/errorHandler.middleware.js';

const app = express();

app.use(securityMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV 
  });
})

app.use('/api/chat', chatRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`CORS enabled for: ${config.CORS_ORIGIN || 'http://localhost:3000'}`);
});

export default app;