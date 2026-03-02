import { z } from 'zod'

export const userValidation = z.object({

  username: z.string()
    .min(3, "El username debe tener al menos 3 caracteres")
    .max(20, "El username es demasiado largo"),
  email: z.email('Formato de email invalido'),
  password: z.string()
    .min(5, "La contraseña debe tener al menos 5 caracteres"),
  role: z.enum([ 'admin', 'user']).default('admin')
  
});

export const loginValidation = userValidation.pick({
  username: true,
  password: true
})