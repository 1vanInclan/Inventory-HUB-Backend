import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController.ts";

export const createStatsRouter = () => {
  const statsRouter = Router()
  
  statsRouter.get('/inventory-value', inventoryController.getInventoryValue)
  statsRouter.get('/movement-history/:productId', inventoryController.getTransactionsById)

  return statsRouter
}