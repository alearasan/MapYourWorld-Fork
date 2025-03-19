/**
 * Servicio de autenticación
 * Implementa la lógica de negocio para registro, login y verificación de usuarios
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Role, User } from '../models/user.model';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import { generateToken, verifyToken } from '../../../../shared/config/jwt.config';
import { AuthRepository } from '../repositories/auth.repository';
import { UserProfileRepository } from '../../../user-service/src/repositories/userProfile.repository';
import { UserProfile } from '../../../user-service/src/models/userProfile.model';
import { createMap } from '../../../map-service/src/services/map.service';
import { createDistricts } from '../../../map-service/src/services/district.service';
import MapRepository from '../../../map-service/src/repositories/map.repository';

const repo = new AuthRepository();
const profileRepo = new UserProfileRepository()
const mapRepo = new MapRepository();


export const getUserById = async (userId: string): Promise<User | null> => {
  return await repo.findById(userId);
};

/**
 * Registra un nuevo usuario en el sistema
 * @param userData Datos del usuario a registrar
 */
export const registerUser = async (userData: any): Promise<User> => {
  try {
    // 1. Validar datos de entrada
    if (!userData.email || !userData.password || !userData.username || !userData.firstName || !userData.lastName) {
      throw new Error('Faltan campos requeridos');
    }


    // 2. Verificar que el email no existe en la base de datos
    const existingUser = await repo.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe con este email');
    }

    // 3. Crear el usuario en la base de datos
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newProfile = new UserProfile();
    newProfile.username = userData.username;
    newProfile.firstName = userData.firstName;
    newProfile.lastName = userData.lastName;
    newProfile.picture = userData.picture;
    const savedProfile = await profileRepo.create(newProfile);

    // Creamos el usuario con las propiedades adecuadas según el modelo
    const newUser = new User();
    newUser.email = userData.email;
    newUser.role = userData.role;
    newUser.password = hashedPassword;
    newUser.is_active = false;
    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.token_data = JSON.stringify({
      verificationType: 'email',
      token: verificationToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    });
    newUser.profile = savedProfile;


    const savedUser = await repo.save(newUser);
    const verifiedUser = await repo.findById(savedUser.id);
    if (!verifiedUser) {
      throw new Error("Error al verificar el usuario en la base de datos");
    }

    const newMap = await createMap(verifiedUser.id);
    if (!newMap) {
      throw new Error('Error al crear el mapa');
    }


    const savedMap = await mapRepo.getMapById(newMap.id);

    await createDistricts(savedMap.id);

    await sendVerificationEmail(newUser.email, userData.profile?.username || '', verificationToken);

    return newUser;
  } catch (error) {
    throw new Error('Error al registrar el usuario');
  }
};

/**
 * Autentica a un usuario con email y contraseña
 * @param email Email del usuario
 * @param password Contraseña del usuario
 */
export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  // 1. Buscar usuario por email
  const user = await repo.findWithPassword(email);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // 2. Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas');
  }

  // 3. Verificar que la cuenta esté activa
  if (!user.is_active) {
    throw new Error('La cuenta no está activada. Por favor, verifica tu email.');
  }

  // 4. Generar token JWT
  const token = generateToken({
    userId: user.id.toString(),
    email: user.email
  });
  user.token_data = token;
  await repo.save(user);
  // 5. Devolver usuario y token, quitando la contraseña en la respuesta para seguridad
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
  // 1. Verificar firma y expiración del token
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Token inválido o expirado');
  }
  // 2. Obtener información actualizada del usuario
  const user = await repo.findById(decoded.userId);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 3. Verificar que el token está en token_data     
  if (user.token_data !== token) {
    throw new Error('Sesión inválida. Por favor, inicie sesión nuevamente');
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
  // 1. Buscar usuario por ID
  const user = await repo.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Verificar contraseña actual
  const correctPassword = await bcrypt.compare(currentPassword, user.password);
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
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await repo.updatePassword(user.id, hashedPassword);
  // 6. Invalidar todas las sesiones existentes por seguridad
  user.token_data = "";
  await repo.save(user);

  return true;
};

/**
 * Inicia el proceso de recuperación de contraseña
 * @param email Email del usuario
 */
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  // 1. Buscar usuario por email
  const user = await repo.findByEmail(email);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  // 2. Generar token único y temporal
  const resetToken = crypto.randomBytes(32).toString('hex');
  // 3. Almacenar el token en token_data sin afectar los tokens existentes
  try {
    // Intentar parsear token_data existente
    const tokenData = JSON.parse(user.token_data || '{}');

    // Añadir información del token de restablecimiento
    tokenData.resetPassword = {
      token: resetToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hora de validez
    };

    user.token_data = JSON.stringify(tokenData);
    await repo.save(user);

    // 4. Enviar email con instrucciones
    await sendPasswordResetEmail(user.email, user.profile?.username || '', resetToken);

    return true;
  } catch (error) {
    console.error('Error al guardar token de recuperación:', error);
    throw new Error('Error al procesar la solicitud de recuperación de contraseña');
  }

  // 4. Enviar email con instrucciones
  // Pasamos el usuario
  // await sendPasswordResetEmail(user.email, user.profile?.username || '', token);

  // return true;
};

/**
 * Restablece la contraseña usando un token
 * @param token Token de recuperación
 * @param newPassword Nueva contraseña
 * @returns true si el restablecimiento fue exitoso
 */
export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  if (!token || !newPassword) {
    throw new Error('Token y nueva contraseña son requeridos');
  }

  // Validar la nueva contraseña
  if (newPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    throw new Error('La nueva contraseña debe contener al menos una mayúscula y un número');
  }

  // Buscar usuario por token (buscar entre todos los usuarios para encontrar el que coincide)
  const users = await repo.findAll();

  // La verificación depende de cómo almacenaste el token en requestPasswordReset
  let matchedUser: User | null = null;

  for (const user of users) {
    // Intentar verificar si este usuario corresponde al token
    try {
      const tokenMatch = await bcrypt.compare(token + user.id.toString(), user.password);
      if (tokenMatch) {
        matchedUser = user;
        break;
      }
    } catch (error) {
      continue;
    }
  }

  if (!matchedUser) {
    throw new Error('Token inválido o expirado');
  }
  // Actualizar la contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await repo.updatePassword(matchedUser.id, hashedPassword);

  // 4. Limpiar el token de reseteo
  matchedUser.token_data = "";
  await repo.save(matchedUser);

  return true;
};

/**
 * Cierra la sesión de un usuario
 * @param userId ID del usuario
 * @param token Token JWT a invalidar
 * @returns true si se cerró la sesión correctamente
 */
export const logout = async (userId: string, token?: string): Promise<boolean> => {
  try {
    // 1. Buscar usuario por ID
    const user = await repo.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Verificar que el token coincide con el almacenado (opcional)
    if (token && user.token_data !== token) {
      return false;
    }

    // 3. Limpiar el token_data para invalidar la sesión
    user.token_data = "";
    await repo.save(user);

    return true;

  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
};