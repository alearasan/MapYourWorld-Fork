/**
 * Modelo de usuario para el servicio de usuarios
 */

import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from '../../../types/user/user.model.types';

// Interfaz para el modelo de usuario en user-service
export interface IUser extends Document, Omit<UserModel.IUserBase, 'lastLogin' | 'createdAt' | 'updatedAt'> {
  // Campos adicionales específicos de user-service
  bio?: string;
  avatarUrl?: string;
  location?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    privacy: {
      showLocation: boolean;
      showActivity: boolean;
    }
  };
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Esquema mongoose para el servicio de usuarios
const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    active: {
      type: Boolean,
      default: true
    },
    bio: String,
    avatarUrl: String,
    location: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
      },
      notifications: {
        type: Boolean,
        default: true
      },
      privacy: {
        showLocation: {
          type: Boolean,
          default: true
        },
        showActivity: {
          type: Boolean,
          default: true
        }
      }
    },
    lastLogin: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Crear y exportar el modelo
export const User = mongoose.model<IUser>('User', UserSchema);
