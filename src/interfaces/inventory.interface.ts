export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface Categorie {
  id: number;
  name: string;
  discount: number;
}

export interface Transaction {
  productId: number;
  type: string;
  quantity: number;
}