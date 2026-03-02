import type { Request, Response, NextFunction } from 'express';
import productsData from '../data/products.json' with {type: 'json'};
import { transactionValidation } from '../validators/transactionValidations.ts';
import {z} from 'zod'

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
    const { productId, type, quantity } = req.body;

    // if (!productId || !type || !quantity) {
    //     return res.status(400).json({ message: "Faltan campos obligatorios: productId, type, quantity" });
    // }

    try {
      const validateData = transactionValidation.parse({ productId, type, quantity })
      next();
    } catch (e: any) {
          
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Datos Invalidos',
          errors: e.flatten().fieldErrors
        })
      }
    }



    // const product = productsData.find(p => p.id === Number(productId));
    // if (!product) {
    //     return res.status(404).json({ message: `El producto con ID ${productId} no existe` });
    // }

    // if (type === 'OUT' && Number(quantity) > product.stock) {
    //     return res.status(409).json({ 
    //         message: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}` 
    //     });
    // }

   
};