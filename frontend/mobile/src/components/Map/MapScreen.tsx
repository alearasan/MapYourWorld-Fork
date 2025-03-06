import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import * as Location from "expo-location";

// Definir el tipo para los distritos
interface Distrito {
  nombre: string;
  coordenadas: { latitude: number; longitude: number }[];
}

// Definir el tipo para los distritos desde el backend
interface DistritoBackend {
  id: string;
  name: string;
  description: string;
  boundaries: any; // Usamos any para evitar problemas de tipado con GeoJSON
  isUnlocked: boolean;
}

interface MapScreenProps {
  distritos?: Distrito[]; // Lista de distritos opcional
}

const MapScreen: React.FC<MapScreenProps> = ({ distritos = [] }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distritosBackend, setDistritosBackend] = useState<Distrito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para verificar si el punto está dentro del polígono
  const isPointInPolygon = (point: { latitude: number; longitude: number }, polygon: { latitude: number; longitude: number }[]) => {
    let inside = false;
    const { latitude, longitude } = point;
    const len = polygon.length;
    let j = len - 1;

    for (let i = 0; i < len; i++) {
      const vertex1 = polygon[i];
      const vertex2 = polygon[j];
      if (
        (vertex1.longitude > longitude) !== (vertex2.longitude > longitude) &&
        latitude <
          ((vertex2.latitude - vertex1.latitude) * (longitude - vertex1.longitude)) /
            (vertex2.longitude - vertex1.longitude) +
            vertex1.latitude
      ) {
        inside = !inside;
      }
      j = i;
    }
    return inside;
  };

  // Función para convertir las coordenadas de GeoJSON al formato para react-native-maps
  const transformarCoordenadasGeoJSON = (geoJson: any): { latitude: number; longitude: number }[] => {
    try {
      if (!geoJson || !geoJson.coordinates || !Array.isArray(geoJson.coordinates)) {
        return [];
      }
      
      let coordenadas: { latitude: number; longitude: number }[] = [];
      
      // Función recursiva para procesar coordenadas a cualquier nivel de anidación
      const procesarCoordenadas = (coords: any[]): void => {
        if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
          // Es un punto [longitud, latitud]
          coordenadas.push({
            latitude: coords[1],
            longitude: coords[0]
          });
        } else if (Array.isArray(coords)) {
          // Es un array de puntos o un array de arrays
          coords.forEach(item => {
            if (Array.isArray(item)) {
              procesarCoordenadas(item);
            }
          });
        }
      };
      
      // Comenzar el procesamiento
      procesarCoordenadas(geoJson.coordinates);
      
      return coordenadas;
    } catch (error) {
      console.error("Error transformando coordenadas:", error);
      return [];
    }
  };

  // Función para obtener los distritos desde el backend
  const fetchDistritos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.80:5999/districts');
      const data = await response.json();
      
      if (data.success && data.districts) {
        // Transformar los datos del backend al formato que necesita el mapa
        const distritosMapeados = data.districts
          .map((distrito: DistritoBackend) => {
            try {
              const coordenadasTransformadas = transformarCoordenadasGeoJSON(distrito.boundaries);
              
              // Solo considerar polígonos con suficientes puntos
              if (coordenadasTransformadas.length < 3) {
                console.warn(`Distrito ${distrito.name} no tiene suficientes coordenadas válidas`);
                return null;
              }
              
              return {
                nombre: distrito.name,
                coordenadas: coordenadasTransformadas
              };
            } catch (error) {
              console.error(`Error procesando distrito ${distrito.name}:`, error);
              return null;
            }
          })
          .filter((d: Distrito | null): d is Distrito => d !== null);
        
        setDistritosBackend(distritosMapeados);
      } else {
        Alert.alert("Error", "No se pudieron cargar los distritos");
      }
    } catch (error) {
      console.error("Error al obtener los distritos:", error);
      Alert.alert("Error", "Ocurrió un error al cargar los distritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar los distritos desde el backend cuando se monte el componente
    fetchDistritos();
    
    let locationSubscription: Location.LocationSubscription | null = null;
    
    // Configurar la ubicación
    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Necesitamos acceso a tu ubicación para mostrar el mapa.");
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          });
        }
      );
    };

    startWatchingLocation();

    return () => {
      // Limpiar la suscripción al desmontar el componente
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.3754,  // Coordenadas aproximadas de Sevilla
            longitude: -5.9903,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          showsUserLocation={true}
        >
          {/* Renderizar los polígonos de los distritos */}
          {distritosBackend.map((distrito, index) => {
            const isInside = location ? isPointInPolygon(location, distrito.coordenadas) : false;
            
            return (
              <Polygon
                key={index}
                coordinates={distrito.coordenadas}
                strokeColor={isInside ? "#00FF00" : "#808080"}
                fillColor={isInside ? "rgba(10, 255, 10, 0.81)" : "rgba(128, 128, 128, 0.3)"}
                strokeWidth={2}
              />
            );
          })}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
