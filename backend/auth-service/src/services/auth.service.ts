/**
 * Servicio de autenticación
 * Implementa la lógica de negocio para registro, login y verificación de usuarios
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, IUser } from '@backend/auth-service/src/models/user.model';
import { sendVerificationEmail,sendPasswordResetEmail } from '@backend/auth-service/src/services/email.service';
import { publishEvent } from '@shared/libs/rabbitmq';
import { generateToken,verifyToken} from '@shared/config/jwt.config';

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

  // 4. Generar y enviar email de verificación
  // Generamos un token aleatorio para la verificación
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const tokenData = {token: verificationToken};
  newUser.tokenData =  tokenData;
  await newUser.save();

  await sendVerificationEmail(newUser.email, newUser.username, verificationToken);

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
  const decoded = verifyToken(token);
  if(!decoded) {
    throw new Error('Token inválido o expirado');
  } 
  // 2. Obtener información actualizada del usuario
  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return {
    userId: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    plan: user.plan
  };
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
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Verificar contraseña actual
  const correctPassword = await user.comparePassword(currentPassword);
  if (!correctPassword) {
    throw new Error('Credenciales incorrectas');
  }
  // 3. Validar nueva contraseña
  if (newPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    throw new Error('La nueva contraseña debe contener al menos una mayúscula y un número');
  }
  // 4. Actualizar contraseña y guardar
  user.password=newPassword;
  await user.save();
  return true;
};

/**
 * Inicia el proceso de recuperación de contraseña
 * @param email Email del usuario
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  // TODO: Implementar solicitud de restablecimiento de contraseña
  // 1. Buscar usuario por email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Generar token único y temporal
  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpiration = new Date();
  tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Válido por 1 hora
  // 3. Guardar token en el usuario
  user.tokenData.token = token
  user.tokenData.expiration = tokenExpiration

  await user.save();

  // 4. Enviar email con instrucciones
  await sendPasswordResetEmail(user.email, user.username, token);

  return true;
}; 