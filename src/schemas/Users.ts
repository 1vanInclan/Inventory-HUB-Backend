import { Schema, model } from "mongoose"; 
import type { User } from "../interfaces/user.interface";

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  role: { type: String, enum: [ 'admin', 'user' ], default: 'admin'}
}, {
  timestamps: true,
  versionKey: false
})

export const userModel = model<User>('User', userSchema)