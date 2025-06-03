import express from "express";
import dotenv from "dotenv"
import cors from "cors"

import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import saleRoutes from './routes/saleRoutes';

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

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint não encontrado. Por favor, verifique a URL e tente novamente.'
    });
})

// Middleware for handling errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro na API:', err.stack);
    res.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.',
        error: err.message
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})