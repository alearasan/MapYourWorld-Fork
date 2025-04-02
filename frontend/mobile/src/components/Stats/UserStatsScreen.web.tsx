import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ImageBackground, View, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants/config';
import { styles as globalStyles } from '../../assets/styles/styles';

// Interfaz para las estadísticas
interface UserStats {
  totalLogros: number;
  totalAmigos: number;
  totalPoisCreados: number;
  districtsUnlocked: number;
  collaborativeMaps: number;
}

const UserStatsScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [numberOfUserAchievements, setNumberOfUserAchievements] = useState<number | null>(null);
  const [totalNumberOfAchievements, setTotalNumberOfAchievements] = useState<number | null>(null);
  const [numberOfFriends, setNumberOfFriends] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchivements = async () => {
      try {
        let effectiveUser = user;
        console.log("Usuario logeado:", effectiveUser);

        // Realizar llamada a la API para obtener lod logros del usuario
        const response = await fetch(`${API_URL}/api/user-achievements/achievements/${effectiveUser!.id}`);
        console.log("Respuesta de la API:", response);
        let userAchivements = null;

        if (response.ok) {
          // Si la respuesta es exitosa, parsear el JSON
          const data = await response.json();
          console.log("Logros del usuario:", data);
          userAchivements = data;
        }
        setNumberOfUserAchievements(userAchivements.length);
        setLoading(false);
      } catch (error: any) {
        console.error("Error al obtener los logros del usuario:", error);
        setError("Error al obtener los logros del usuario");
        setLoading(false);
      }
    };

    const fetchFriends = async () => {
      try {
        let effectiveUser = user;
        console.log("Usuario logeado:", effectiveUser);

        // Realizar llamada a la API para obtener los amigos del usuario
        const response = await fetch(`${API_URL}/api/friends/friends/${effectiveUser!.id}`);
        console.log("Respuesta de la API:", response);
        let friends = null;

        if (response.ok) {
          // Si la respuesta es exitosa, parsear el JSON
          const data = await response.json();
          console.log("Amigos del usuario:", data);
          friends = data;
        }
        setNumberOfFriends(friends.length);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener amigos", error);
        setError("Error al obtener amigos");
        setLoading(false);
      }
    };

    const fetchTotalAchievements = async () => {
      try {
        const response = await fetch(`${API_URL}/api/achievements`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Error al obtener logros totales");
        }
        const data = await response.json();
        // Suponiendo que la API retorna un arreglo de logros, usamos su longitud
        setTotalNumberOfAchievements(data.length);
      } catch (error) {
        console.error("Error al obtener logros totales", error);
      }
    };

    
  
    fetchTotalAchievements();
    fetchFriends();
    fetchAchivements();
  }, [user]);

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
    <View style={webStyles.root}>
      <ImageBackground
              source={require('../../assets/images/login_background.webp')}
              style={webStyles.background}
              resizeMode="cover"
      >
        <View style={globalStyles.semi_transparent_overlay} />
        <View style={webStyles.container}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          padding: '30px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
            📊 Tus Estadísticas
          </h1>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px'
          }}>
            {/* Tarjeta Ranking */}
            <div style={{
              backgroundColor: '#e0f2f1',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#0d9488' }}>
                🏆 Ranking
              </h2>
              <p style={{ fontSize: '18px', margin: '5px 0', color: '#1f2937' }}>
                Logros: Tienes <span style={{ fontWeight: 'bold' }}>{numberOfUserAchievements}</span> logros de <span style={{ fontWeight: 'bold' }}>{totalNumberOfAchievements}</span>
              </p>
              
            </div>

            {/* Tarjeta Actividad Social */}
            <div style={{
              backgroundColor: '#e8eaf6',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#3f51b5' }}>
                👥 Actividad Social
              </h2>
              <p style={{ fontSize: '18px', margin: '5px 0', color: '#1f2937' }}>
                Amigos: <span style={{ fontWeight: 'bold' }}>{numberOfFriends}</span>
              </p>
            </div>

            {/* Tarjeta Actividad en Mapas */}
            <div style={{
              backgroundColor: '#fff3e0',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#fb8c00' }}>
                🗺️ Actividad en Mapas
              </h2>
              <p style={{ fontSize: '18px', margin: '5px 0', color: '#1f2937' }}>
                POIs Creados: <span style={{ fontWeight: 'bold' }}>{stats?.totalPoisCreados}</span>
              </p>
            </div>
          </div>
        </div>
        </View>
      </ImageBackground>
    </View>
  );
};

const webStyles = StyleSheet.create({
  root: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 500,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 36,
    lineHeight: 46,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
    textAlign: 'center',
  },
  titleMain: {
    color: '#1e293b',
  },
  titleHighlight: {
    color: '#14b8a6',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748b',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#14b8a6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    opacity: 0.7
  },
  tertiaryButton: {
    marginTop: 5,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  tertiaryButtonText: {
    color: '#334155',
    fontSize: 14,
  }
});

export default UserStatsScreen;