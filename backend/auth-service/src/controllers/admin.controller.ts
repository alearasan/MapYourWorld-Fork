/**
 * Controlador para operaciones de administración
 */

import { Request, Response } from 'express';
import { User } from '../models/user.model';
import * as adminService from '../services/admin.service';

/**
 * Obtener todos los usuarios del sistema 
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan,
        role: user.role,
        active: user.active,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Cambiar el rol de un usuario
 */
export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      res.status(400).json({
        success: false,
        message: 'Se requiere userId y role'
      });
      return;
    }
    
    const updatedUser = await adminService.changeUserRole(userId, role);
    
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Rol de usuario actualizado correctamente',
      user: {
        id: updatedUser._id,
        userId: updatedUser.userId,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Error al cambiar rol de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar rol de usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

/**
 * Activar o desactivar un usuario
 */
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, active } = req.body;
    
    if (userId === undefined || active === undefined) {
      res.status(400).json({
        success: false,
        message: 'Se requiere userId y estado active'
      });
      return;
    }
    
    const updatedUser = await adminService.toggleUserStatus(userId, active);
    
    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: `Usuario ${active ? 'activado' : 'desactivado'} correctamente`,
      user: {
        id: updatedUser._id,
        userId: updatedUser.userId,
        email: updatedUser.email,
        active: updatedUser.active
      }
    });
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};