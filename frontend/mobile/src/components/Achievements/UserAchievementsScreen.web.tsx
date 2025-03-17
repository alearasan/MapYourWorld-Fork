import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaz para los logros
interface Achievement {
  name: string;
  description: string;
  dateEarned: string;
  points: number;
  iconUrl: string;
}

const UserAchievementsScreen = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        let effectiveUser = user;
        if (!effectiveUser) {
          console.log("No hay usuario autenticado, usando modo de prueba para logros");
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

        // Datos simulados para los logros
        const mockAchievements: Achievement[] = [
          {
            name: "Primer Logro",
            description: "Has obtenido tu primer logro.",
            dateEarned: "2025-03-01",
            points: 10,
            iconUrl: "https://example.com/icon1.png",
          },
          {
            name: "Explorador",
            description: "Has visitado 10 lugares distintos.",
            dateEarned: "2025-03-05",
            points: 20,
            iconUrl: "https://example.com/icon2.png",
          },
          {
            name: "Veterano",
            description: "Has acumulado 100 puntos en total.",
            dateEarned: "2025-03-10",
            points: 30,
            iconUrl: "https://example.com/icon3.png",
          },
        ];

        setTimeout(() => {
          setAchievements(mockAchievements);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener los logros', error);
        setError('Error al obtener los logros');
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <ActivityIndicator size="large" color="#2bbbad" />
        </div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>Cargando logros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 16,
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ color: '#ef4444', fontSize: 18, marginBottom: 8 }}>{error}</div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>
          Inicia sesión para ver tus logros
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        padding: 16,
        maxWidth: '800px',
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <h2
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: 16,
        }}
      >
        Logros
      </h2>
      {achievements.map((achievement, index) => (
        <div
          key={index}
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            padding: 20,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            src={achievement.iconUrl}
            alt={achievement.name}
            style={{
              width: 60,
              height: 60,
              marginRight: 15,
              borderRadius: 8,
            }}
          />
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#0d9488',
                marginBottom: 4,
              }}
            >
              {achievement.name}
            </h3>
            <p style={{ color: '#6b7280', fontSize: 16, marginBottom: 4 }}>
              {achievement.description}
            </p>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Obtenido el: {achievement.dateEarned}
            </p>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              Puntos: {achievement.points}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAchievementsScreen;
