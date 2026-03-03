import { Router } from "express";
import { UserController } from "../controllers/userController";


const userController = new UserController()

export const createAuthRouter = (): Router => {


  const authRouter = Router()

  /**
 * @openapi
 * /auth/register:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Registrar usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: ivan
 *              email:
 *                type: string
 *                example: iva@gmail.com
 *              password:
 *                type: string
 *                example: 123456
 *              role:
 *                type: string
 *                example: admin
 *    responses:
 *      200:
 *        description: Registro exitoso
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Usuario registrado con exito
 *                data:
 *                  type: object
 *      400:
 *        description: Credenciales inválidas
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Datos Invalidos
 *                errors:
 *                  type: object
 */

  authRouter.post('/register', userController.register)


/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *      - Auth
 *    summary: Iniciar sesión de usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: ivan
 *              password:
 *                type: string
 *                example: 123456
 *    responses:
 *      200:
 *        description: Login exitoso, retorna el token
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Loggeado con exito
 *                token:
 *                  type: string
 *      401:
 *        description: Credenciales inválidas
 */

  authRouter.post('/login', userController.login)

  return authRouter
}