import { Request, Response } from 'express';
import {
  getUserProfile,
  getPublicUserProfile,
  updateUserProfile,
  updateUserAvatar,
  updateUserPreferences,
  searchUsers,
  deactivateUserAccount,
  reactivateUserAccount,
} from '../services/profile.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const profile = await getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const viewerId = req.query.viewerId as string | undefined;
    const profile = await getPublicUserProfile(userId, viewerId);
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    return res.json(profile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el perfil público' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const profileData = req.body;
    const updatedProfile = await updateUserProfile(userId, profileData);
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    return res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { avatarData } = req.body;
    if (!avatarData) {
      return res.status(400).json({ message: 'Falta avatarData en la solicitud' });
    }
    const result = await updateUserAvatar(userId, avatarData);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar el avatar' });
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const preferences = req.body;
    const updatedPreferences = await updateUserPreferences(userId, preferences);
    if (!updatedPreferences) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }
    return res.json(updatedPreferences);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar las preferencias' });
  }
};

export const searchProfiles = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await searchUsers(query, limit, offset);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al buscar perfiles' });
  }
};

export const deactivateAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { reason } = req.body;
    const result = await deactivateUserAccount(userId, reason);
    return res.json({ success: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al desactivar la cuenta' });
  }
};

export const reactivateAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await reactivateUserAccount(userId);
    return res.json({ success: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al reactivar la cuenta' });
  }
};
