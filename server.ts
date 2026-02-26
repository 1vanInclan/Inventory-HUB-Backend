import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'

import { createTransactionsRouter } from './src/routes/transactions.ts'
import { createStatsRouter } from './src/routes/stats.ts'
import { createProductsRouter } from './src/routes/products.ts'
import { connectDB } from './src/config/db.ts'
import { createAuthRouter } from './src/routes/auth.ts'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

connectDB();

app.use('/auth', createAuthRouter())

app.use('/transactions', createTransactionsRouter())
app.use('/stats', createStatsRouter())
app.use('/products', createProductsRouter())


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})