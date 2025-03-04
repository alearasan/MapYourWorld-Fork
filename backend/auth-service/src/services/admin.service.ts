/**
 * Servicio para operaciones administrativas
 */
import { User, IUser } from '../models/user.model';

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
 * @param userId ID del usuario
 * @param role Nuevo rol ('user' o 'admin')
 */
export const changeUserRole = async (userId: string, role: 'user' | 'admin'): Promise<IUser | null> => {
  if (!['user', 'admin'].includes(role)) {
    throw new Error('Rol no válido');
  }
  
  const user = await User.findById(userId);
  if (!user) return null;
  
  user.role = role;
  await user.save();
  
  return user;
};

/**
 * Activa o desactiva un usuario
 * @param userId ID del usuario
 * @param active Estado de activación
 */
export const toggleUserStatus = async (userId: string, active: boolean): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) return null;
  
  user.active = active;
  await user.save();
  
  return user;
};