import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";


// Interfaz temporal para las stats
// Cambiar por la real cuando esté disponible

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

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Ranking
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Logros</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalLogros}</Text>
            </View>
            
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Días Consecutivos</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.daysConsecutive}</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">Puntos de Ranking</Text>
              <Text className="text-xl font-bold text-teal-600">#{stats?.rankingPoints}</Text>
            </View>
          </View>
        </View>
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Actividad Social
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Amigos</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.totalAmigos}</Text>
            </View>
            
          </View>
        </View>
        
        <View className="bg-white rounded-xl shadow-md p-5 mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Actividad en Mapas
          </Text>
          
          <View className="flex-row flex-wrap justify-between mt-3">
            <View className="w-1/2 pr-2 mb-4">
              <Text className="text-gray-500 text-sm">Distancia Acumulada</Text>
              <Text className="text-xl font-bold text-teal-600">{stats?.distanciaAcumulada} km</Text>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <Text className="text-gray-500 text-sm">POIs Creados</Text>
              <Text className="text-xl font-bold text-teal-600">{formatTime(stats?.totalPoisCreados || 0)}</Text>
            </View>
            
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserStatsScreen;
