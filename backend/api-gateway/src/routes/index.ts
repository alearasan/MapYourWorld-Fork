/**
 * Configuración central de rutas para el API Gateway
 * Define las rutas y sus correspondientes servicios micro-service
 */

import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { circuitBreakerMiddleware } from '../middleware/circuit-breaker';
import { cacheMiddleware } from '../middleware/cache';
import jwt from 'jsonwebtoken';

// Direcciones de los servicios (desde variables de entorno)
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const MAP_SERVICE_URL = process.env.MAP_SERVICE_URL || 'http://localhost:3003';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004';
const SOCIAL_SERVICE_URL = process.env.SOCIAL_SERVICE_URL || 'http://localhost:3005';

// Tiempo de cache por tipo de ruta (en ms)
const CACHE_DURATIONS = {
  PUBLIC_MAPS: 5 * 60 * 1000, // 5 minutos para mapas públicos
  PUBLIC_USERS: 2 * 60 * 1000, // 2 minutos para usuarios públicos
  SOCIAL_CONTENT: 1 * 60 * 1000, // 1 minuto para contenido social
  DEFAULT: 30 * 1000 // 30 segundos para otros
};

// Opciones comunes para los proxies
const defaultProxyOptions: Options = {
  changeOrigin: true,
};

// Interfaz para datos de usuario en token JWT
interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isPremium: boolean;
}

// Interfaz para token JWT decodificado
interface DecodedToken {
  user: UserData;
  iat: number;
  exp: number;
}

// Interfaz para Request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user?: UserData;
  token?: string;
}

const router: Router = Router();

// Middleware de autenticación
const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        message: 'No se ha proporcionado un token de autenticación'
      });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        message: 'Formato de token inválido'
      });
    }
    
    // Normalmente aquí verificaríamos el token con el servicio de auth,
    // pero por simplicidad lo haremos directamente (en producción deberíamos
    // delegar esta responsabilidad al servicio de autenticación)
    const jwtSecret = process.env.JWT_SECRET || 'development-secret-key';
    
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    req.user = decoded.user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).json({
      error: 'Autenticación fallida',
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware de autorización basado en roles
const authorizeRoles = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        message: 'Usuario no autenticado'
      });
    }
    
    const userRole = req.user.role;
    
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acceso prohibido',
        message: 'No tiene permisos suficientes para acceder a este recurso'
      });
    }
    
    next();
  };
};

// Rutas de salud y estado
router.get('/health', (req: Request, res: Response): void => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación - No requieren autenticación
// @ts-ignore
router.use('/auth', circuitBreakerMiddleware('auth-service'), createProxyMiddleware({
  ...defaultProxyOptions,
  target: AUTH_SERVICE_URL,
  pathRewrite: {
    '^/api/auth': '/api/auth'
  }
} as Options));

// Rutas de usuario - Algunas requieren autenticación
// @ts-ignore
router.use('/users/public', circuitBreakerMiddleware('user-service'), cacheMiddleware(CACHE_DURATIONS.PUBLIC_USERS), createProxyMiddleware({
  ...defaultProxyOptions,
  target: USER_SERVICE_URL,
  pathRewrite: {
    '^/api/users/public': '/api/users/public'
  }
} as Options));

// Rutas que requieren autenticación
// @ts-ignore
router.use('/users', authenticateJWT, circuitBreakerMiddleware('user-service'), createProxyMiddleware({
  ...defaultProxyOptions,
  target: USER_SERVICE_URL,
  pathRewrite: {
    '^/api/users': '/api/users'
  }
} as Options));

// Rutas de mapas - Algunas públicas, otras requieren autenticación
// @ts-ignore
router.use('/maps/public', circuitBreakerMiddleware('map-service'), cacheMiddleware(CACHE_DURATIONS.PUBLIC_MAPS), createProxyMiddleware({
  ...defaultProxyOptions,
  target: MAP_SERVICE_URL,
  pathRewrite: {
    '^/api/maps/public': '/api/maps/public'
  }
} as Options));

// @ts-ignore
router.use('/maps', authenticateJWT, circuitBreakerMiddleware('map-service'), createProxyMiddleware({
  ...defaultProxyOptions,
  target: MAP_SERVICE_URL,
  pathRewrite: {
    '^/api/maps': '/api/maps'
  }
} as Options));

// Rutas sociales - Algunas públicas, otras requieren autenticación
// @ts-ignore
router.use('/social/public', circuitBreakerMiddleware('social-service'), cacheMiddleware(CACHE_DURATIONS.SOCIAL_CONTENT), createProxyMiddleware({
  ...defaultProxyOptions,
  target: SOCIAL_SERVICE_URL,
  pathRewrite: {
    '^/api/social/public': '/api/social/public'
  }
} as Options));

// @ts-ignore
router.use('/social', authenticateJWT, circuitBreakerMiddleware('social-service'), createProxyMiddleware({
  ...defaultProxyOptions,
  target: SOCIAL_SERVICE_URL,
  pathRewrite: {
    '^/api/social': '/api/social'
  }
} as Options));

// Rutas de notificaciones - Todas requieren autenticación
// @ts-ignore
router.use('/notifications', authenticateJWT, circuitBreakerMiddleware('notification-service'), createProxyMiddleware({
  ...defaultProxyOptions,
  target: NOTIFICATION_SERVICE_URL,
  pathRewrite: {
    '^/api/notifications': '/api/notifications'
  },
  ws: true, // Habilitar WebSockets
} as any));

// Rutas de administración - Requieren autenticación y rol de administrador
// @ts-ignore
router.use('/admin', authenticateJWT, authorizeRoles(['admin']), function(req: Request, res: Response, next: NextFunction) {
  // Router dinámico basado en el recurso solicitado
  const path = req.path;
  let target = AUTH_SERVICE_URL; // Default
  
  if (path.includes('/users')) {
    target = USER_SERVICE_URL;
  } else if (path.includes('/maps')) {
    target = MAP_SERVICE_URL;
  } else if (path.includes('/social')) {
    target = SOCIAL_SERVICE_URL;
  } else if (path.includes('/notifications')) {
    target = NOTIFICATION_SERVICE_URL;
  }
  
  // Crear un proxy dinámicamente basado en el recurso
  const proxyMiddleware = createProxyMiddleware({
    ...defaultProxyOptions,
    target,
    pathRewrite: {
      '^/api/admin': '/api/admin'
    }
  });
  
  // @ts-ignore: Ignoramos errores de tipo para proxyMiddleware
  proxyMiddleware(req, res, next);
});

// Rutas de gateway - Para métricas, caché, etc.
router.use('/gateway', (req: Request, res: Response, next: NextFunction) => {
  // Estas rutas están manejadas por los middlewares en index.ts
  next();
});

// Manejador para rutas no encontradas
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

export default router; 