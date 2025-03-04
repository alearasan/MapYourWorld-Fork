/**
 * Controlador para los Puntos de Interés (POI)
 * Gestiona las peticiones HTTP relacionadas con POIs
 */

import { Request, Response } from 'express';
import * as POIService from '../services/poi.service';

/**
 * Crea un nuevo punto de interés
 */
export const createPOI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { poiData, userId } = req.body;

    if (!poiData || !userId) {
      res.status(400).json({ success: false, message: 'Faltan datos necesarios para crear el POI' });
      return;
    }

    const newPOI = await POIService.createPOI(poiData, userId);
    res.status(201).json({ success: true, message: 'Punto de interés creado correctamente', poi: newPOI });
  } catch (error) {
    console.error('Error al crear punto de interés:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al crear punto de interés'
    });
  }
};

/**
 * Obtiene un punto de interés por su ID
 */
export const getPOIById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poi = await POIService.getPOIById(id);

    if (!poi) {
      res.status(404).json({ success: false, message: 'Punto de interés no encontrado' });
      return;
    }

    res.status(200).json({ success: true, poi });
  } catch (error) {
    console.error('Error al obtener punto de interés:', error);
    res.status(500).json({ success: false, message: 'Error al obtener punto de interés' });
  }
};

/**
 * Actualiza un punto de interés existente
 */
export const updatePOI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updateData, userId } = req.body;

    if (!updateData || !userId) {
      res.status(400).json({ success: false, message: 'Faltan datos para actualizar' });
      return;
    }

    const updatedPOI = await POIService.updatePOI(id, updateData, userId);
    if (!updatedPOI) {
      res.status(404).json({ success: false, message: 'Punto de interés no encontrado' });
      return;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Punto de interés actualizado correctamente', 
      poi: updatedPOI 
    });
  } catch (error) {
    console.error('Error al actualizar punto de interés:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al actualizar punto de interés'
    });
  }
};

/**
 * Elimina un punto de interés (marca como inactivo)
 */
export const deletePOI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ success: false, message: 'Se requiere ID de usuario' });
      return;
    }

    const result = await POIService.deletePOI(id, userId);
    if (!result) {
      res.status(404).json({ success: false, message: 'Punto de interés no encontrado o ya inactivo' });
      return;
    }

    res.status(200).json({ success: true, message: 'Punto de interés eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar punto de interés:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al eliminar punto de interés'
    });
  }
};

/**
 * Busca puntos de interés cercanos a una ubicación geográfica
 */
export const findNearbyPOIs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, radius, category, type, minRating, tags } = req.query;

    if (!latitude || !longitude || !radius) {
      res.status(400).json({ success: false, message: 'Se requiere latitud, longitud y radio' });
      return;
    }

    const filters: {
      category?: string;
      type?: string;
      minRating?: number;
      tags?: string[];
    } = {};

    if (category) filters.category = category as string;
    if (type) filters.type = type as string;
    if (minRating) filters.minRating = parseFloat(minRating as string);
    if (tags) filters.tags = (tags as string).split(',');

    const pois = await POIService.findNearbyPOIs(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      parseFloat(radius as string),
      filters
    );

    res.status(200).json({ success: true, count: pois.length, pois });
  } catch (error) {
    console.error('Error al buscar puntos de interés cercanos:', error);
    res.status(500).json({ success: false, message: 'Error al buscar puntos de interés cercanos' });
  }
};

/**
 * Registra la visita de un usuario a un punto de interés
 */
export const registerPOIVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { poiId, userId } = req.body;

    if (!poiId || !userId) {
      res.status(400).json({ success: false, message: 'Se requiere ID de POI y usuario' });
      return;
    }

    const result = await POIService.registerPOIVisit(poiId, userId);
    if (!result) {
      res.status(404).json({ success: false, message: 'Punto de interés no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Visita registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar visita:', error);
    res.status(500).json({ success: false, message: 'Error al registrar visita' });
  }
};

/**
 * Califica un punto de interés
 */
export const ratePOI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { poiId, userId, rating } = req.body;

    if (!poiId || !userId || rating === undefined) {
      res.status(400).json({ success: false, message: 'Se requiere ID de POI, usuario y calificación' });
      return;
    }

    const ratingValue = parseInt(rating);
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      res.status(400).json({ success: false, message: 'La calificación debe ser un número entre 1 y 5' });
      return;
    }

    const result = await POIService.ratePOI(poiId, userId, ratingValue);
    res.status(200).json({ 
      success: true, 
      message: 'Punto de interés calificado correctamente', 
      newRating: result.newRating 
    });
  } catch (error) {
    console.error('Error al calificar punto de interés:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Error al calificar punto de interés'
    });
  }
};