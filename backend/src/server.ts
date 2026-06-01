import express from 'express';
import userRouter from './routes/userRoutes.js';
import threadsRouter from './routes/threadsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import entrieRouter from './routes/entriesRoutes.js';
import swaggerUi from 'swagger-ui-express';
import { specs } from './lib/swagger.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5501', 'http://localhost:5501'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiados pedidos a partir deste IP, tente novamente mais tarde.' }
});
app.use(limiter);

app.use('/api/users', userRouter);
app.use('/api/threads', threadsRouter);
app.use('/api/notifications', notificationRoutes);
app.use('/api/entries', entrieRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use((_req,_res,next)=>{
  const err:any = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler);


app.listen(3000, () => console.log('server running on http://localhost:3000'));
export default app;