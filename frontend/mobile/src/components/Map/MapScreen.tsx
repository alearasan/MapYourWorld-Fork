import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import MapView, { Polygon } from "react-native-maps";
import * as Location from "expo-location";

// Definir el tipo para los distritos
interface Distrito {
  nombre: string;
  coordenadas: { latitude: number; longitude: number }[];
}

interface MapScreenProps {
  distritos?: Distrito[]; // Lista de distritos opcional
}

const MapScreen: React.FC<MapScreenProps> = ({ distritos = [] }) => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

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
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          mapType="hybrid"
        >
          {/* Renderizar los polígonos de los distritos */}
          {distritos.map((distrito, index) => {
            // Verificar si la ubicación está dentro del polígono
            const isInside = isPointInPolygon(location, distrito.coordenadas);

            return (
              <Polygon
                key={index}
                coordinates={distrito.coordenadas}
                strokeColor="rgba(0,0,0,0.8)" // Borde gris semitransparente
                fillColor={isInside ? "rgba(0,255,0,0.4)" : "rgba(22, 21, 21, 0.4)"} // Verde si dentro, Gris si fuera
                strokeWidth={2}
              />
            );
          })}
        </MapView>
      ) : (
        <ActivityIndicator size="large" color="blue" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
});

export default MapScreen;
