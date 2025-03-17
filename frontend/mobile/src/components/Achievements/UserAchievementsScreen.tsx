import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
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

            Alert.alert(
              "Modo de Prueba",
              "Estás viendo logros en modo de prueba. Los datos mostrados son simulados.",
              [{ text: "Entendido", style: "default" }]
            );
          }
        }

        // Datos simulados para los logros
        const mockAchievements: Achievement[] = [
          {
            name: "Primer Logro",
            description: "Has obtenido tu primer logro.",
            dateEarned: "2025-03-01",
            points: 10,
            iconUrl: "https://example.com/icon1.png"
          },
          {
            name: "Explorador",
            description: "Has visitado 10 lugares.",
            dateEarned: "2025-03-05",
            points: 20,
            iconUrl: "https://example.com/icon2.png"
          },
          {
            name: "Veterano",
            description: "Has acumulado 100 puntos.",
            dateEarned: "2025-03-10",
            points: 30,
            iconUrl: "https://example.com/icon3.png"
          }
        ];

        setTimeout(() => {
          setAchievements(mockAchievements);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error al obtener los logros", error);
        setError("Error al obtener los logros");
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Cargando logros...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-800 mb-4">Logros</Text>
        {achievements.map((ach, index) => (
          <View key={index} className="bg-white rounded-xl shadow-md p-5 mb-4 flex-row">
            <Image
              source={{ uri: ach.iconUrl }}
              style={{ width: 50, height: 50, marginRight: 15 }}
            />
            <View className="flex-1">
              <Text className="text-xl font-bold text-teal-600">{ach.name}</Text>
              <Text className="text-gray-600">{ach.description}</Text>
              <Text className="text-sm text-gray-500">Obtenido el: {ach.dateEarned}</Text>
              <Text className="text-sm text-gray-500">Puntos: {ach.points}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default UserAchievementsScreen;
