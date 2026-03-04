import type { Request, Response } from "express";
// import { UserModel } from "../models/localFileSystem/user";
import { UserModel } from "../models/mongoDB/user";
import { loginValidation, userValidation } from "../validators/userValidations";
import z from "zod";


export class UserController {

  private usersModel: UserModel

  constructor() {
    this.usersModel = new UserModel()
  }

  register = async (req: Request, res: Response) => {

    const { username, email, password, role } = req.body

    try {

      const validateData = userValidation.parse({username, email, password, role})

      const result = await this.usersModel.register( validateData.username, validateData.email, validateData.password, validateData.role )

      res.status(201).json(result)

    } catch (e) {
      if( e instanceof z.ZodError ){
        return res.status(400).json({
          message: 'Datos Invalidos',
          errors: e.flatten().fieldErrors
        })
      }
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      res.status(500).json({ message: errorMessage });
    }

  }

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    
    try {

      const validateData = loginValidation.parse({ username, password})

      const result = await this.usersModel.login( validateData.username, validateData.password )

      res.status(200).json(result)

    } catch (e: any) {
      
      if (e instanceof z.ZodError) {
      return res.status(400).json({
        message: "Credenciales inválidas",
      });
      }

      res.status(401).json({ message: e.message })
    }
  }

}