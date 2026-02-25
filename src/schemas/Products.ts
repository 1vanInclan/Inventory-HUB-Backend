import { Schema, model } from "mongoose";
import type { Product } from "../interfaces/inventory.interface.ts"

const productSchema = new Schema<Product>({
  id: {type: Number, required: true, unique: true},
  name: { type: String, required: true},
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  categoryId: { type: Number, required: true, ref: 'Categorie' },
  }, { 
    timestamps: true,
    versionKey: false //Quitar __v
  })

export const productModel = model<Product>('Product', productSchema)