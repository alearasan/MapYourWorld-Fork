/**
 * Servicio de fotos
 * Gestiona la subida, procesamiento y recuperación de fotos
 */

import { Map } from '@types';
import { publishEvent } from '@shared/libs/rabbitmq';

/**
 * Sube una nueva foto
 * @param userId ID del usuario que sube la foto
 * @param title Título de la foto (se usará como caption)
 * @param description Descripción opcional
 * @param location Ubicación de la foto
 * @param base64Image Imagen en formato base64
 * @param poiId ID del punto de interés relacionado
 * @param districtId ID del distrito
 */
export const uploadPhoto = async (
  userId: string,
  title: string,
  description: string | undefined,
  location: { lat: number; lng: number; name?: string },
  base64Image: string,
  poiId: string,
  districtId: string
): Promise<Map.Photo> => {
  // TODO: Implementar subida de fotos
  // 1. Validar imagen (tamaño, formato)
  // 2. Comprimir y generar thumbnail
  // 3. Subir a servidor de almacenamiento
  // 4. Guardar metadatos en base de datos
  // 5. Publicar evento de foto subida

  // Simulación de subida para evitar el error
  const photoId = `photo_${Date.now()}`;

  // Mock de URL de imagen 
  const imageUrl = `https://example.com/uploads/${photoId}.jpg`;
  const thumbnailUrl = `https://example.com/uploads/thumbnails/${photoId}.jpg`;

  // Crear objeto de foto
  const newPhoto: Map.Photo = {
    id: photoId,
    userId,
    caption: title,
    url: imageUrl,
    thumbnailUrl,
    poiId,
    districtId,
    likes: 0,
    createdAt: new Date().toISOString()
  };

  // Publicar evento de foto subida
  await publishEvent('photo.uploaded', {
    photoId: newPhoto.id,
    userId,
    caption: title,
    poiId,
    districtId,
    url: imageUrl,
    createdAt: newPhoto.createdAt
  });

  return newPhoto;
};

/**
 * Obtiene una foto por su ID
 * @param photoId ID de la foto
 */
export const getPhotoById = async (photoId: string): Promise<Map.Photo | null> => {
  // TODO: Implementar recuperación de foto
  // 1. Buscar la foto en la base de datos
  // 2. Si no existe, devolver null

  // Simulación para evitar error de linter
  if (photoId) {
    return {
      id: photoId,
      userId: 'user123',
      caption: 'Foto de ejemplo',
      url: `https://example.com/uploads/${photoId}.jpg`,
      thumbnailUrl: `https://example.com/uploads/thumbnails/${photoId}.jpg`,
      poiId: 'poi123',
      districtId: 'district123',
      likes: 5,
      createdAt: new Date().toISOString()
    };
  }

  return null;
};

/**
 * Elimina una foto
 * @param photoId ID de la foto
 * @param userId ID del usuario que solicita la eliminación
 */
export const deletePhoto = async (
  photoId: string,
  userId: string
): Promise<boolean> => {
  // TODO: Implementar eliminación de foto
  // 1. Verificar propiedad de la foto
  // 2. Eliminar de almacenamiento
  // 3. Eliminar metadatos de base de datos
  // 4. Publicar evento de eliminación

  // Simulación para evitar error de linter
  if (photoId && userId) {
    await publishEvent('photo.deleted', {
      photoId,
      userId,
      deletedAt: new Date().toISOString()
    });
    return true;
  }

  return false;
};

/**
 * Obtiene fotos cercanas a una ubicación
 * @param lat Latitud
 * @param lng Longitud
 * @param radius Radio en metros
 */
export const getPhotosByLocation = async (
  lat: number,
  lng: number,
  radius: number
): Promise<Map.Photo[]> => {
  // TODO: Implementar búsqueda de fotos por ubicación
  // 1. Realizar consulta geoespacial en la base de datos
  // 2. Devolver resultado

  // Simulación para evitar error de linter
  if (lat && lng && radius) {
    return [
      {
        id: 'photo123',
        userId: 'user123',
        caption: 'Foto cercana 1',
        url: 'https://example.com/uploads/photo123.jpg',
        thumbnailUrl: 'https://example.com/uploads/thumbnails/photo123.jpg',
        poiId: 'poi123',
        districtId: 'district123',
        likes: 10,
        createdAt: new Date().toISOString()
      },
      {
        id: 'photo456',
        userId: 'user456',
        caption: 'Foto cercana 2',
        url: 'https://example.com/uploads/photo456.jpg',
        thumbnailUrl: 'https://example.com/uploads/thumbnails/photo456.jpg',
        poiId: 'poi456',
        districtId: 'district123',
        likes: 3,
        createdAt: new Date().toISOString()
      }
    ];
  }

  return [];
}; 