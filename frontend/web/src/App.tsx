/**
 * Aplicación de ejemplo para MapYourWorld
 */
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  CssBaseline, 
  Toolbar, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  Paper, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import NotificationCenter, { Notification, NotificationType } from './components/NotificationCenter';

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#0072B2',
    },
    secondary: {
      main: '#E18A00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

// Datos simulados
const MOCK_USER = {
  id: '123',
  name: 'Usuario Ejemplo',
  email: 'usuario@ejemplo.com',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzdWFyaW9AZWplbXBsby5jb20iLCJpYXQiOjE2MTQ1NjA0MDB9.4AO7hBjyTIIWcTjMYaqZyhOYcnKmcQT5NHyiRWzWKfU'
};

// Notificaciones de ejemplo
const EXAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: NotificationType.DISTRICT_UNLOCKED,
    title: '¡Nuevo distrito desbloqueado!',
    message: 'Has desbloqueado el distrito Centro de Sevilla',
    createdAt: new Date().toISOString(),
    read: false,
    districtId: 'distrito-1',
    districtName: 'Centro de Sevilla'
  },
  {
    id: '2',
    type: NotificationType.PHOTO_UPLOADED,
    title: 'Foto subida con éxito',
    message: 'Tu foto en Plaza de España ha sido publicada',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    read: true,
    photoId: 'foto-1',
    photoUrl: 'https://example.com/foto1.jpg'
  },
  {
    id: '3',
    type: NotificationType.PHOTO_COMMENT,
    title: 'Nuevo comentario',
    message: 'María ha comentado en tu foto',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
    read: false,
    photoId: 'foto-2',
    userId: 'usuario-2',
    userName: 'María'
  }
];

/**
 * Componente principal de la aplicación
 */
function App() {
  // Estado
  const [notifications, setNotifications] = useState<Notification[]>(EXAMPLE_NOTIFICATIONS);
  const [wsConnected, setWsConnected] = useState(false);
  
  // Simular una conexión WebSocket después de cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      setWsConnected(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Manejar clic en notificación
  const handleNotificationClick = (notification: Notification) => {
    console.log('Notificación seleccionada:', notification);
    // Aquí podrías navegar a la página correspondiente según el tipo de notificación
  };
  
  // Añadir una notificación de ejemplo
  const addExampleNotification = () => {
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      type: NotificationType.PHOTO_LIKE,
      title: '¡Nueva interacción!',
      message: 'A alguien le ha gustado tu foto',
      createdAt: new Date().toISOString(),
      read: false,
      photoId: 'foto-3',
      userId: 'usuario-3',
      userName: 'Carlos'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MapYourWorld
            </Typography>
            
            {/* Componente de notificaciones */}
            {wsConnected && (
              <NotificationCenter 
                wsUrl="http://localhost:3001"
                token={MOCK_USER.token}
                userId={MOCK_USER.id}
                onNotificationClick={handleNotificationClick}
              />
            )}
          </Toolbar>
        </AppBar>
        
        <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido a MapYourWorld
            </Typography>
            <Typography variant="body1" paragraph>
              Esta es una aplicación de demostración que muestra el centro de notificaciones 
              en tiempo real. Haz clic en el botón de abajo para simular una nueva notificación.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addExampleNotification}
            >
              Simular nueva notificación
            </Button>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Notificaciones activas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total: {notifications.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No leídas: {notifications.filter(n => !n.read).length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Estado de la conexión
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    WebSocket: {wsConnected ? 'Conectado' : 'Desconectado'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuario: {MOCK_USER.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
        
        <Box component="footer" sx={{ p: 2, mt: 'auto', bgcolor: 'background.paper' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            MapYourWorld © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App; 