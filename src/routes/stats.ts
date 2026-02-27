import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController.ts";
import { verifyToken } from "../middlewares/auth.middleware.ts";

export const createStatsRouter = () => {
  const statsRouter = Router()

  statsRouter.use(verifyToken)
  
  statsRouter.get('/inventory-value', inventoryController.getInventoryValue)
  statsRouter.get('/movement-history/:productId', inventoryController.getTransactionsById)

  return statsRouter
}