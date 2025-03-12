import React, { useEffect, useState } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { styled } from 'nativewind';
import { API_URL } from "@/constants/config";

import { MapContainer, Marker, TileLayer, Polygon } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css";


const StyledView = styled(View);
const StyledText = styled(Text);

// Tipos para distritos y POIs
interface DistritoBackend {
  id: string;
  name: string;
  description: string;
  boundaries: any;
  isUnlocked: boolean;
}

interface DistritoLeaflet {
  id: string;
  nombre: string;
  coordenadas: LatLngExpression[];
  isUnlocked: boolean;
}

interface POI {
  id?: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
}

// Componente para versión web que usa un mapa simple basado en iframe para evitar conflictos
const MapScreen = () => {
  const [location, setLocation] = useState<[number,number]>([40.416775,-3.703790]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distritosS, setDistritos] = useState<DistritoLeaflet[]>([])
  let distritos : DistritoLeaflet[] = []
  let unlocked : any = []
  let locked : any = []
  //let unlocked : [LatLngExpression[]][] = []
  //let locked : [LatLngExpression[]][] = []

  useEffect(() => {
    fetchDistritos();

    // En web usamos la API de geolocalización del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
          setLoading(false);
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setError("No se pudo acceder a tu ubicación. Mostrando una ubicación predeterminada.");
          // Ubicación por defecto (Madrid)
          setLocation([
            40.416775,
            -3.703790
          ]);
          setLoading(false);
        }
      );

      // Seguimiento en tiempo real
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
        },
        () => {
          // Ignoramos errores en el seguimiento
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError("Tu navegador no soporta geolocalización.");
      // Ubicación por defecto
      setLocation([
        40.416775,
        -3.703790
      ]);
      setLoading(false);
    }

  }, []);

  // Función para transformar coordenadas desde GeoJSON al formato de react-native-maps
  const transformarCoordenadasGeoJSON = (geoJson: any): LatLngExpression[] => {
    try {
      if (!geoJson || !geoJson.coordinates || !Array.isArray(geoJson.coordinates)) {
        return [];
      }
      let coordenadas : LatLngExpression[] = [];
      const procesarCoordenadas = (coords: any[]): void => {
        if (coords.length === 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
          coordenadas.push(L.latLng(
             coords[1],
             coords[0]
          ));
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

  // Función para obtener los distritos desde el backend
  const fetchDistritos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/districts`);
        const data = await response.json();
        if (data.success && data.districts) {
          const distritosMapeados = data.districts
            .map((distrito: DistritoBackend) => {
              try {
                const coordenadasTransformadas : LatLngExpression[] = transformarCoordenadasGeoJSON(distrito.boundaries);
                if (coordenadasTransformadas.length < 3) {
                  console.warn(`Distrito ${distrito.name} no tiene suficientes coordenadas válidas`);
                  return null;
                }

                const d : DistritoLeaflet =  {
                  id: distrito.id,
                  nombre: distrito.name,
                  coordenadas: coordenadasTransformadas,
                  isUnlocked: distrito.isUnlocked,
                }
                distritos.push(d)
                if (distrito.isUnlocked) {
                  console.log('unlocked')
                  unlocked.push(coordenadasTransformadas)
                } else {
                  console.log('locked')
                  locked.push(coordenadasTransformadas)
                }
                return d;
              } catch (error) {
                console.error(`Error procesando distrito ${distrito.name}:`, error);
                return null;
              }
            })
            .filter((d: DistritoLeaflet | null): d is DistritoLeaflet => d !== null);
          setDistritos(distritosMapeados);
        } else {
          Alert.alert("Error", "No se pudieron cargar los distritos");
        }
      } catch (error) {
        console.error("Error al obtener los distritos:", error);
        Alert.alert("Error", "Ocurrió un error al cargar los distritos");
      } finally {
        //console.log('Distritos por push', distritos)
        //console.log('Distritos por setDistritos', distritosS)
        setLoading(false);
      }
    };

    
  const polygon = [
    L.latLng(37.373062783,-5.948116354),
    L.latLng(37.373062783,-5.948116354),
    L.latLng(37.373062783,-5.948116354),
    L.latLng(37.373062783,-5.9314327),
    L.latLng(37.380230444,-5.9314327),
    L.latLng(37.380230444,-5.948116354),
    L.latLng(37.373062783,-5.948116354)
  ]
  console.log('ej',polygon)
  console.log('unlocked', unlocked)
  console.log('locked',locked)

  return (
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <MapContainer center={location} 
                          zoom={13} ref={null} 
                          style={{height: "100vh", width: "100vw"}}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {distritos.map((distrito, index) => {
                      return (
                        <Polygon
                          key={distrito.id}
                          positions={distrito.coordenadas}
                          fillColor={distrito.isUnlocked ? "rgb(0, 255, 0)" : "rgb(128, 128, 128)"}
                        />)
                })}
                <Polygon positions={unlocked} fillColor={"rgb(0, 255, 0)"} />
                <Polygon positions={locked} fillColor={"rgb(128, 128, 128)"} />
                <Polygon positions={polygon} fillColor={"blue"} />
            </MapContainer>
          </>
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
  logroContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  logroEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  logroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  logroSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  logroDistrito: {
    fontSize: 16,
    color: 'yellow',
    fontWeight: 'bold',
  },
});

export default MapScreen; 