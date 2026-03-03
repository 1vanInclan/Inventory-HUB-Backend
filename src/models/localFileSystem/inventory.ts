import productsData from '../../data/products.json' with {type: 'json'}
import categoriesData from '../../data/categories.json' with {type: 'json'}
import transactionsData from '../../data/transactions.json' with {type: 'json'}

import type { Product, Categorie, Transaction } from '../../interfaces/inventory.interface'


  const products: Product[] = productsData
  const categories: Categorie[] = categoriesData
  const transactions: Transaction[] = transactionsData

export class InventoryModel {

  async addTransaction(productId: number, type: 'IN' | 'OUT', quantity: number) {
    
    const transaccion = {
      productId: Number(productId),
      type: type,
      quantity: Number(quantity)
    }

    const indexProduct:number = products.findIndex( product => product.id === Number(productId) )

    const product = products[indexProduct]

    if(!product){
      throw new Error("Product not found");
    }

    if(type === 'IN'){
      product.stock += Number(quantity);
    }

    if(type === 'OUT'){
      
      product.stock -= Number(quantity);
    }

    transactions.push(transaccion)

    return transaccion
  }

  async getInventoryValue() {
    const arrayWithDiscount = products.map(product => {
    
        const category = categories.find(cat => cat.id === product.categoryId)!;
        const { discount } = category;
    
        return {
          ...product,
          priceWithDiscount: product.price * (1 - discount/100)
        }
      })
    
      const result = arrayWithDiscount.reduce((acc, product) => {
        acc = acc + (product.priceWithDiscount * product.stock)
        return acc
      }, 0)
    
      return result       
  }

  async getTransactionById(productId: number) {

    const findTransactions = transactions.filter( transaction => transaction.productId === productId)

    return findTransactions

  }

  async getProductsLowStock() {
    const result = products.filter( product => product.stock < 5)
    return result
  }

}