
import express from 'express'
import cors from "cors"
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { config } from "dotenv"
import userRoutes from './src/routes/user.routes.js'
import errorMiddleware from './src/middlewares/error.middlewares.js'
// import { register } from './controllers/user.controllers.js'

config()

// Create an Express app
const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}))
app.use(morgan('dev'))

app.use('/api/v1/users',userRoutes)
// app.use('/api/v1/register',register)


app.use('/ping',(req,res) =>{
    res.send('pong')
})

app.all('*',(req,res) =>{
    res.status(400).send('OOPS PAGE NOT FOUND')
})

app.use(errorMiddleware);

export default app;
