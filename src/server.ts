import express from 'express'
import userRouter from './routes/userRoutes.js'
import threadsRouter from './routes/threadsRoutes.js'

const app = express()
app.use(express.json())

app.use('/api/users',userRouter)
app.use('/api/threads',threadsRouter)


app.listen(3000, () =>console.log("server running on http://localhost:3000")); 