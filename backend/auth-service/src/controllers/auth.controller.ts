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

    const { email, password, firstName, lastName } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ 
        success: false, 
        message: 'El usuario ya existe con este email' 
      });
      return;
    }

    // Crear nuevo usuario
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      plan: 'free',
      active: true,
      lastLogin: new Date()
    });

    // Guardar usuario
    await user.save();

    // Generar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      plan: user.plan
    });

    // Publicar evento de usuario registrado
    await publishEvent('user.registered', {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
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
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan
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
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    // Buscar usuario por email con password (select: false por defecto)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      res.status(401).json({ 
        success: false, 
        message: 'La cuenta está desactivada. Por favor contacta con soporte.' 
      });
      return;
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
      return;
    }

    // Actualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Generar token JWT
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      plan: user.plan
    });

    // Publicar evento de inicio de sesión
    await publishEvent('user.loggedin', {
      userId: user._id.toString(),
      email: user.email,
      timestamp: new Date()
    });

    // Responder con éxito
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan
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

    // Buscar usuario por ID
    const user = await User.findById((decoded as DecodedToken).userId);
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.active) {
      res.status(401).json({ 
        success: false, 
        message: 'La cuenta está desactivada' 
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
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan
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