/**
 * Middleware de autenticación para el servicio de auth
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '@backend/auth-service/src/types';
import { Auth } from '@types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Middleware para verificar que el usuario está autenticado
 */
export const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No hay token de autenticación',
        data: null
      });
    }
    
    // Extraer el token
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET) as { user: Auth.UserData };
      
      // Añadir el usuario al request
      (req as AuthenticatedRequest).user = decoded.user;
      (req as AuthenticatedRequest).token = token;
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado',
        data: null
      });
    }
  };
};

/**
 * Middleware para verificar roles de usuario
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que haya un usuario en el request (depende del middleware de autenticación)
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        data: null
      });
    }
    
    // Verificar que el usuario tenga el rol requerido
    if (roles.includes(authReq.user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        data: null
      });
    }
  };
}; 