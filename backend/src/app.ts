import express, { Application } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

const app: Application = express();

// Request logging middleware (should be first)
app.use(requestLogger);

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/api', taskRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
