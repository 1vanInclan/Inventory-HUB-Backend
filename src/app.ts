import express, { type Application } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createTransactionsRouter } from '../src/routes/transactions'
import { createStatsRouter } from '../src/routes/stats'
import { createProductsRouter } from '../src/routes/products'
import { createAuthRouter } from '../src/routes/auth'

const app: Application = express()

app.use(express.json())
app.use(cors())


// 1. Configuración de Metadatos
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Inventory Hub API',
      version: '1.0.0',
      description: 'API para la gestión de inventarios - Fullstack Project',
      contact: {
        name: 'Ivan',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo (Docker)',
      },
    ],
  },
  // 2. Ruta a los archivos que contienen las anotaciones
  apis: ['./server.ts', './src/routes/*.ts'], 
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', createAuthRouter())
app.use('/transactions', createTransactionsRouter())
app.use('/stats', createStatsRouter())
app.use('/products', createProductsRouter())

export default app; // <--- ESTO ES LA CLAVE