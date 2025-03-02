/**
 * Modelo de usuario para el servicio de autenticación
 */

import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Interfaz para los datos del usuario
export interface IUser extends Document {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  plan: 'free' | 'premium';
  active: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Esquema de mongoose para el usuario
const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      default: () => crypto.randomUUID()
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, introduce un email válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      select: false, // No incluir en las consultas por defecto
    },
    firstName: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    }
  },
  {
    timestamps: true, // Añadir createdAt y updatedAt automáticamente
  }
);

// Hook pre-save para cifrar la contraseña
UserSchema.pre<IUser>('save', async function (next) {
  // Sólo cifrar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();

  try {
    // Implementación con AES y SHA-256 para mayor seguridad
    // 1. Generar un salt aleatorio
    const salt = await bcrypt.genSalt(10);
    
    // 2. Crear un hash SHA-256 de la contraseña
    const sha256Hash = crypto
      .createHash('sha256')
      .update(this.password)
      .digest('hex');
    
    // 3. Cifrar el hash con bcrypt (que ya usa un método más robusto internamente)
    const hashedPassword = await bcrypt.hash(sha256Hash, salt);
    
    // 4. Guardar la contraseña cifrada
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    // Primero, crear un hash SHA-256 de la contraseña candidata
    const sha256Hash = crypto
      .createHash('sha256')
      .update(candidatePassword)
      .digest('hex');
    
    // Comparar con la contraseña almacenada (que ya está cifrada)
    // Seleccionar explícitamente el campo password ya que está excluido por defecto
    const user = await this.model('User').findById(this._id).select('+password');
    if (!user) return false;
    
    return await bcrypt.compare(sha256Hash, user.password);
  } catch (error) {
    throw new Error(`Error al comparar contraseñas: ${error}`);
  }
};

// Crear y exportar el modelo
export const User = mongoose.model<IUser>('User', UserSchema); 