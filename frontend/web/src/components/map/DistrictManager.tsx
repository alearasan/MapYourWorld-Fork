/**
 * Componente para gestionar distritos en el mapa
 * Permite visualizar, desbloquear y administrar distritos
 */

import React, { useEffect, useState, useCallback } from 'react';
import { District, UserProgress } from '@frontend/web/src/types/mapTypes';
import { Box, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, 
         DialogTitle, Grid, Typography, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { encryptAES } from '@shared/security/crypto';

interface DistrictManagerProps {
  mapId: string;
  userId: string;
  token: string;
  apiUrl: string;
  onDistrictSelect: (district: District) => void;
  onDistrictUnlock: (district: District) => void;
}

const DistrictManager: React.FC<DistrictManagerProps> = ({
  mapId,
  userId,
  token,
  apiUrl,
  onDistrictSelect,
  onDistrictUnlock
}) => {
  // Estados
  const [districts, setDistricts] = useState<District[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState<boolean>(false);
  const [unlocking, setUnlocking] = useState<boolean>(false);

  // Cargar distritos y progreso del usuario
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener distritos del mapa
        const districtsResponse = await fetch(`${apiUrl}/maps/${mapId}/districts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!districtsResponse.ok) {
          throw new Error('No se pudieron cargar los distritos');
        }
        
        const districtsData = await districtsResponse.json();
        setDistricts(districtsData);
        
        // Obtener progreso del usuario en este mapa
        const progressResponse = await fetch(`${apiUrl}/users/${userId}/progress/${mapId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setUserProgress(progressData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error al cargar distritos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (mapId && userId && token) {
      fetchData();
    }
  }, [mapId, userId, token, apiUrl]);
  
  // Verificar si un distrito está desbloqueado
  const isDistrictUnlocked = useCallback((districtId: string): boolean => {
    if (!userProgress) return false;
    return userProgress.unlockedDistricts.includes(districtId);
  }, [userProgress]);
  
  // Verificar si un distrito está completado
  const isDistrictCompleted = useCallback((districtId: string): boolean => {
    if (!userProgress) return false;
    return userProgress.completedDistricts.includes(districtId);
  }, [userProgress]);
  
  // Calcular porcentaje de compleción
  const calculateCompletionPercentage = useCallback((districtId: string): number => {
    if (!userProgress) return 0;
    
    const districtProgress = userProgress.districtProgress.find(dp => dp.districtId === districtId);
    if (!districtProgress) return 0;
    
    // Calcular porcentaje basado en objetivos completados
    const totalObjectives = districtProgress.objectives.length;
    if (totalObjectives === 0) return 0;
    
    const completedObjectives = districtProgress.objectives.filter(obj => obj.completed).length;
    return Math.round((completedObjectives / totalObjectives) * 100);
  }, [userProgress]);
  
  // Abrir diálogo para desbloquear distrito
  const handleOpenUnlockDialog = (district: District) => {
    setSelectedDistrict(district);
    setUnlockDialogOpen(true);
  };
  
  // Cerrar diálogo
  const handleCloseUnlockDialog = () => {
    setUnlockDialogOpen(false);
    setSelectedDistrict(null);
  };
  
  // Desbloquear distrito
  const handleUnlockDistrict = async () => {
    if (!selectedDistrict) return;
    
    setUnlocking(true);
    
    try {
      // Crear payload seguro
      const payload = {
        userId,
        districtId: selectedDistrict.id,
        timestamp: new Date().toISOString()
      };
      
      // Cifrar payload para mayor seguridad
      const encryptedData = encryptAES(JSON.stringify(payload));
      
      // Enviar solicitud de desbloqueo
      const response = await fetch(`${apiUrl}/maps/${mapId}/districts/${selectedDistrict.id}/unlock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: encryptedData })
      });
      
      if (!response.ok) {
        throw new Error('No se pudo desbloquear el distrito');
      }
      
      // Actualizar progreso local
      setUserProgress(prev => {
        if (!prev) return {
          userId,
          mapId,
          unlockedDistricts: [selectedDistrict.id],
          completedDistricts: [],
          districtProgress: []
        };
        
        return {
          ...prev,
          unlockedDistricts: [...prev.unlockedDistricts, selectedDistrict.id]
        };
      });
      
      // Notificar al componente padre
      onDistrictUnlock(selectedDistrict);
      
      // Cerrar diálogo
      handleCloseUnlockDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desbloquear distrito');
      console.error('Error al desbloquear distrito:', err);
    } finally {
      setUnlocking(false);
    }
  };
  
  // Seleccionar distrito
  const handleSelectDistrict = (district: District) => {
    if (isDistrictUnlocked(district.id)) {
      onDistrictSelect(district);
    } else {
      handleOpenUnlockDialog(district);
    }
  };
  
  // Renderizar tarjeta de distrito
  const renderDistrictCard = (district: District) => {
    const unlocked = isDistrictUnlocked(district.id);
    const completed = isDistrictCompleted(district.id);
    const completionPercentage = calculateCompletionPercentage(district.id);
    
    return (
      <Card 
        key={district.id}
        sx={{
          p: 2,
          cursor: 'pointer',
          opacity: unlocked ? 1 : 0.7,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 3
          },
          position: 'relative',
          overflow: 'visible'
        }}
        onClick={() => handleSelectDistrict(district)}
      >
        {completed && (
          <Tooltip title="Distrito completado">
            <CheckCircleIcon 
              color="success" 
              sx={{ 
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: 'white',
                borderRadius: '50%'
              }} 
            />
          </Tooltip>
        )}
        
        <Box sx={{ mb: 1 }}>
          {unlocked ? (
            <LockOpenIcon color="success" />
          ) : (
            <LockIcon color="action" />
          )}
        </Box>
        
        <Typography variant="h6" gutterBottom>
          {district.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {district.description || 'Explora este distrito para descubrir sus secretos'}
        </Typography>
        
        {unlocked && (
          <Box sx={{ mt: 2, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Progreso
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {completionPercentage}%
              </Typography>
            </Box>
            <Box 
              sx={{ 
                width: '100%', 
                height: 4, 
                backgroundColor: 'grey.200', 
                borderRadius: 2,
                mt: 0.5
              }}
            >
              <Box 
                sx={{ 
                  width: `${completionPercentage}%`, 
                  height: '100%', 
                  backgroundColor: completed ? 'success.main' : 'primary.main', 
                  borderRadius: 2 
                }}
              />
            </Box>
          </Box>
        )}
      </Card>
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.location.reload()} 
          sx={{ mt: 2 }}
        >
          Reintentar
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Distritos disponibles
      </Typography>
      
      {districts.length === 0 ? (
        <Typography>No hay distritos disponibles</Typography>
      ) : (
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {districts.map(district => (
            <Grid item xs={12} sm={6} md={4} key={district.id}>
              {renderDistrictCard(district)}
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Diálogo para desbloquear distrito */}
      <Dialog
        open={unlockDialogOpen}
        onClose={!unlocking ? handleCloseUnlockDialog : undefined}
      >
        <DialogTitle>
          Desbloquear distrito
        </DialogTitle>
        <DialogContent>
          {selectedDistrict && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedDistrict.name}
              </Typography>
              <Typography variant="body1" paragraph>
                ¿Quieres desbloquear este distrito? Necesitarás completar objetivos para progresar.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedDistrict.unlockRequirements || 'No hay requisitos especiales para desbloquear este distrito.'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseUnlockDialog} 
            disabled={unlocking}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUnlockDistrict} 
            variant="contained" 
            color="primary"
            disabled={unlocking}
            startIcon={unlocking ? <CircularProgress size={20} /> : <LockOpenIcon />}
          >
            {unlocking ? 'Desbloqueando...' : 'Desbloquear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DistrictManager; 