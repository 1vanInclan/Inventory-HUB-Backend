import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController.ts";
import { validateTransaction } from "../middlewares/inventory.middleware.ts";

export const createTransactionsRouter = () => {
  const transactionsRouter = Router()
  
  transactionsRouter.post('/', validateTransaction ,inventoryController.addTransaction)

  return transactionsRouter
}