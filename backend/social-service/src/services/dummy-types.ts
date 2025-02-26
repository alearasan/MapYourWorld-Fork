/**
 * Archivo temporal con tipos dummy para facilitar la compilación
 * Estos tipos se usarán en lugar de los importados desde fuera del proyecto
 */

// Tipo dummy para FriendshipStatus
export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked'
}

// Tipos dummy para Social
export namespace Social {
  export interface Comment {
    id: string;
    userId: string;
    user?: any;
    poiId: string;
    content: string;
    likes: number;
    createdAt: string;
    updatedAt?: string;
  }

  export interface Reaction {
    id: string;
    userId: string;
    targetType: 'poi' | 'photo' | 'comment' | 'achievement';
    targetId: string;
    type: 'like' | 'love' | 'wow' | 'sad' | 'angry';
    createdAt: string;
  }

  export interface Friendship {
    id: string;
    requesterId: string;
    addresseeId: string;
    status: FriendshipStatus;
    createdAt: string;
    updatedAt: string;
  }
}

// Tipos dummy para Map
export namespace Map {
  export interface Photo {
    id: string;
    userId: string;
    caption: string;
    url: string;
    thumbnailUrl: string;
    poiId: string;
    districtId: string;
    likes: number;
    createdAt: string;
  }
}

// Función dummy para publicar eventos
export const publishEvent = async (eventType: string, data: any): Promise<void> => {
  console.log(`[DUMMY] Publicando evento ${eventType}:`, data);
  // Esta función simplemente registra el evento en la consola
  // No envía ningún mensaje real a RabbitMQ
}; 