/**
 * Controladores para el servicio de autenticación
 */

import { Request, Response } from 'express';
import { User, IUser } from '@backend/auth-service/src/models/user.model';
import { validationResult } from 'express-validator';
import { publishEvent } from '@shared/libs/rabbitmq';
import { generateToken, verifyToken, DecodedToken } from '@shared/config/jwt.config';

/**
 * Registra un nuevo usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const user = await authService.registerUser({
      email,
      password
      role: Role.USER
    });

    // Guardar usuario
    await user.save();

    // Generar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email
    });

    // Publicar evento de usuario registrado
    await publishEvent('user.registered', {
      userId: user._id.toString(),
      email: user.email,
      timestamp: new Date()
    });

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Inicia sesión con un usuario existente
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    // Responder con éxito
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Verifica un token JWT y devuelve los datos del usuario
 */
export const verify = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ 
        success: false, 
        message: 'Token no proporcionado' 
      });
      return;
    }

    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
      return;
    }

    // Responder con éxito
    res.status(200).json({
      success: true,
      message: 'Token válido',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al verificar token',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}; 