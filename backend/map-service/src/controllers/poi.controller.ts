/**
 * Controlador para los Puntos de Interés (POI)
 * Gestiona las peticiones HTTP relacionadas con POIs
 */

import { Request, Response } from 'express';
import * as POIService from '../services/poi.service';
import { AuthenticatedRequest } from '../../../../backend/api-gateway/src/types';

/**
 * Crea un nuevo punto de interés
 */
export const createPOI = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const poiData = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    const newPOI = await POIService.createPOI(poiData, userId);
    res.status(201).json(newPOI);
  } catch (error) {
    console.error('Error al crear el punto de interés:', error);
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Error al crear el punto de interés' 
    });
  }
};

/**
 * Obtiene un punto de interés por su ID
 */
export const getPOIById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const poiId = req.params.id;
    
    if (!poiId) {
      res.status(400).json({ error: 'ID del punto de interés no proporcionado' });
      return;
    }
    
    const poi = await POIService.getPOIById(poiId);
    
    if (!poi) {
      res.status(404).json({ error: 'Punto de interés no encontrado' });
      return;
    }
    
    res.status(200).json(poi);
  } catch (error) {
    console.error('Error al obtener el punto de interés:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al obtener el punto de interés' 
    });
  }
};

/**
 * Actualiza un punto de interés existente
 */
export const updatePOI = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const poiId = req.params.id;
    const updateData = req.body;
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    if (!poiId) {
      res.status(400).json({ error: 'ID del punto de interés no proporcionado' });
      return;
    }
    
    const updatedPOI = await POIService.updatePOI(poiId, updateData, userId);
    
    if (!updatedPOI) {
      res.status(404).json({ error: 'Punto de interés no encontrado' });
      return;
    }
    
    res.status(200).json(updatedPOI);
  } catch (error) {
    console.error('Error al actualizar el punto de interés:', error);
    res.status(error instanceof Error && error.message.includes('permisos') ? 403 : 400).json({ 
      error: error instanceof Error ? error.message : 'Error al actualizar el punto de interés' 
    });
  }
};

/**
 * Elimina un punto de interés (marca como inactivo)
 */
export const deletePOI = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const poiId = req.params.id;
    const userId = req.user?.userId;
    
    if (!userId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }
    
    if (!poiId) {
      res.status(400).json({ error: 'ID del punto de interés no proporcionado' });
      return;
    }
    
    const deleted = await POIService.deletePOI(poiId, userId);
    
    if (!deleted) {
      res.status(404).json({ error: 'Punto de interés no encontrado' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el punto de interés:', error);
    res.status(error instanceof Error && error.message.includes('permisos') ? 403 : 500).json({ 
      error: error instanceof Error ? error.message : 'Error al eliminar el punto de interés' 
    });
  }
};

/**
 * Busca puntos de interés cercanos a una ubicación geográfica
 */
export const findNearbyPOIs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius, category } = req.query;
    
    if (!latitude || !longitude || !radius) {
      res.status(400).json({ 
        error: 'Latitud, longitud y radio son parámetros obligatorios' 
      });
      return;
    }
    
    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const radiusKm = parseFloat(radius as string);
    
    if (isNaN(lat) || isNaN(lng) || isNaN(radiusKm)) {
      res.status(400).json({ 
        error: 'Latitud, longitud y radio deben ser valores numéricos válidos' 
      });
      return;
    }
    
    // Aplicar filtros adicionales si existen
    const filters = category ? { category: category as string } : undefined;
    
    const pois = await POIService.findNearbyPOIs(lat, lng, radiusKm, filters);
    res.status(200).json(pois);
  } catch (error) {
    console.error('Error al buscar puntos de interés cercanos:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Error al buscar puntos de interés cercanos' 
    });
  }
};
