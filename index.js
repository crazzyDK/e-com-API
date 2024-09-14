import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import {connectDB} from './config/DB.js';
import authRouter from './routes/authRoute.js';
import productRouter from './routes/productRoute.js';
import blogRouter from './routes/BlogRoute.js';
import categoryRouter from './routes/prodcategoryRoute.js';
import bcategoryRouter from './routes/blogcategoryRoute.js';
import coupenRouter from './routes/coupenRoute.js';
import BrandRouter from './routes/brandRoute.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/blog-category', bcategoryRouter);
app.use('/api/v1/brand', BrandRouter);
app.use('/api/v1/coupen', coupenRouter);

// middleware
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 8000;
app.listen(port, ()=> {
  connectDB();
  console.log(`Server is running on ${port}`);
});