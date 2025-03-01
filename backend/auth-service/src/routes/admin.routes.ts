/**
 * Rutas para operaciones administrativas
 */

import { Router } from 'express';
import { body, param } from 'express-validator';
import { isAuthenticated, requireAdmin } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';

const router: Router = Router();

// Todas las rutas administrativas requieren autenticación y rol de administrador
router.use(isAuthenticated, requireAdmin);

// Obtener todos los usuarios
router.get('/users', adminController.getAllUsers);

// Cambiar el rol de un usuario
router.patch(
  '/users/:userId/role',
  [
    param('userId').notEmpty().withMessage('ID de usuario es requerido'),
    body('role').isIn(['user', 'admin']).withMessage('Rol inválido')
  ],
  adminController.changeUserRole
);

// Activar/desactivar un usuario
router.patch(
  '/users/:userId/status',
  [
    param('userId').notEmpty().withMessage('ID de usuario es requerido'),
    body('active').isBoolean().withMessage('El estado debe ser un booleano')
  ],
  adminController.toggleUserStatus
);

export default router;