import { productModel } from "../schemas/Products";
import { categorieModel } from "../schemas/Categories"
import { transactionModel } from "../schemas/Transaction";
import { userModel } from "../schemas/Users";

import productsData from '../data/products.json' with { type: 'json'}
import categoriesData  from '../data/categories.json' with { type: 'json' }
import transactionsData  from '../data/transactions.json' with { type: 'json' }
import usersData from '../data/users.json' with { type: 'json'}


import { connectDB } from "../config/db";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const seedDatabase = async () => {

  try {
    await connectDB();

    await productModel.deleteMany({});
    await categorieModel.deleteMany({});
    await transactionModel.deleteMany({});
    await userModel.deleteMany({});
    console.log('🗑️ Colección de productos, categorias y transacciones limpia');

    await productModel.insertMany(productsData);
    await categorieModel.insertMany(categoriesData);
    await transactionModel.insertMany(transactionsData);
    await userModel.insertMany(usersData);
    console.log('🚀 ¡Datos migrados a MongoDB con éxito!');

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');

  } catch (e) {
    console.error('❌ Error en la migración:', e);
    process.exit(1);
  }
}

seedDatabase()