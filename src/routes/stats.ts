import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController";
import { verifyToken } from "../middlewares/auth.middleware";

export const createStatsRouter = () => {
  const statsRouter = Router()

  statsRouter.use(verifyToken)
  
  statsRouter.get('/inventory-value', inventoryController.getInventoryValue)
  statsRouter.get('/movement-history/:productId', inventoryController.getTransactionsById)

  return statsRouter
}