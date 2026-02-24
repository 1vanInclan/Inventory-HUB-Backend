Requerimientos:

1. POST /transactions: Si entra (IN), aumenta el stock; si sale (OUT), resta el stock (pero no puede quedar negativo). Debe guardar la transacción en un array.

2. GET /stats/inventory-value: Calcula cuánto dinero hay en stock total usando el precio con descuento según su categoría.

3. GET /stats/movement-history/:productId: Devuelve todas las transacciones de un producto específico.

4. GET /products/low-stock: Devuelve solo los productos con stock menor a 5 unidades.