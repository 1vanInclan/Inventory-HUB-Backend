import { productModel } from "../schemas/Products.ts";
import { categorieModel } from "../schemas/Categories.ts"
import { transactionModel } from "../schemas/Transaction.ts";

import productsData from '../data/products.json' with { type: 'json'}
import categoriesData  from '../data/categories.json' with { type: 'json' }
import transactionsData  from '../data/transactions.json' with { type: 'json' }


import { connectDB } from "../config/db.ts";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const seedDatabase = async () => {

  try {
    await connectDB();

    await productModel.deleteMany({});
    await categorieModel.deleteMany({});
    await transactionModel.deleteMany({});
    console.log('🗑️ Colección de productos, categorias y transacciones limpia');

    await productModel.insertMany(productsData);
    await categorieModel.insertMany(categoriesData);
    await transactionModel.insertMany(transactionsData);
    console.log('🚀 ¡Datos migrados a MongoDB con éxito!');

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');

  } catch (e) {
    console.error('❌ Error en la migración:', e);
    process.exit(1);
  }
}

seedDatabase()