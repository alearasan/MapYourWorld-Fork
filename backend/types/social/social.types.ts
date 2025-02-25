/**
 * Tipos relacionados con la funcionalidad social
 */

import { ISODateString, UUID } from '@types';
import { Auth } from '@types';

/** Estado de amistad */
export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked'
}

/** Relación de amistad */
export interface Friendship {
  id: UUID;
  requesterId: UUID;
  addresseeId: UUID;
  status: FriendshipStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Mensaje entre usuarios */
export interface Message {
  id: UUID;
  senderId: UUID;
  receiverId: UUID;
  content: string;
  read: boolean;
  createdAt: ISODateString;
}

/** Conversación entre usuarios */
export interface Conversation {
  id: UUID;
  participants: UUID[];
  lastMessageAt: ISODateString;
  createdAt: ISODateString;
}

/** Comentario en un punto de interés */
export interface Comment {
  id: UUID;
  userId: UUID;
  user?: Auth.UserData;
  poiId: UUID;
  content: string;
  likes: number;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

/** Reacción a contenido */
export interface Reaction {
  id: UUID;
  userId: UUID;
  targetType: 'poi' | 'photo' | 'comment' | 'achievement';
  targetId: UUID;
  type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
  createdAt: ISODateString;
}

/** Evento social */
export interface SocialEvent {
  id: UUID;
  creatorId: UUID;
  title: string;
  description: string;
  poiId?: UUID;
  districtId?: UUID;
  location?: string;
  startTime: ISODateString;
  endTime: ISODateString;
  attendees: UUID[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Grupo de usuarios */
export interface UserGroup {
  id: UUID;
  name: string;
  description?: string;
  ownerId: UUID;
  members: GroupMember[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Miembro de un grupo */
export interface GroupMember {
  userId: UUID;
  role: 'owner' | 'admin' | 'member';
  joinedAt: ISODateString;
} 