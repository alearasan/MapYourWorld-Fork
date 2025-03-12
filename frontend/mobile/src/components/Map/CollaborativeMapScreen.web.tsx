import React, { useEffect, useState } from "react";
import { Alert, ActivityIndicator } from "react-native";

import { API_URL } from "@/constants/config";

import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Interfaces de distritos y POIs
interface DistritoBackend {
  id: string;
  name: string;
  description: string;
  boundaries: any;
  isUnlocked: boolean;
  user?: { id: string };
}

interface Distrito {
  id: string;
  nombre: string;

  coordenadas: { latitude: number; longitude: number }[];
  isUnlocked: boolean;
  unlockedByUserId?: string;
  colorIndex?: number;
}

interface POI {
  id?: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
  };
}

// Componente adaptado para web (usando react-leaflet)
const CollaborativeMapScreenWeb: React.FC<{ mapId: string; userId: string }> = ({ mapId, userId }) => {

  const [location, setLocation] = useState<[number, number]>([40.416775, -3.70379]); // Madrid por defecto
  const [loading, setLoading] = useState<boolean>(true);
  const [distritos, setDistritos] = useState<Distrito[]>([]);

  // Función para transformar coordenadas desde GeoJSON al formato { latitude, longitude }
  const transformarCoordenadasGeoJSON = (geoJson: any): { latitude: number; longitude: number }[] => {
    try {
      if (!geoJson || !geoJson.coordinates || !Array.isArray(geoJson.coordinates)) {
        return [];
      }
      let coordenadas: { latitude: number; longitude: number }[] = [];
      const procesarCoordenadas = (coords: any[]): void => {
        if (coords.length === 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
          coordenadas.push({
            latitude: coords[1],
            longitude: coords[0],
          });
        } else if (Array.isArray(coords)) {
          coords.forEach((item) => {
            if (Array.isArray(item)) {
              procesarCoordenadas(item);
            }
          });
        }
      };
      procesarCoordenadas(geoJson.coordinates);
      return coordenadas;
    } catch (error) {
      console.error("Error transformando coordenadas:", error);
      return [];
    }
  };

  // Función para convertir un arreglo de { latitude, longitude } en arrays [lat, lng] para leaflet
  const convertirCoordenadas = (coords: { latitude: number; longitude: number }[]) =>
    coords.map((coord) => [coord.latitude, coord.longitude] as [number, number]);

  // Función para obtener los distritos desde el backend para el mapa colaborativo
  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/districts/map/${mapId}`);
      const data = await response.json();
      if (data.success && data.districts && data.districts.length > 0) {
        const distritosMapeados = data.districts
          .map((distrito: DistritoBackend) => {
            try {
              const coordenadasTransformadas = transformarCoordenadasGeoJSON(distrito.boundaries);
              if (coordenadasTransformadas.length < 3) {
                console.warn(`Distrito ${distrito.name} no tiene suficientes coordenadas válidas`);
                return null;
              }
              return {
                id: distrito.id,
                nombre: distrito.name,
                coordenadas: coordenadasTransformadas,
                isUnlocked: distrito.isUnlocked,
                unlockedByUserId: distrito.user?.id,
                colorIndex: undefined,
              } as Distrito;
            } catch (error) {
              console.error(`Error procesando distrito ${distrito.name}:`, error);
              return null;
            }
          })
          .filter((d: Distrito | null): d is Distrito => d !== null);
        setDistritos(distritosMapeados);
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

  // Obtener la ubicación usando la API de geolocalización del navegador
  useEffect(() => {
    fetchDistricts();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setLocation([40.416775, -3.70379]);
          setLoading(false);
        }
      );
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {},
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      Alert.alert("Error", "Tu navegador no soporta geolocalización.");
      setLocation([40.416775, -3.70379]);
      setLoading(false);
    }
  }, [mapId]);

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </div>
      ) : (
        <MapContainer center={location} zoom={13} style={{ height: "100vh", width: "100vw" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {distritos.map((distrito) => {
            const posiciones: LatLngExpression[] = convertirCoordenadas(distrito.coordenadas);
            return (
              <Polygon
                key={distrito.id}
                positions={posiciones}
                pathOptions={{
                  fillColor: distrito.isUnlocked ? "rgb(0, 255, 0)" : "rgb(128, 128, 128)",
                  color: "#808080",
                  weight: 2,
                }}
              />
            );
          })}
        </MapContainer>
      )}
    </div>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default CollaborativeMapScreenWeb;
