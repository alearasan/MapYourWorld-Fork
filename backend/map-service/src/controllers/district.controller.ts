import { Request, Response } from 'express';
import * as DistrictService from '../services/district.service';

/**
 * Crea un nuevo distrito
 */


export const createDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const { districtData, userId } = req.body;

    if (!districtData || !userId) {
      res.status(400).json({ success: false, message: 'Faltan datos necesarios' });
      return;
    }

    const newDistrict = await DistrictService.createDistrict(districtData, userId);
    res.status(201).json({ success: true, message: 'Distrito creado correctamente', district: newDistrict });
  } catch (error) {
    console.error('Error al crear distrito:', error);
    res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Error al crear distrito' });
  }
};


/**
 * Obtiene un distrito por su ID
 */
export const getDistrictById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const district = await DistrictService.getDistrictById(id);

    if (!district) {
      res.status(404).json({ success: false, message: 'Distrito no encontrado' });
      return;
    }

    res.status(200).json({ success: true, district });
  } catch (error) {
    console.error('Error al obtener distrito:', error);
    res.status(500).json({ success: false, message: 'Error al obtener distrito' });
  }
};

/**
 * Obtiene todos los distritos
 */
export const getAllDistricts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { includeInactive } = req.query;
    const districts = await DistrictService.getAllDistricts(includeInactive === 'true');

    res.status(200).json({ success: true, districts });
  } catch (error) {
    console.error('Error al obtener distritos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener distritos' });
  }
};

/**
 * Actualiza un distrito
 */
export const updateDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updateData, userId } = req.body;

    if (!updateData || !userId) {
      res.status(400).json({ success: false, message: 'Faltan datos para actualizar' });
      return;
    }

    const updatedDistrict = await DistrictService.updateDistrict(id, updateData);
    if (!updatedDistrict) {
      res.status(404).json({ success: false, message: 'Distrito no encontrado' });
      return;
    }

    res.status(200).json({ success: true, message: 'Distrito actualizado correctamente', district: updatedDistrict });
  } catch (error) {
    console.error('Error al actualizar distrito:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar distrito' });
  }
};


/**
 * Desbloquea un distrito para un usuario
 */
export const unlockDistrict = async (req: Request, res: Response): Promise<void> => {
  try {
    const { districtId, userId } = req.body;

    if (!districtId || !userId) {
      res.status(400).json({ success: false, message: 'Faltan datos para desbloquear el distrito' });
      return;
    }

    const result = await DistrictService.unlockDistrict(districtId, userId);
    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Distrito desbloqueado correctamente' });
  } catch (error) {
    console.error('Error al desbloquear distrito:', error);
    res.status(500).json({ success: false, message: 'Error al desbloquear distrito' });
  }
};

/**
 * Obtiene los distritos desbloqueados por un usuario
 */
export const getUserUnlockedDistricts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const districts = await DistrictService.getUserUnlockedDistricts(userId);

    res.status(200).json({ success: true, districts });
  } catch (error) {
    console.error('Error al obtener distritos desbloqueados:', error);
    res.status(500).json({ success: false, message: 'Error al obtener distritos desbloqueados' });
  }
};

/**
 * Encuentra el distrito que contiene una ubicación geográfica
 */
export const findDistrictContainingLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ success: false, message: 'Latitud y longitud son requeridos' });
      return;
    }

    const district = await DistrictService.findDistrictContainingLocation(
      parseFloat(latitude as string),
      parseFloat(longitude as string)
    );

    if (!district) {
      res.status(404).json({ success: false, message: 'No se encontró un distrito para la ubicación' });
      return;
    }

    res.status(200).json({ success: true, district });
  } catch (error) {
    console.error('Error al buscar distrito por ubicación:', error);
    res.status(500).json({ success: false, message: 'Error al buscar distrito por ubicación' });
  }
};
