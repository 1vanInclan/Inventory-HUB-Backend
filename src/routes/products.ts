import { Router } from "express";
import { inventoryController } from "../controllers/inventoryController";

export const createProductsRouter = () => {
  const productsRouter = Router()
  
  productsRouter.get('/low-stock', inventoryController.getProductsLowStock)

  return productsRouter
}