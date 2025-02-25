/**
 * Página de inicio de MapYourWorld
 * Muestra las principales funcionalidades y llama a la acción
 */

import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, Button, Container, Grid, Typography, Card, CardContent, 
  CardMedia, Link, Paper, useTheme, useMediaQuery 
} from '@mui/material';
import ExploreIcon from '@mui/icons-material/Explore';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NotificationCenter from '@frontend/web/src/components/NotificationCenter';

// Componente de sección hero con fondo de mapa
const HeroSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        position: 'relative',
        height: isMobile ? '60vh' : '70vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        backgroundImage: 'url(/assets/map-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography
          variant="h1"
          component="h1"
          color="white"
          fontWeight="bold"
          gutterBottom
          sx={{ 
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          MapYourWorld
        </Typography>
        
        <Typography
          variant="h4"
          component="p"
          color="white"
          gutterBottom
          sx={{ 
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
            mb: 4,
            maxWidth: '800px',
            mx: 'auto',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          Explora ciudades, desbloquea distritos y descubre lugares increíbles
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            component={RouterLink} 
            to="/signup" 
            variant="contained" 
            size="large" 
            color="primary"
            startIcon={<ExploreIcon />}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              boxShadow: theme.shadows[5]
            }}
          >
            Comenzar Aventura
          </Button>
          
          <Button 
            component={RouterLink} 
            to="/maps" 
            variant="outlined" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'primary.light',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Ver Mapas
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Componente de características principales
const Features: React.FC = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          ¿Qué ofrece MapYourWorld?
        </Typography>
        
        <Grid container spacing={4}>
          {[
            {
              icon: <ExploreIcon fontSize="large" />,
              title: 'Explora Ciudades',
              description: 'Descubre los secretos, historia y lugares increíbles de ciudades de todo el mundo a través de rutas interactivas.'
            },
            {
              icon: <LockOpenIcon fontSize="large" />,
              title: 'Desbloquea Distritos',
              description: 'Progresa en tu aventura desbloqueando distritos y completando objetivos para obtener puntos y recompensas.'
            },
            {
              icon: <PhotoCameraIcon fontSize="large" />,
              title: 'Captura Momentos',
              description: 'Toma fotos de los lugares que visitas, compártelas con la comunidad y crea un álbum personal de tus viajes.'
            },
            {
              icon: <EmojiEventsIcon fontSize="large" />,
              title: 'Compite',
              description: 'Sube en el ranking, gana insignias y compite con amigos para ver quién descubre más lugares y completa más retos.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: 6
                }
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  bgcolor: 'primary.main',
                  color: 'white',
                  height: '80px'
                }}>
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3" align="center">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Componente de mapas populares
const PopularMaps: React.FC = () => {
  // Datos de ejemplo - normalmente vendrían de la API
  const popularMaps = [
    {
      id: '1',
      name: 'Madrid Histórico',
      image: '/assets/madrid.jpg',
      description: 'Recorre los sitios históricos más emblemáticos de la capital española.',
      districts: 5,
      points: 120
    },
    {
      id: '2',
      name: 'Barcelona Modernista',
      image: '/assets/barcelona.jpg',
      description: 'Descubre las obras de Gaudí y el modernismo catalán en un recorrido fascinante.',
      districts: 4,
      points: 105
    },
    {
      id: '3',
      name: 'Sevilla Monumental',
      image: '/assets/sevilla.jpg',
      description: 'Explora los monumentos y la historia de una de las ciudades más bellas de Andalucía.',
      districts: 3,
      points: 90
    }
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Mapas Populares
        </Typography>
        
        <Grid container spacing={4}>
          {popularMaps.map((map) => (
            <Grid item xs={12} md={4} key={map.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={map.image}
                  alt={map.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    {map.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {map.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Distritos: {map.districts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Puntos: {map.points}
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    component={RouterLink} 
                    to={`/maps/${map.id}`} 
                    variant="contained" 
                    fullWidth
                    color="primary"
                  >
                    Explorar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Button 
            component={RouterLink} 
            to="/maps" 
            variant="outlined" 
            size="large"
            sx={{ borderRadius: '30px', px: 4 }}
          >
            Ver todos los mapas
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

// Componente de testimonios
const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Ana García',
      text: '"MapYourWorld ha cambiado la forma en que viajo. Ahora cada viaje se convierte en una aventura de descubrimiento. He descubierto lugares increíbles que nunca hubiera encontrado por mi cuenta."',
      avatar: '/assets/avatar1.jpg'
    },
    {
      name: 'Carlos Rodríguez',
      text: '"Increíble aplicación para conocer las ciudades de una forma diferente. La competición con amigos hace que sea aún más divertido explorar y descubrir nuevos lugares."',
      avatar: '/assets/avatar2.jpg'
    },
    {
      name: 'María Jiménez',
      text: '"He visitado Barcelona tres veces, pero solo cuando usé MapYourWorld sentí que realmente conocí la ciudad. Los distritos y puntos de interés están muy bien seleccionados."',
      avatar: '/assets/avatar3.jpg'
    }
  ];
  
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Lo que dicen nuestros usuarios
        </Typography>
        
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: 'white',
                  borderRadius: 2,
                }}
              >
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    fontStyle: 'italic',
                    mb: 3,
                    flexGrow: 1
                  }}
                >
                  {testimonial.text}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      mr: 2
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {testimonial.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Componente de llamada a la acción
const CallToAction: React.FC = () => {
  return (
    <Box 
      sx={{ 
        py: 10, 
        bgcolor: 'primary.main',
        color: 'white'
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
          ¿Listo para comenzar tu aventura?
        </Typography>
        
        <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
          Únete a miles de exploradores que ya están descubriendo el mundo de una forma nueva y emocionante.
        </Typography>
        
        <Button 
          component={RouterLink} 
          to="/signup" 
          variant="contained" 
          size="large" 
          color="secondary"
          sx={{ 
            px: 6, 
            py: 1.5,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '30px'
          }}
        >
          Registrarme Ahora
        </Button>
      </Container>
    </Box>
  );
};

// Página principal completa
const Home: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>('');
  
  useEffect(() => {
    // Cargar configuración del entorno
    setApiUrl(process.env.REACT_APP_API_URL || 'http://localhost:3001');
  }, []);
  
  return (
    <Box>
      <HeroSection />
      <Features />
      <PopularMaps />
      <Testimonials />
      <CallToAction />
    </Box>
  );
};

export default Home; 