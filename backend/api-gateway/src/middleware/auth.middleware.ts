/**
 * Middleware de autenticación para el API Gateway
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definir localmente los tipos para evitar problemas de importación
interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isPremium: boolean;
}

interface AuthenticatedRequest extends Request {
  user?: UserData;
  token?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware para verificar que el usuario está autenticado
 */
export const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Obtener el token del header Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'No se proporcionó token de autenticación'
        });
      }

      // Extraer el token de la cabecera 'Bearer token'
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Formato de token inválido'
        });
      }

      // Verificar y decodificar el token
      const decoded = jwt.verify(token, JWT_SECRET) as { user: UserData };
      
      // Añadir el usuario y el token a la request
      (req as AuthenticatedRequest).user = decoded.user;
      (req as AuthenticatedRequest).token = token;
      
      next();
    } catch (error) {
      console.error('Error al verificar token:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
  };
};

/**
 * Middleware para verificar roles de usuario
 * @param roles Array de roles permitidos
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    const userRole = authenticatedReq.user.role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso'
      });
    }
    
    next();
  };
}; 