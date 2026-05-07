import express from 'express'
import userRouter from './routes/userRoutes.js'
import threadsRouter from './routes/threadsRoutes.js'
import notificationRoutes from "./routes/notificationRoutes.js";
import entrieRouter from "./routes/entriesRoutes.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./lib/swagger.js";
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';


const app = express()
app.use(helmet())
app.use(express.json())
app.use(cors({
origin: ['http://localhost:5173', 'http://127.0.0.1:5501','http://localhost:5501'], // Altere para a porta do seu Live Server
methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
const limiter = rateLimit({
windowMs: 15 * 60 * 1000, // Janela de 15 minutos
max: 100, // Limite de 100 pedidos por IP
message: { error: "Demasiados pedidos a partir deste IP, tente novamente mais tarde." }
});
app.use(limiter);
app.use('/api/users',userRouter)
app.use('/api/threads',threadsRouter)
app.use("/api/notifications", notificationRoutes);
app.use('/api/entries', entrieRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.listen(3000, () =>console.log("server running on http://localhost:3000")); 
