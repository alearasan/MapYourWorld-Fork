/**
 * Página de Galería de Fotos
 * Muestra las fotos subidas por los usuarios organizadas por distrito o POI
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Grid, Typography, Box, Tabs, Tab, CircularProgress, Button, TextField } from '@mui/material';
import { Search as SearchIcon, Place as PlaceIcon, PhotoCamera as CameraIcon } from '@mui/icons-material';

// TODO: Importar componentes y servicios necesarios

interface Photo {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  caption?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  poiId?: string;
  poiName?: string;
  districtId?: string;
  districtName?: string;
  userId: string;
  username: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

/**
 * Componente para mostrar una tarjeta de foto individual
 */
const PhotoCard: React.FC<{ photo: Photo; onPhotoClick: (id: string) => void }> = ({ photo, onPhotoClick }) => {
  return (
    <Box
      sx={{
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 1,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
      onClick={() => onPhotoClick(photo.id)}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '100%', // Mantiene relación de aspecto 1:1
          backgroundImage: `url(${photo.thumbnailUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
        <Typography variant="body2" noWrap>
          {photo.caption || 'Sin descripción'}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {photo.username} • {new Date(photo.createdAt).toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

/**
 * Componente para mostrar el detalle de una foto
 */
const PhotoDetail: React.FC<{ photoId: string; onClose: () => void }> = ({ photoId, onClose }) => {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhotoDetails = async () => {
      // TODO: Implementar carga de detalles de foto
      // 1. Mostrar indicador de carga
      // 2. Obtener detalles de la foto desde API
      // 3. Actualizar estado
      setLoading(true);
      try {
        // Simulación de carga
        setLoading(false);
        setPhoto(null);
      } catch (err) {
        setError('Error al cargar detalles de la foto');
        setLoading(false);
      }
    };
    
    loadPhotoDetails();
  }, [photoId]);

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
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  if (!photo) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Foto no encontrada</Typography>
        <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* TODO: Implementar visualización de detalles de foto */}
      <Button variant="outlined" onClick={onClose} sx={{ mt: 2 }}>
        Volver
      </Button>
    </Box>
  );
};

/**
 * Página principal de Galería de Fotos
 */
const PhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  const { districtId, poiId } = useParams<{ districtId?: string; poiId?: string }>();
  
  const [tabValue, setTabValue] = useState(districtId ? 1 : poiId ? 2 : 0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  /**
   * Carga las fotos según los filtros aplicados
   */
  useEffect(() => {
    const loadPhotos = async () => {
      // TODO: Implementar carga de fotos
      // 1. Mostrar indicador de carga
      // 2. Construir consulta según filtros (tab, districtId, poiId)
      // 3. Llamar a la API para obtener fotos
      // 4. Actualizar estado
      setLoading(true);
      try {
        // Simulación de carga
        setTimeout(() => {
          setPhotos([]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error al cargar fotos');
        setLoading(false);
      }
    };
    
    loadPhotos();
  }, [tabValue, districtId, poiId, searchQuery]);

  /**
   * Maneja el cambio de tab
   */
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Resetear filtros al cambiar de tab
    if (newValue === 0) {
      navigate('/photos');
    }
  };

  /**
   * Maneja la selección de una foto para ver detalles
   */
  const handlePhotoClick = (photoId: string) => {
    setSelectedPhotoId(photoId);
  };

  /**
   * Cierra el detalle de foto
   */
  const handleCloseDetail = () => {
    setSelectedPhotoId(null);
  };

  /**
   * Maneja la búsqueda de fotos
   */
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implementar búsqueda
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Galería de Fotos
      </Typography>
      
      {/* Pestañas de filtrado */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="photo gallery tabs">
          <Tab label="Recientes" />
          <Tab label="Por Distrito" />
          <Tab label="Por Punto de Interés" />
        </Tabs>
      </Box>
      
      {/* Formulario de búsqueda */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4, display: 'flex' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar fotos por descripción o ubicación"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
        <Button type="submit" variant="contained" sx={{ ml: 2 }}>
          Buscar
        </Button>
      </Box>
      
      {/* Contenido principal: galería o detalle */}
      {selectedPhotoId ? (
        <PhotoDetail photoId={selectedPhotoId} onClose={handleCloseDetail} />
      ) : (
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : photos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CameraIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6">No hay fotos disponibles</Typography>
              <Typography color="text.secondary">
                Sé el primero en compartir una foto de este lugar
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Subir foto
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {photos.map((photo) => (
                <Grid item key={photo.id} xs={12} sm={6} md={4} lg={3}>
                  <PhotoCard photo={photo} onPhotoClick={handlePhotoClick} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default PhotoGallery; 