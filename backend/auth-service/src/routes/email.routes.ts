import { Router } from 'express';
import { body } from 'express-validator';
import * as emailController from '../controllers/email.controller';

const emailRouter: Router = Router();

// Ruta para enviar un correo genérico
emailRouter.post('/send', [
    body('from').isEmail().withMessage('El remitente debe ser un email válido'),
    body('to').isEmail().withMessage('El destinatario debe ser un email válido'),
    body('subject').notEmpty().withMessage('El asunto es requerido'),
    body('html').notEmpty().withMessage('El contenido HTML es requerido')
], emailController.sendMail);

// Ruta para enviar correo de verificación
emailRouter.post('/verification', [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('username').notEmpty().withMessage('El nombre de usuario es requerido')
], emailController.sendVerification);

// Ruta para enviar correo de restablecimiento de contraseña
emailRouter.post('/password-reset', [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('username').notEmpty().withMessage('El nombre de usuario es requerido')
], emailController.passwordReset);

// Ruta para notificar cambio de contraseña
emailRouter.post('/password-change-notification', [
    body('email').isEmail().withMessage('El email debe ser válido'),
    body('username').notEmpty().withMessage('El nombre de usuario es requerido')
], emailController.passwordChangeNotification);

// Ruta para probar la conexión con el servidor SMTP
emailRouter.get('/test-connection', emailController.testConnection);

export default emailRouter;
