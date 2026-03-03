import { productModel } from "../../schemas/Products";
import { transactionModel } from "../../schemas/Transaction";

export class InventoryModel {
  
  async addTransaction(productId: number, type: 'IN' | 'OUT', quantity: number) {
  // 1. Determinamos el factor de cambio (positivo para IN, negativo para OUT)
  const stockChange = type === 'IN' ? Number(quantity) : -Number(quantity);

  // 2. Actualizamos el stock en la colección de Productos
  // Usamos findOneAndUpdate para buscar por TU campo 'id'
  const updatedProduct = await productModel.findOneAndUpdate(
    { id: Number(productId) }, 
    { $inc: { stock: stockChange } }, // $inc suma (o resta si es negativo) automáticamente
    { new: true } // Esto nos devuelve el producto YA actualizado
  );

  if (!updatedProduct) {
    throw new Error('Producto no encontrado');
  }

  // 3. Creamos el registro en la colección de Transacciones
  const nuevaTransaccion = await transactionModel.create({
    productId: Number(productId),
    type: type,
    quantity: Number(quantity)
  });

  return nuevaTransaccion;
  }

  async getInventoryValue () {
    const result = await productModel.aggregate([
    {
      // 1. Unimos (Join) con la colección de categorías
      $lookup: {
        from: 'categories', // nombre de la colección en la DB
        localField: 'categoryId',
        foreignField: 'id',
        as: 'categoryDetails'
      }
    },
    { $unwind: '$categoryDetails' },
    {
      // 2. Calculamos el valor por cada producto aplicando el descuento
      $project: {
        totalProductValue: {
          $multiply: [
            '$stock',
            { 
              $multiply: [
                '$price', 
                { $subtract: [1, { $divide: ['$categoryDetails.discount', 100] }] }
              ] 
            }
          ]
        }
      }
    },
    {
      // 3. Sumamos todo en un solo gran total
      $group: {
        _id: null,
        totalInventoryValue: { $sum: '$totalProductValue' }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalInventoryValue : 0;
  }

  async getTransactionsById (productId: number) {

    const transactions = await transactionModel.find({ productId : Number(productId) }).lean()
    return transactions

  }

  async getProductsLowStock () {

    const products = await productModel.find({ 
      stock: { $lt: 5 }
    }).sort({ stock: 1 }).lean()

    return products
  }

}