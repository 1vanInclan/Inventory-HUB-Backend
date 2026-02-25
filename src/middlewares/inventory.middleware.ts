import type { Request, Response, NextFunction } from 'express';
import productsData from '../data/products.json' with {type: 'json'};

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
    const { productId, type, quantity } = req.body;

    if (!productId || !type || !quantity) {
        return res.status(400).json({ message: "Faltan campos obligatorios: productId, type, quantity" });
    }

    const product = productsData.find(p => p.id === Number(productId));
    if (!product) {
        return res.status(404).json({ message: `El producto con ID ${productId} no existe` });
    }

    if (type === 'OUT' && Number(quantity) > product.stock) {
        return res.status(409).json({ 
            message: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}` 
        });
    }

    next();
};