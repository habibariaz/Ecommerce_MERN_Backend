import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import CategoryRoutes from './routes/CategoryRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'

//cocnfigure env
dotenv.config()

//database config
connectDB();

//rest object
const app = express()


app.use(cors({ origin: ["https://ecommerce-mern-frontend-delta.vercel.app"] }));

//middleware
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/category', CategoryRoutes);
app.use('/api/v1/auth/product', ProductRoutes)

//rest API
// app.get('/', (req, res) => {
//     res.send("<h1>Welcome To ECommerce MERN Stack App</h1>")
// })

//PORT
const PORT = process.env.PORT || 8000;

//listen
app.listen(PORT, () => {
    console.log(`Sever Running on ${process.env.Mode} mode on node Port ${PORT}`)
})
