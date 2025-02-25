/**
 * Tipos relacionados con notificaciones
 */

import { ISODateString, UUID } from '@types';

/** Tipo de notificación */
export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  MESSAGE = 'message',
  COMMENT = 'comment',
  LIKE = 'like',
  ACHIEVEMENT = 'achievement',
  DISTRICT_UNLOCK = 'district_unlock',
  SYSTEM = 'system',
  EVENT_INVITE = 'event_invite'
}

/** Prioridad de notificación */
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/** Notificación */
export interface Notification {
  id: UUID;
  userId: UUID;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: NotificationPriority;
  read: boolean;
  action?: NotificationAction;
  createdAt: ISODateString;
  expiresAt?: ISODateString;
}

/** Acción asociada a una notificación */
export interface NotificationAction {
  type: 'link' | 'button';
  label: string;
  url?: string;
  payload?: Record<string, any>;
}

/** Configuración de dispositivo para notificaciones push */
export interface PushDevice {
  id: UUID;
  userId: UUID;
  token: string;
  platform: 'ios' | 'android' | 'web';
  lastActive: ISODateString;
  createdAt: ISODateString;
}

/** Plantilla de notificación */
export interface NotificationTemplate {
  id: UUID;
  type: NotificationType;
  titleTemplate: string;
  messageTemplate: string;
  defaultPriority: NotificationPriority;
  defaultAction?: NotificationAction;
  expirationHours?: number;
}

/** Evento de notificación */
export interface NotificationEvent {
  userId: UUID;
  type: NotificationType;
  data: Record<string, any>;
  priority?: NotificationPriority;
  timestamp: ISODateString;
}

/** Estadísticas de notificaciones */
export interface NotificationStats {
  userId: UUID;
  totalReceived: number;
  totalRead: number;
  lastNotificationAt?: ISODateString;
} 