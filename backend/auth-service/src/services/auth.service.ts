/**
 * Servicio de autenticación
 * Implementa la lógica de negocio para registro, login y verificación de usuarios
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, IUser } from '@backend/auth-service/src/models/user.model';
import { sendVerificationEmail } from '@backend/auth-service/src/services/email.service';
import { publishEvent } from '@shared/libs/rabbitmq';
import { generateToken } from '@shared/config/jwt.config';

/**
 * Registra un nuevo usuario en el sistema
 * @param userData Datos del usuario a registrar
 */
export const registerUser = async (userData: any): Promise<IUser> => {
  // 1. Validar datos de entrada
  if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
    throw new Error('Faltan campos requeridos');
  }

  // 2. Verificar que el email no existe en la base de datos
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('El usuario ya existe con este email');
  }

  // 3. Crear el usuario en la base de datos
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    plan: 'free',
    active: false, 
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  await newUser.save();

  // 4. Generar y enviar email de verificación
  // Generamos un token aleatorio para la verificación
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await sendVerificationEmail(newUser.email, newUser.firstName, verificationToken);

  // 5. Publicar evento de usuario registrado
  await publishEvent('user.registered', {
    userId: newUser._id.toString(),
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    timestamp: new Date().toISOString()
  });

  return newUser;
};

/**
 * Autentica a un usuario con email y contraseña
 * @param email Email del usuario
 * @param password Contraseña del usuario
 */
export const loginUser = async (email: string, password: string): Promise<{user: IUser, token: string}> => {
  // TODO: Implementar la lógica de inicio de sesión
  // 1. Buscar usuario por email
  // 2. Verificar contraseña
  // 3. Generar token JWT
  // 4. Actualizar lastLogin y guardar
  // 5. Publicar evento de inicio de sesión
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas');
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    plan: user.plan
  });

  user.lastLogin = new Date();
  await user.save();

  await publishEvent('user.loggedin', {
    userId: user._id.toString(),
    email: user.email,
    timestamp: new Date().toISOString()
  });

  return { user, token };
};

/**
 * Verifica un token JWT
 * @param token Token JWT a verificar
 */
export const verifyUserToken = async (token: string): Promise<any> => {
  // TODO: Implementar la verificación de token
  // 1. Verificar firma y expiración del token
  // 2. Obtener información actualizada del usuario
  throw new Error('Método no implementado');
};

/**
 * Cambia la contraseña de un usuario
 * @param userId ID del usuario
 * @param currentPassword Contraseña actual
 * @param newPassword Nueva contraseña
 */
export const changePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  // TODO: Implementar cambio de contraseña
  // 1. Buscar usuario por ID
  // 2. Verificar contraseña actual
  // 3. Validar nueva contraseña
  // 4. Actualizar contraseña y guardar
  throw new Error('Método no implementado');
};

/**
 * Inicia el proceso de recuperación de contraseña
 * @param email Email del usuario
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  // TODO: Implementar solicitud de restablecimiento de contraseña
  // 1. Buscar usuario por email
  // 2. Generar token único y temporal
  // 3. Guardar token en el usuario
  // 4. Enviar email con instrucciones
  throw new Error('Método no implementado');
}; 