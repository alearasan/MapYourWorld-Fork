/**
 * Componente NotificationCenter
 * Centro de notificaciones en tiempo real para la aplicación
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Badge, 
  Box, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  ListItemButton,
  Avatar, 
  Typography, 
  Popover,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Place as PlaceIcon,
  Photo as PhotoIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useSecureWebSocket } from '@frontend/web/src/hooks/useSecureWebSocket';
import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos de notificaciones
export enum NotificationType {
  DISTRICT_UNLOCKED = 'district.unlocked',
  PHOTO_UPLOADED = 'photo.uploaded',
  PHOTO_COMMENT = 'photo.comment',
  PHOTO_LIKE = 'photo.like',
  USER_FOLLOWED = 'user.followed',
  SYSTEM_NOTIFICATION = 'system.notification'
}

// Interfaz para una notificación
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  data?: Record<string, any>;
  // Campos opcionales según el tipo de notificación
  districtId?: string;
  districtName?: string;
  photoId?: string;
  photoUrl?: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
}

// Props para el componente
interface NotificationCenterProps {
  wsUrl: string;
  token: string;
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}

/**
 * Centro de notificaciones
 */
const NotificationCenter: React.FC<NotificationCenterProps> = ({
  wsUrl,
  token,
  userId,
  onNotificationClick
}) => {
  // Estado para almacenar las notificaciones
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  
  // Estado para el popover
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  
  // Conexión WebSocket
  const { state, send, subscribe } = useSecureWebSocket({
    url: wsUrl,
    path: '/ws',
    autoConnect: true,
    auth: { token }
  });
  
  // Manejar clic en el icono de notificaciones
  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Cerrar el popover
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  // Manejar clic en una notificación
  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Cerrar el popover
    handleClose();
    
    // Llamar al callback si existe
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };
  
  // Marcar una notificación como leída
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true } 
          : notif
      )
    );
    
    // Enviar al servidor que se ha leído
    if (state.isConnected) {
      send('notification:read', { notificationId });
    }
  }, [send, state.isConnected]);
  
  // Marcar todas las notificaciones como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    // Enviar al servidor que se han leído todas
    if (state.isConnected) {
      send('notification:readAll', { userId });
    }
  }, [send, state.isConnected, userId]);
  
  // Suscribirse a eventos de notificaciones
  useEffect(() => {
    if (state.isConnected && state.isAuthenticated) {
      // Suscribirse a nuevas notificaciones
      const unsubscribeNew = subscribe('notification:new', (data: Notification) => {
        setNotifications(prev => [data, ...prev]);
      });
      
      // Suscribirse a notificaciones existentes al conectarse
      const unsubscribePending = subscribe('notification:pending', (data: { notifications: Notification[] }) => {
        setNotifications(prev => [...data.notifications, ...prev]);
      });
      
      // Solicitar notificaciones pendientes
      send('notification:getPending', { userId });
      
      return () => {
        unsubscribeNew();
        unsubscribePending();
      };
    }
  }, [state.isConnected, state.isAuthenticated, subscribe, send, userId]);
  
  // Actualizar contador de no leídas cuando cambian las notificaciones
  useEffect(() => {
    const count = notifications.filter(notif => !notif.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // Formatear la fecha relativa
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { 
      addSuffix: true,
      locale: es
    });
  };
  
  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.DISTRICT_UNLOCKED:
        return <PlaceIcon color="primary" />;
      case NotificationType.PHOTO_UPLOADED:
        return <PhotoIcon color="secondary" />;
      case NotificationType.PHOTO_COMMENT:
        return <CommentIcon color="info" />;
      case NotificationType.PHOTO_LIKE:
        return <ThumbUpIcon color="success" />;
      case NotificationType.USER_FOLLOWED:
        return <PersonIcon color="warning" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };
  
  // Renderizar el componente
  return (
    <>
      <Tooltip title="Notificaciones">
        <IconButton
          aria-label="Notificaciones"
          onClick={handleNotificationsClick}
          color={unreadCount > 0 ? "primary" : "default"}
        >
          <Badge badgeContent={unreadCount} color="error">
            {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 360, 
            maxHeight: 500,
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Notificaciones
          </Typography>
          
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={markAllAsRead}
              sx={{ ml: 2 }}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Box>
        
        <Divider />
        
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No tienes notificaciones" 
                secondary="Las notificaciones aparecerán aquí" 
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem key={notification.id} disablePadding>
                <ListItemButton
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'rgba(0, 114, 178, 0.05)',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 114, 178, 0.1)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" component="div">
                        {notification.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" color="text.primary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {formatRelativeTime(notification.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationCenter; 