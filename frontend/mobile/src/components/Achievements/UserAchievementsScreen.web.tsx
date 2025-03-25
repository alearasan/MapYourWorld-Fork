import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_URL } from '@/constants/config';
import { useAuth } from '@/contexts/AuthContext';
import AlertModal from '../UI/Alert';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

interface Achievement {
  name: string;
  description: string;
  dateEarned: string;
  points: number;
  iconUrl: string;
}

const iconPlaceholder = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQOuXSNhx4c8pKvcysPWidz4NibDU-xLeaJw&s";

const UserAchievementsScreen = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [achievementName, setAchievementName] = useState<string>("");
  const [achievementDescription, setAchievementDescription] = useState<string>("");
  const [achievementPoints, setAchievementPoints] = useState<number>(0);
  const [achievementIcon, setAchievementIcon] = useState<string>(iconPlaceholder);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertActionText, setAlertActionText] = useState<string>("");
  const [alertOnAction, setAlertOnAction] = useState<(() => void) | undefined>(undefined);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const showAlert = (
    title: string,
    message: string,
    onAction?: () => void
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnAction(() => onAction);
    setAlertVisible(true);
  };
  

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      try {
        const response = await fetch(`${API_URL}/api/subscriptions/active/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        setSubscription(data);
      } catch (error) {
        console.error("Error al obtener la subscripción", error);
      }
    };

    const fetchAchievements = async () => {
      if (!user) {
        setError("No hay usuario autenticado");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/user-achievements/achievements/${user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        const transformed = data.map((item: any) => ({
          name: item.achievement ? item.achievement.name : item.name,
          description: item.achievement ? item.achievement.description : item.description,
          dateEarned: item.dateEarned,
          points: item.achievement ? item.achievement.points : item.points,
          iconUrl: item.achievement ? item.achievement.iconUrl : item.iconUrl,
        }));
        setAchievements(transformed);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los logros", error);
        setError("Error al obtener los logros");
        setLoading(false);
      }
    };

    fetchSubscription();
    fetchAchievements();
  }, [user]);

  const createAchievement = async () => {
    if (!achievementName.trim()) {
      showAlert("Error", "Por favor, ingresa un nombre para el logro");
      return;
    }

    try {
      setLoading(true);
      const achievementData = {
        name: achievementName,
        description: achievementDescription || "Logro desbloqueado",
        iconUrl: achievementIcon || iconPlaceholder,
        points: achievementPoints,
      };
      const response = await fetch(`${API_URL}/api/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(achievementData),
      });
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json"))
        throw new Error("La respuesta del servidor no es válida (no es JSON)");
      const data = await response.json();
      if (data.success) {
        setAchievementName("");
        setAchievementDescription("");
        setAchievementPoints(0);
        setAchievementIcon("default_icon.png");
        setShowCreateModal(false);
        showAlert("Éxito", "Logro creado correctamente");
      } else {
        throw new Error(data.message || "Error al crear el logro");
      }
    } catch (error: any) {
      console.error("Error al crear logro:", error);
      showAlert("Error", `No se pudo crear el logro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: 16,
          backgroundColor: '#f9fafb',
        }}
      >
        <div style={{ color: '#ef4444', fontSize: 18, marginBottom: 8 }}>{error}</div>
        <div style={{ color: '#4b5563', fontSize: 16 }}>Inicia sesión para ver tus logros</div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#f9fafb',
        margin: '0 auto',
        minWidth: '60%',
        padding: 16,
        minHeight: '100vh',
      }}
    >
      {/* Cabecera */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2196F3',
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h2 style={{ color: 'white', margin: 0, fontSize: 20 }}>Logros</h2>
        <button
          onClick={() => {
            if (subscription && subscription.plan !== "PREMIUM") {
              showAlert(
                "Función Premium",
                "La creación de logros personalizados es exclusiva para usuarios premium. ¡Mejora tu cuenta para desbloquear esta función!",
                () => {
                  navigation.navigate('Payment');
                  setAlertVisible(false);
                }
              );
            } else {
              setShowCreateModal(true);
            }            
          }}            
          style={{
            backgroundColor: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '20px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
          }}
        >
          <Icon name="add" size={24} color="white" />
        </button>
      </div>

      {/* Lista de logros – grid responsive */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 10,
        }}
      >
        {achievements.map((achievement, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: 20,
              display: 'flex',
              alignItems: 'center',
              minHeight: '20vh',
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
              <h3 style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488', marginBottom: 4 }}>
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

      {/* Modal de creación */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              maxWidth: 400,
              width: '85%',
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
              Crear Logro
            </h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, display: 'block' }}>
                Nombre del logro*
              </label>
              <input
                type="text"
                value={achievementName}
                onChange={(e) => setAchievementName(e.target.value)}
                placeholder="Ej: Explorador Maestro"
                maxLength={30}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  width: '100%',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, display: 'block' }}>
                Descripción
              </label>
              <textarea
                value={achievementDescription}
                onChange={(e) => setAchievementDescription(e.target.value)}
                placeholder="Descripción del logro"
                maxLength={100}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  width: '100%',
                  minHeight: 80,
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, display: 'block' }}>
                Puntos
              </label>
              <input
                type="number"
                value={achievementPoints.toString()}
                onChange={(e) => setAchievementPoints(Number(e.target.value))}
                placeholder="Puntos del logro"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  width: '100%',
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 16, fontWeight: 500, marginBottom: 8, display: 'block' }}>
                Ícono del logro
              </label>
              <input
                type="text"
                value={achievementIcon}
                onChange={(e) => setAchievementIcon(e.target.value)}
                placeholder="URL del icono"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 10,
                  width: '100%',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 8,
                  backgroundColor: '#f44336',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginRight: 8,
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={createAchievement}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  borderRadius: 8,
                  backgroundColor: '#2196F3',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: 8,
                  cursor: 'pointer',
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
      

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={
          alertActionText
            ? `${alertMessage}\n\nAcción: ${alertActionText}`
            : alertMessage
        }
        onClose={() => setAlertVisible(false)}
        onAction={alertOnAction}
      />
    </div>
  );
};

export default UserAchievementsScreen;
