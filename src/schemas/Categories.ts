import { Schema, model } from "mongoose";
import type {Categorie} from '../interfaces/inventory.interface'

const categorieSchema = new Schema<Categorie>({
  id: {type: Number, required: true, unique: true},
  name: {type: String, required: true},
  discount: {type: Number, required: false, default: 0}
}, {
  timestamps: true,
  versionKey: false
})

export const categorieModel = model<Categorie>('Categorie', categorieSchema)