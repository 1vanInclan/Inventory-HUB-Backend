import { productModel } from "../models/Products.ts";
import productsData from '../data/products.json' with {type: 'json'}
import { connectDB } from "../config/db.ts";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const seedDatabase = async () => {

  try {
    await connectDB();

    await productModel.deleteMany({});
    console.log('🗑️ Colección de productos limpia');

    await productModel.insertMany(productsData);
    console.log('🚀 ¡Datos migrados a MongoDB con éxito!');

    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');

  } catch (e) {
    console.error('❌ Error en la migración:', e);
    process.exit(1);
  }
}

seedDatabase()