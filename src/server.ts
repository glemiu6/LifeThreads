import express from 'express'
import userRouter from './routes/userRoutes.js'
import threadsRouter from './routes/threadsRoutes.js'
import notificationRoutes from "./routes/notification.routes";
import swaggerUi from "swagger-ui-express";
import { specs } from "./lib/swagger.js";


const app = express()
app.use(express.json())

app.use('/api/users',userRouter)
app.use('/api/threads',threadsRouter)
app.use("/api/notifications", notificationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.listen(3000, () =>console.log("server running on http://localhost:3000")); 
