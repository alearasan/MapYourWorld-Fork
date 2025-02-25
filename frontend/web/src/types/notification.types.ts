/**
 * Tipos relacionados con notificaciones para el frontend web
 */

import { ISODateString } from '@frontend/web/src/types/user.types';

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
  // Propiedades específicas de la UI
  icon?: string;
  color?: string;
  isExpanded?: boolean;
}

/** Acción que se puede realizar desde una notificación */
export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  iconClass?: string;
}

/** Estado de notificaciones para el contexto/store */
export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  lastUpdated: ISODateString | null;
}

/** Preferencias de notificaciones */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  mutedTypes: NotificationType[];
} 