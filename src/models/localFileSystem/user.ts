import type { User } from "../../interfaces/user.interface";
import usersData from '../../data/users.json' with { type: 'json'}

const users : User[] = usersData

export class UserModel {

  async register (username: string, email: string, password: string, role: string) {
    
    if(!username || !email || !password || !role){
      throw new Error("Error en alguno de los campos");
    }

    const validateUser = users.findIndex( user => user.username === username )

    if(!validateUser) throw new Error('El username ya existe')
    
    const id = users.length

    const newUser = {
      id: id + 1,
      username: username,
      email: email,
      password: password,
      role: role
    }

    users.push(newUser)
    return newUser
  }

  async login (username: string, password: string) {

    const validateUser = users.findIndex( user => user.username === username )

    if (validateUser === -1) {
      throw new Error("El usuario no existe");
    }

    if (users[validateUser].password !== password) {
      throw new Error("Contraseña incorrecta");
    }

    return { message: "Loggeado con éxito", user: users[validateUser] };
  }


}