import type { Request, Response } from 'express'
// import { InventoryModel } from '../models/localFileSystem/inventory.ts'
import { InventoryModel } from '../models/mongoDB/inventory.ts';
import { transactionValidation } from '../validators/transactionValidations.ts';

class InventoryController {

  private inventoryModel: InventoryModel;

  constructor () {
    this.inventoryModel = new InventoryModel()
  }

  addTransaction = async (req: Request, res: Response) => {
  const { productId, type, quantity } = req.body

  try {

    // const validateData = transactionValidation.parse({productId, type, quantity})

    const transaction = await this.inventoryModel.addTransaction(productId, type, quantity)

    res.json(transaction)

  } catch(e) {
    res.status(400).json({
      success: false,
      error: e instanceof Error ? e.message : 'Error desconocido'
    })
    }  
  }
  
  getInventoryValue = async (req: Request, res: Response) => {

    try {
      const inventoryValue = await this.inventoryModel.getInventoryValue()
      res.json({InventoryValue: inventoryValue})
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : 'Error desconocido'
      })
    }
  }

  getTransactionsById = async (req: Request, res: Response) => {
    const { productId } = req.params
    try {
      const results = await this.inventoryModel.getTransactionsById(Number(productId))
      res.status(200).json(results)
    } catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : 'Error desconocido'
      })
    }

  }

  getProductsLowStock = async (req: Request, res: Response) => {
    
    try {
      const products = await this.inventoryModel.getProductsLowStock()
      res.status(200).json(products)
    }catch (e) {
      res.status(400).json({
        success: false,
        error: e instanceof Error ? e.message : 'Error desconocido'
      })
    }
    
  }


}

export const inventoryController = new InventoryController