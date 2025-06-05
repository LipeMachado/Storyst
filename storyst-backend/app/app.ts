import express, {Request, Response, NextFunction} from "express";
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import saleRoutes from './routes/saleRoutes';
import ApiError from './utils/ApiError';
import errorHandler from "./middlewares/errorHandler";

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors())
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/sales', saleRoutes)

app.get('/', (req, res) => {
    res.send('Api is running');
})

app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ApiError(404, 'Rota não encontrada.'));
});

app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

export default app;