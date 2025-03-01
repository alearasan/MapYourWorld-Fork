// In backend/map-service/src/controllers/location.controller.ts
import { Request, Response } from 'express';
import db from '@backend/database/db';
import * as districtService from '../services/district.service';

/**
 * Guardar la ubicación del usuario en la base de datos
 */
export const saveUserLocation = async (req: Request, res: Response) => {
  try {
    // Modifica esta línea para manejar el caso donde req.user puede ser undefined
    const userId = req.user?.userId || '1'; // TODO Usa un ID por defecto para pruebas
    const { latitude, longitude, timestamp } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }
    
    // Insert into PostgreSQL using pgPromise
    await db.none(`
      INSERT INTO user_locations (user_id, location, timestamp) 
      VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4)
    `, [userId, longitude, latitude, timestamp || new Date()]);
    
    // Find district that contains this point
    const district = await districtService.findDistrictContainingLocation(latitude, longitude);
    
    return res.status(200).json({
      success: true,
      message: 'Location saved successfully',
      district: district || null
    });
    
  } catch (error) {
    console.error('Error saving location:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing location data'
    });
  }
};