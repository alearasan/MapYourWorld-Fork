import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '../../constants/config';

// Interfaz temporal para las stats
interface UserStats {
  totalPoisCreados: number,
  totalAmigos: number,
  totalLogros: number,
  distanciaAcumulada: number,
  daysConsecutive: number,
  rankingPoints: number,
}

const UserStatsScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let effectiveUser = user;
        
        if (!effectiveUser) {
          console.log("No hay usuario autenticado, usando modo de prueba para estadísticas");
          
          const storedUserId = await AsyncStorage.getItem("userId");
          
          if (storedUserId) {
            console.log("Usando ID temporal guardado:", storedUserId);
            effectiveUser = { id: storedUserId, username: 'Usuario de Prueba' };
          } else {
            const temporalUserId = "user-456";
            console.log("Creando nuevo ID temporal:", temporalUserId);
            
            await AsyncStorage.setItem("userId", temporalUserId);
            effectiveUser = { id: temporalUserId, username: 'Usuario de Prueba' };

          }
        }

        // Datos simulados con el tipo de stats actual
        // cambiar por llamada a la API con datos correctos
        const mockStats: UserStats = {
            totalPoisCreados: 12,
            totalAmigos: 4,
            totalLogros: 3,
            distanciaAcumulada: 23.5,
            daysConsecutive: 12,
            rankingPoints: 120,
        };

        setTimeout(() => {
          setStats(mockStats);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener las estadísticas');
        setError('Error al obtener las estadísticas');
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} h ${mins} min`;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ marginBottom: 20 }}>
          <ActivityIndicator size="large" color="#2bbbad" />
        </div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>Cargando estadísticas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 16,
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ color: '#ef4444', fontSize: 18, marginBottom: 8 }}>{error}</div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>
          Inicia sesión para ver tus estadísticas
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      padding: 16,
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: 20,
        marginBottom: 16
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          Ranking
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
          <div style={{ width: '50%', paddingRight: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Logros</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{stats?.totalLogros}</div>
          </div>
          
          <div style={{ width: '50%', paddingLeft: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Días Consecutivos</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{stats?.daysConsecutive}</div>
          </div>
          
          <div style={{ width: '50%', paddingRight: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Puntos de Ranking</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{stats?.rankingPoints}</div>
          </div>
          
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: 20,
        marginBottom: 16
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          Actividad social
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
          <div style={{ width: '50%', paddingRight: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Amigos</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{stats?.totalAmigos}</div>
          </div>
          
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: 20,
        marginBottom: 16
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
          Actividad en Mapas
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 12 }}>
          <div style={{ width: '50%', paddingRight: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>Distancia Acumulada</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{stats?.distanciaAcumulada} km</div>
          </div>
          
          <div style={{ width: '50%', paddingLeft: 8, marginBottom: 16 }}>
            <div style={{ color: '#6b7280', fontSize: 14 }}>POIs Creados</div>
            <div style={{ fontSize: 20, fontWeight: 'bold', color: '#0d9488' }}>{formatTime(stats?.totalPoisCreados || 0)}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserStatsScreen;