import { z } from 'zod'


export const transactionValidation = z.object({

  productId: z.number('El product id es requerido'),
  type: z.enum(['OUT',"IN"], "Solo se admiten los valores OUT y IN"),
  quantity: z.number('El quantity debe ser mayor a 1')
    .min(1, "La cantidad minima es 1")

})