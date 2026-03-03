import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController";

export const createProductsRouter = (): Router => {
  const productsRouter = Router()
  
  productsRouter.get('/low-stock', inventoryController.getProductsLowStock)

  return productsRouter
}