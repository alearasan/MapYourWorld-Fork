import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";


// Interfaz temporal para las stats
// Cambiar por la real cuando esté disponible

interface UserStats {
    unlockedDistricts: number;
    totalPhotos: number;
    totalComments: number;
    totalLikes: number;
    achievements: number;
    accountAge: number;
    rank: number;
    totalDistance: number;
    totalTime: number;
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
            setTestMode(true);

            const storedUserId = await AsyncStorage.getItem("userId");
            
            if (storedUserId) {
              console.log("Usando ID temporal guardado:", storedUserId);
              effectiveUser = { id: storedUserId, username: 'Usuario de Prueba' };
            } else {

              const temporalUserId = "user-456";
              console.log("Creando nuevo ID temporal:", temporalUserId);
              
              await AsyncStorage.setItem("userId", temporalUserId);
              effectiveUser = { id: temporalUserId, username: 'Usuario de Prueba' };

              Alert.alert(
                "Modo de Prueba",
                "Estás viendo estadísticas en modo de prueba. Los datos mostrados son simulados.",
                [{ text: "Entendido", style: "default" }]
              );
            }
          }

        // Datos simulados con el tipo de stats actual
        // cambiar por llamada a la API con datos correctos
        const mockStats: UserStats = {
          unlockedDistricts: 8,
          totalPhotos: 24,
          totalComments: 36,
          totalLikes: 152,
          achievements: 12,
          accountAge: 45,
          rank: 42,
          totalDistance: 128.5,
          totalTime: 1840
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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Resumen de actividad
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Distritos desbloqueados</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.unlockedDistricts}</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">Fotos subidas</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalPhotos}</Text>
            </View>
            
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Logros desbloqueados</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.achievements}</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">Posición en ranking</Text>
              <Text className="text-xl font-bold text-teal-600">#{stats?.rank}</Text>
            </View>
          </View>
        </View>
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Actividad social
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Me gusta recibidos</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalLikes}</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">Comentarios</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalComments}</Text>
            </View>
          </View>
        </View>
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Recorrido total
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Distancia recorrida</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalDistance} km</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">Tiempo activo</Text>
              <Text className="text-xl font-bold text-teal-600">{formatTime(stats?.totalTime || 0)}</Text>
            </View>
            
            <View className="w-full mb-4">
              <Text className="text-gray-500 text-sm">Usuario desde</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.accountAge} días</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserStatsScreen;
