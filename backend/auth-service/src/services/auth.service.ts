/**
 * Servicio de autenticación
 * Implementa la lógica de negocio para registro, login y verificación de usuarios
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Role, User } from '@backend/auth-service/src/models/user.model';
import { sendVerificationEmail,sendPasswordResetEmail } from '@backend/auth-service/src/services/email.service';
import { publishEvent } from '@shared/libs/rabbitmq';
import { generateToken,verifyToken} from '@shared/config/jwt.config';
import { getRepository } from 'typeorm';

/**
 * Registra un nuevo usuario en el sistema
 * @param userData Datos del usuario a registrar
 */
export const registerUser = async (userData: any): Promise<User> => {
  // 1. Validar datos de entrada
  if (!userData.email || !userData.password) {
    throw new Error('Faltan campos requeridos');
  }

  // 2. Verificar que el email no existe en la base de datos
  const userRepository = getRepository(User);
  const existingUser = await userRepository.findOne({where: { email: userData.email }});
  if (existingUser) {
    throw new Error('El usuario ya existe con este email');
  }

  // 3. Crear el usuario en la base de datos
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Creamos el usuario con las propiedades adecuadas según el modelo
  const newUser = new User();
  newUser.email = userData.email;
  newUser.role = Role.USER;
  newUser.password = hashedPassword;
    
  await userRepository.save(newUser);
  const verificationToken = crypto.randomBytes(32).toString('hex'); // TODO: Cambiar si se implementa token de verificación en el modelo de user
  // Para el email, usamos el firstName en lugar del username
  await sendVerificationEmail(newUser.email, 'User', verificationToken);

  // 5. Publicar evento de usuario registrado
  // TODO: Implementar atributos user profile cuando el modeloe esté listo
  await publishEvent('user.registered', {
    userId: newUser.id.toString(),
    email: newUser.email,
    timestamp: new Date().toISOString()
  });

  return newUser;
};

/**
 * Autentica a un usuario con email y contraseña
 * @param email Email del usuario
 * @param password Contraseña del usuario
 */
export const loginUser = async (email: string, password: string): Promise<{user: User, token: string}> => {
  // 1. Buscar usuario por email
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ 
    where: { email },
    select: ['id', 'email', 'password', 'role'] 
  });
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // 2. Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas');
  }

  // 3. Generar token JWT
  const token = generateToken({
    userId: user.id.toString(),
    email: user.email
  });

  // 4. Actualizar lastLogin y guardar
  //TODO: Implementar cuando hayan timestamps en el modelo
  //user.lastLogin = new Date();
  //await userRepository.save(user);

  // 5. Publicar evento de inicio de sesión
  await publishEvent('user.loggedin', {
    userId: user.id.toString(),
    email: user.email,
    timestamp: new Date().toISOString()
  });

  // 6. Devolver usuario y token, quitando la contraseña en la respuesta para seguridad
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword as User, token };
};

/**
 * Verifica un token JWT
 * @param token Token JWT a verificar
 */
export const verifyUserToken = async (token: string): Promise<{
  userId: string;
  email: string;
  role: Role;
}> => {
  // TODO: Implementar la verificación de token
  // 1. Verificar firma y expiración del token
  const decoded = verifyToken(token);
  if(!decoded) {
    throw new Error('Token inválido o expirado');
  } 
  // 2. Obtener información actualizada del usuario
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { id: decoded.userId } });
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return {
    userId: user.id.toString(),
    email: user.email,
    role: user.role
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
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({where:{id:userId}});
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Verificar contraseña actual
  const correctPassword= await bcrypt.compare(currentPassword, user.password);
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
  await userRepository.save(user);
  return true;
};

/**
 * Inicia el proceso de recuperación de contraseña
 * @param email Email del usuario
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  // TODO: Implementar solicitud de restablecimiento de contraseña
  // 1. Buscar usuario por email
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({where:{email}});
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Generar token único y temporal
  const token = crypto.randomBytes(32).toString('hex');
  user.password = await bcrypt.hash(token + user.id.toString(), 10);
  await userRepository.save(user);
  
  // 4. Enviar email con instrucciones
  // Pasamos el usuario
  //TODO: pasar nombre del usuario cuando esté en el modelo de user-profile
  await sendPasswordResetEmail(user.email, email, token);
  
  // 5. Publicar evento de solicitud de reset
  await publishEvent('user.password.reset.requested', {
    userId: user.id.toString(),
    email: user.email,
    timestamp: new Date().toISOString()
  });

  return true;
}; 