/**
 * Configuración compartida para JWT
 * Este archivo puede ser importado por cualquier microservicio que necesite
 * validar o emitir tokens JWT.
 */

const jwt = require('jsonwebtoken');

// Obtener secreto desde variables de entorno o usar valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'your_development_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

/**
 * Genera un token JWT para un usuario
 * @param {Object} userData - Datos del usuario a incluir en el token
 * @param {string} userData.userId - ID del usuario
 * @param {string} userData.email - Email del usuario 
 * @param {string} userData.plan - Plan del usuario (free/premium)
 * @returns {string} Token JWT
 */
const generateToken = (userData) => {
  return jwt.sign(
    {
      userId: userData.userId,
      email: userData.email,
      plan: userData.plan || 'free'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
};

/**
 * Verifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Datos decodificados del token o null si es inválido
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware para Express que verifica tokens JWT en las solicitudes
 * @param {boolean} allowUnauthenticated - Si es true, permite solicitudes sin token
 */
const authMiddleware = (allowUnauthenticated = false) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader && allowUnauthenticated) {
      return next();
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No se proporcionó token de autenticación válido' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado' 
      });
    }

    // Agregar datos del usuario al objeto de solicitud
    req.user = decoded;
    next();
  };
};

/**
 * Middleware para verificar si un usuario tiene plan premium
 */
const premiumMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Usuario no autenticado' 
    });
  }

  if (req.user.plan !== 'premium') {
    return res.status(403).json({ 
      success: false, 
      message: 'Esta funcionalidad requiere una suscripción premium' 
    });
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware,
  premiumMiddleware
}; 