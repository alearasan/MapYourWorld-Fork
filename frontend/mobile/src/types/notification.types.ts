/**
 * Tipos relacionados con notificaciones para la aplicación móvil
 */

import { ISODateString } from '@frontend/mobile/src/types/user.types';

/** Tipo de notificación */
export enum NotificationType {
  DISTRICT_UNLOCK = 'district_unlock',
  NEW_COMMENT = 'new_comment',
  NEW_LIKE = 'new_like',
  ACHIEVEMENT = 'achievement',
  SYSTEM = 'system',
  WELCOME = 'welcome',
  FRIEND_REQUEST = 'friend_request',
  NEW_FOLLOWER = 'new_follower',
  NEW_PHOTO = 'new_photo'
}

/** Estado de la notificación */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

/** Prioridad de la notificación */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/** Estructura base de una notificación */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  data?: Record<string, any>;
  createdAt: ISODateString;
  readAt?: ISODateString;
  actions?: NotificationAction[];
  // Propiedades específicas de la UI móvil
  icon?: string;
  iconBackgroundColor?: string;
  isLocal?: boolean;
  hasBeenSeen?: boolean;
  vibrationPattern?: number[];
}

/** Acción que se puede realizar desde una notificación */
export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  icon?: string;
  destructive?: boolean;
}

/** Estado de notificaciones para el contexto/store */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastUpdated: ISODateString | null;
  pushToken?: string;
  isPushEnabled: boolean;
}

/** Preferencias de notificaciones */
export interface NotificationPreferences {
  push: boolean;
  inApp: boolean;
  vibration: boolean;
  sound: boolean;
  mutedTypes: NotificationType[];
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // formato "HH:MM"
  quietHoursEnd?: string; // formato "HH:MM"
} 