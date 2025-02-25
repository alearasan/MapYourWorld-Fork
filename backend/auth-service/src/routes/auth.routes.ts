/**
 * Rutas para el servicio de autenticación
 */

import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, verify } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthenticatedRequest } from '@backend/auth-service/src/types';

const router: Router = Router();

// Ruta para registrar un usuario
router.post(
  '/register',
  [
    // Validaciones
    body('email')
      .isEmail()
      .withMessage('Introduce un email válido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/\d/)
      .withMessage('La contraseña debe contener al menos un número')
      .matches(/[a-z]/)
      .withMessage('La contraseña debe contener al menos una letra minúscula')
      .matches(/[A-Z]/)
      .withMessage('La contraseña debe contener al menos una letra mayúscula')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('La contraseña debe contener al menos un carácter especial'),
    body('firstName')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('lastName')
      .notEmpty()
      .withMessage('El apellido es obligatorio')
      .isLength({ min: 2 })
      .withMessage('El apellido debe tener al menos 2 caracteres'),
  ],
  register
);

// Ruta para iniciar sesión
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Introduce un email válido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

// Ruta para verificar token
router.post('/verify', verify);

// Ruta para obtener el perfil del usuario autenticado
router.get('/profile', authMiddleware(), (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router; 