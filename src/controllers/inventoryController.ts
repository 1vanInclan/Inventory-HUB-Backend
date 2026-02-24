import productsData from '../data/products.json' with {type: 'json'}
import categoriesData from '../data/categories.json' with {type: 'json'}
import transactionsData from '../data/transactions.json' with {type: 'json'}

import { Product, Categorie, Transaction } from '../interfaces/inventory.interface.ts'

import type { Request, Response } from 'express'

class InventoryController {

  private products: Product[]
  private categories: Categorie[]
  private transactions: Transaction[]

  constructor () {
    this.products = productsData
    this.categories = categoriesData
    this.transactions = transactionsData
  }

  addTransaction = async (req: Request, res: Response) => {
  const { productId, type, quantity } = req.body

  const transaccion = {
    productId: Number(productId),
    type: type,
    quantity: Number(quantity)
  }

  const indexProduct = this.products.findIndex( product => product.id === Number(productId) )

  if(type === 'IN'){
    this.products[indexProduct].stock = this.products[indexProduct].stock + Number(quantity)
  }

  if(type === 'OUT'){
    
    this.products[indexProduct].stock = this.products[indexProduct].stock - Number(quantity)
  }

  this.transactions.push(transaccion)

  return res.status(201).json({ message: "Transaccion creada" })
  }

  getInventoryValue = async (req: Request, res: Response) => {

  const arrayWithDiscount = this.products.map(product => {

    const { discount } = this.categories.find( category => category.id === product.categoryId )

    return {
      ...product,
      priceWithDiscount: product.price * (1 - discount/100)
    }
  })

  const result = arrayWithDiscount.reduce((acc, product) => {
    acc = acc + (product.priceWithDiscount * product.stock)
    return acc
  }, 0)

  return res.status(200).json({ ValorTotal: result })
  
  }

  getTransactionsById = async (req: Request, res: Response) => {
  const { productId } = req.params

  const findTransactions = this.transactions.filter( transaction => transaction.productId === Number(productId))

  res.status(200).json(findTransactions)

  }

  getProductsLowStock = async (req: Request, res: Response) => {
  const result = this.products.filter( product => product.stock < 5)
  res.status(200).json(result)
  }


}

export const inventoryController = new InventoryController