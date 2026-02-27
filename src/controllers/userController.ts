import type { Request, Response } from "express";
// import { UserModel } from "../models/localFileSystem/user.ts";
import { UserModel } from "../models/mongoDB/user.ts";


export class UserController {

  private usersModel: UserModel

  constructor() {
    this.usersModel = new UserModel()
  }

  register = async (req: Request, res: Response) => {

    const { username, email, password, role } = req.body

    try {
      const result = await this.usersModel.register( username, email, password, role )
      res.status(201).json(result)
    } catch (e: any) {
      res.status(400).json({message: e.message})
    }

  }

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    
    try {
      const result = await this.usersModel.login( username, password )
      res.status(200).json(result)
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

}