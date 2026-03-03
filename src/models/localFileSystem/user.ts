import type { User } from "../../interfaces/user.interface";
import usersData from '../../data/users.json' with { type: 'json'}
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'lameramerasabortaquera'

const users : User[] = usersData

export class UserModel {

  async register (username: string, email: string, password: string, role: string) {
    
    if(!username || !email || !password || !role){
      throw new Error("Error en alguno de los campos");
    }

    const validateUser = users.findIndex( user => user.username === username )

    if(!validateUser) throw new Error('El username ya existe')

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
      role: role
    }

    users.push(newUser)
    return newUser
  }

  async login (username: string, password: string) {

    const user = users.find(u => u.username === username);

    if (!user) {
      throw new Error("El usuario no existe");
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch);

    if (!isMatch) {
      throw new Error("Contraseña incorrecta");
    }

    const token = jwt.sign(
      { id: user.username, role: user.role},
      JWT_SECRET,
      { expiresIn: '2h' }
    )

    return { message: "Loggeado con éxito", token };
  }


}