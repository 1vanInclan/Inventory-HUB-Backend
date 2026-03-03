import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController";
import { validateTransaction } from "../middlewares/inventory.middleware";

export const createTransactionsRouter = (): Router => {
  const transactionsRouter = Router()
  
  transactionsRouter.post('/', validateTransaction ,inventoryController.addTransaction)

  return transactionsRouter
}