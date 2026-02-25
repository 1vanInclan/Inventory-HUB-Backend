import { model, Schema } from "mongoose";
import type { Transaction } from '../interfaces/inventory.interface.ts'

const transactionsSchema = new Schema<Transaction>({
  productId: {type: Number, required: true, ref: 'Product'},
  type: { type: String, required: true, enum: ["IN", "OUT"]},
  quantity: { type: Number, required: true }
}, {
  timestamps: true,
  versionKey: false
})

export const transactionModel = model<Transaction>('Transaction', transactionsSchema)