import { Request, Response } from 'express';
import * as MapService from '../services/map.service';
import { User } from '../../../auth-service/src/models/user.model';

/**
 * Crea un nuevo mapa
 */


export const createMap = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("req.body", req.body); 
    const {MapData, userId} = req.body;

    if (!MapData) {
      res.status(400).json({ success: false, message: 'Faltan datos necesarios' });
      return;
    }

    const newMap = await MapService.createMap(MapData, userId);
    res.status(201).json({ success: true, message: 'mapa creado correctamente', Map: newMap });
  } catch (error) {
    console.error('Error al crear mapa:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error al crear mapa' });
  }
};



export const createMapColaborative = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("req.body", req.body); 
    const {MapData, userId} = req.body;

    if (!MapData) {
      res.status(400).json({ success: false, message: 'Faltan datos necesarios' });
      return;
    }

    const newMap = await MapService.createColaborativeMap(MapData, userId);
    res.status(201).json({ success: true, message: 'mapa colaborativo creado correctamente', Map: newMap });
  } catch (error) {
    console.error('Error al crear mapa colaborativo:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error al crear mapa colaborativo' });
  }
};




/**
 * Obtiene un mapa por su ID
 */
export const getMapById = async (req: Request, res: Response): Promise<void> => {
  try {
    const MapId = req.params.MapId;
    const Map = await MapService.getMapById(MapId);

    if (!Map) {
      res.status(404).json({ success: false, message: 'mapa no encontrado' });
      return;
    }

    res.status(200).json({ success: true, Map });
  } catch (error) {
    console.error('Error al obtener mapa:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mapa' });
  }
};



export const getUsersOnMapById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mapId = req.params.MapId;


    if (!mapId) {
      res.status(404).json({ success: false, message: 'mapa no encontrado' });
      return;
    }
    const users = await MapService.getMapUsersById(mapId);
    res.status(200).json({ success: true,message: "Usuarios encontrados: ",users });
  } catch (error) {
    console.error('Error al obtener mapa:', error);
    res.status(500).json({ success: false, message: 'Error al obtener',error });
  }
};



/**
 * Actualiza un mapa
 */
export const updateMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const MapId  = req.params.MapId;
    const { updateData} = req.body;

    if (!updateData) {
      res.status(400).json({ success: false, message: 'Faltan datos para actualizar' });
      return;
    }

    const updatedMap = await MapService.updateMap(MapId, updateData);
    if (!updatedMap) {
      res.status(404).json({ success: false, message: 'mapa no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'mapa actualizado correctamente', Map: updatedMap });
  } catch (error) {
    console.error('Error al actualizar mapa:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar mapa' });
  }
};

export const deleteMap = async (req: Request, res: Response): Promise<void> => {
  try {    
    const MapId = req.params.MapId;
    const result = await MapService.deleteMap(MapId);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }
    res.status(200).json({ success: true, message: 'mapa eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar mapa:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar mapa' });
  }
};
