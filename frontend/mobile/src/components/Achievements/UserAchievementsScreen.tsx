import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, Alert, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getCurrentUser } from '@/services/auth.service';

// Interfaz para los logros
interface Achievement {
  name: string;
  description: string;
  dateEarned: string;
  points: number;
  iconUrl: string;
}

const UserAchievementsScreen = () => {
  const user = getCurrentUser();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal de creación de logros
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [achievementName, setAchievementName] = useState<string>("");
  const [achievementDescription, setAchievementDescription] = useState<string>("");
  const [achievementDate, setAchievementDate] = useState<string>("");
  const [achievementIcon, setAchievementIcon] = useState<string>("https://example.com/icon1.png");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        let effectiveUser = user;
        if (!effectiveUser) {
          console.log("No hay usuario autenticado, usando modo de prueba para logros");
          const storedUserId = await AsyncStorage.getItem("userId");
          if (storedUserId) {
            console.log("Usando ID temporal guardado:", storedUserId);
            effectiveUser = { id: storedUserId, username: 'Usuario de Prueba', email: "mail@gmail.com", isPremium: true, createdAt: "2000-01-01" };
          } else {
            const temporalUserId = "user-456";
            console.log("Creando nuevo ID temporal:", temporalUserId);
            await AsyncStorage.setItem("userId", temporalUserId);
            effectiveUser = { id: temporalUserId, username: 'Usuario de Prueba', email: "mail@gmail.com", isPremium: true, createdAt: "2000-01-01" };

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

  // Function to create a new achievement
  const createAchievement = async () => {
    if (!achievementName.trim()) {
      Alert.alert("Error", "Por favor, ingresa un nombre para el logro");
      return;
    }

    try {
      setLoading(true);

      console.log("Creando logro:", {
        nombre: achievementName,
        descripción: achievementDescription,
        fecha: achievementDate,
        icono: achievementIcon,
      });

      // RN: Only premium users can create achievements
      if (user ? user.isPremium : false) {
        throw new Error("Solo los usuarios premium pueden crear logros");
      }

      const achievementData = {
        name: achievementName,
        description: achievementDescription || "Logro desbloqueado",
        achievementDate: achievementDate || new Date().toISOString(),
        icon: achievementIcon || "default_icon.png",
      };

      const userId = user ? user.id : null;
      const response = await fetch(`${API_URL}/api/achievements/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          achievementData,
          userId,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("La respuesta del servidor no es válida (no es JSON)");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.success) {
        setAchievementName("");
        setAchievementDescription("");
        setAchievementDate(new Date().toISOString());
        setAchievementIcon("default_icon.png");
        setShowCreateModal(false);
        Alert.alert("Éxito", "Logro creado correctamente");
      } else {
        throw new Error(data.message || "Error al crear el logro");
      }
    } catch (error) {
      console.error("Error al crear logro:", error);
      Alert.alert(
        "Error",
        `No se pudo crear el logro: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Modal for creating an achievement
  const renderCreateAchievementModal = () => (user?.isPremium ? (
    <Modal
      visible={showCreateModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Logro</Text>
  
          <Text style={styles.inputLabel}>Nombre del logro*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Explorador Maestro"
            value={achievementName}
            onChangeText={setAchievementName}
            maxLength={30}
          />
  
          <Text style={styles.inputLabel}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción del logro"
            value={achievementDescription}
            onChangeText={setAchievementDescription}
            multiline={true}
            maxLength={100}
          />
  
          <Text style={styles.inputLabel}>Fecha del logro</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={achievementDate}
            onChangeText={setAchievementDate}
          />
  
          <Text style={styles.inputLabel}>Ícono del logro</Text>
          <TextInput
            style={styles.input}
            placeholder="URL del icono"
            value={achievementIcon}
            onChangeText={setAchievementIcon}
          />
  
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>Cancelar</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={[styles.modalButton, styles.createButton]}
              onPress={createAchievement}
            >
              <Text style={styles.buttonText}>Crear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ) : (
    <Modal
      visible={showCreateModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Oops</Text>
  
          <Text style={styles.inputLabel}>Tienes que ser usuario premium para desbloquear esta funcionalidad</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={[styles.buttonText, { color: "#fff" }]}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ));

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View>
        {/* Cabecera */}
        <View style={styles.header}  className="p-4">
          <Text style={styles.headerTitle}>Logros</Text>
          <TouchableOpacity
          style={styles.createAchievementButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Icon name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Lista de logros */}
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

      {/* Modales */}
      {renderCreateAchievementModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  createAchievementButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f44336", // Rojo para botones de cancelar
  },
  createButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
});

export default UserAchievementsScreen;
