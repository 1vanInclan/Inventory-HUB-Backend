import { userModel } from '../../schemas/Users.ts'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'lameramerasabortaquera'


export class UserModel {

  async register (username: string, email: string, password: string, role: string) {
    
    if(!username || !email || !password || !role){
      throw new Error("Error en alguno de los campos");
    }

    const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
    
    if (existingUser) throw new Error('El username o correo ya esta ocupado')

    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: role
    })
    
    return {Message: 'Usuario registrado con exito', data: {username: newUser.username, role: newUser.role} }

  }

  async login (username: string, password: string) {

    const user = await userModel.findOne({ username }).lean();
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas'); 
    }
    
    const token = jwt.sign(
          { id: user?._id, role: user?.role},
          JWT_SECRET,
          { expiresIn: '2h' }
        )
    return {message: 'Loggeado con exito', token}
  }


}