import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'lameramerasabortaquera'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    (req as any).user = decoded; 
    
    next(); // ¡Todo bien! Pasa al siguiente paso (el controlador)
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado." });
  }
}