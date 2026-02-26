import { Router } from "express";
import { UserController } from "../controllers/userController.ts";


const userController = new UserController()

export const createAuthRouter = () => {


  const authRouter = Router()

  authRouter.post('/register', userController.register)

  authRouter.post('/login', userController.login)

  return authRouter
}