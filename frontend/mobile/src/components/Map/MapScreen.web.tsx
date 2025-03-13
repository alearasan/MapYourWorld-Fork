import React, { useEffect, useState, useRef } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { styled } from 'nativewind';
import { API_URL } from "@/constants/config";

// Agregar logs para depuración
console.log("Cargando MapScreen.web.tsx");
console.log("API_URL:", API_URL);

// Definición de tipos para los componentes de Leaflet
type LeafletComponent = any;
type LeafletLibrary = any;

// Variables para almacenar los componentes de Leaflet
let leafletLoaded = false;
let MapContainer: LeafletComponent = null;
let TileLayer: LeafletComponent = null;
let Polygon: LeafletComponent = null;
let Marker: LeafletComponent = null;
let L: LeafletLibrary = null;

// Componente de mapa real que se renderizará
const LeafletMap = ({ location, distritos }: any) => {
  console.log("Renderizando LeafletMap interno");
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Efecto para inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || !L) return;
    
    console.log("Inicializando mapa Leaflet manualmente");
    
    // Crear instancia del mapa
    const map = L.map(mapContainerRef.current).setView(location, 13);
    
    // Agregar capa de mosaicos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Añadir distritos al mapa
    distritos.forEach((distrito: any, index: number) => {
      console.log(`Renderizando distrito ${index}: ${distrito.nombre}`);
      const color = distrito.isUnlocked ? "rgb(0, 255, 0)" : "rgb(128, 128, 128)";
      
      L.polygon(distrito.coordenadas, {
        fillColor: color,
        color: color,
        fillOpacity: 0.4
      }).addTo(map);
    });
    
    // Guardar referencia al mapa
    mapInstanceRef.current = map;
    setMapReady(true);
    
    // Limpieza al desmontar
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location, distritos]);
  
  return (
    <div style={{height: "100vh", width: "100vw"}}>
      <div ref={mapContainerRef} style={{height: "100%", width: "100%"}} />
    </div>
  );
};

// Componente para versión web que usa react-leaflet
const MapScreen = () => {
  console.log("Renderizando MapScreen web");
  const [location, setLocation] = useState<[number,number]>([40.416775,-3.703790]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distritos, setDistritos] = useState<any[]>([]);
  const mapRef = useRef(null);
  const [leafletReady, setLeafletReady] = useState(false);
  
  // Cargar Leaflet solo una vez al inicio
  useEffect(() => {
    console.log("Cargando módulos de Leaflet...");
    
    // Función para cargar Leaflet de manera segura
    const loadLeaflet = async () => {
      // Solo cargamos Leaflet si estamos en un entorno web y aún no se ha cargado
      if (typeof window !== 'undefined' && typeof document !== 'undefined' && !leafletLoaded) {
        try {
          console.log("Intentando cargar módulos para web");
          
          // Primero cargamos Leaflet
          const leafletModule = await import('leaflet');
          L = leafletModule.default || leafletModule;
          
          // Importamos el CSS - El linter TypeScript puede quejarse, pero esto funciona en entorno web
          if (typeof document !== 'undefined') {
            // Creamos una etiqueta link en el head para cargar el CSS
            const linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            linkElement.crossOrigin = '';
            document.head.appendChild(linkElement);
            console.log("CSS de Leaflet cargado manualmente");
          }
          
          // Configurar los iconos de Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
          });
          
          // Guardar referencia global a L
          window.L = L;
          
          console.log("Leaflet configurado correctamente");
          leafletLoaded = true;
          setLeafletReady(true);
        } catch (error) {
          console.error("Error al cargar los módulos de Leaflet:", error);
          setError("No se pudo cargar el mapa. Error al cargar las dependencias.");
          setLoading(false);
        }
      } else if (!leafletLoaded) {
        console.log("No se puede cargar Leaflet en este entorno");
        setError("El mapa no puede cargarse en este entorno. Por favor, accede desde un navegador web compatible.");
        setLoading(false);
      } else {
        console.log("Leaflet ya está cargado");
        setLeafletReady(true);
      }
    };
    
    loadLeaflet();
  }, []);

  // Efectos para cargar datos y ubicación
  useEffect(() => {
    console.log("MapScreen.web useEffect");
    
    // Solo procedemos si Leaflet está cargado o tenemos un error
    if (leafletReady || error) {
      fetchDistritos();

      // En web usamos la API de geolocalización del navegador
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        console.log("Obteniendo geolocalización...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Posición obtenida:", position.coords);
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
            setLocation([40.416775, -3.703790]);
            setLoading(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        console.log("Geolocalización no disponible");
        setError("Tu navegador no soporta geolocalización.");
        // Ubicación por defecto
        setLocation([40.416775, -3.703790]);
        setLoading(false);
      }
    }
  }, [leafletReady, error]);

  // Función para transformar coordenadas desde GeoJSON al formato de react-native-maps
  const transformarCoordenadasGeoJSON = (geoJson: any): any => {
    try {
      if (!geoJson || !geoJson.coordinates || !Array.isArray(geoJson.coordinates)) {
        return [];
      }
      let coordenadas: any[] = [];
      const procesarCoordenadas = (coords: any[]): void => {
        if (coords.length === 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
          coordenadas.push([coords[1], coords[0]]);
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
      console.log("Obteniendo distritos...");
      setLoading(true);
      console.log("Fetching from:", `${API_URL}/api/districts`);
      const response = await fetch(`${API_URL}/api/districts`);
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Respuesta de distritos:", data.success, data.districts?.length);
      if (data.success && data.districts) {
        const distritosMapeados = data.districts
          .map((distrito: any) => {
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
              };
            } catch (error) {
              console.error(`Error procesando distrito ${distrito.name}:`, error);
              return null;
            }
          })
          .filter((d: any) => d !== null);
        console.log("Distritos mapeados:", distritosMapeados.length);
        setDistritos(distritosMapeados);
        setLoading(false);
      } else {
        console.error("No se pudieron cargar los distritos:", data);
        setError("No se pudieron cargar los distritos");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener los distritos:", error);
      setError(`Error al cargar los distritos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setLoading(false);
    }
  };

  // Renderizado condicional para mostrar pantalla de carga
  if (loading) {
    console.log("Renderizando pantalla de carga");
    return (
      <StyledView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        {error && <StyledText className="mt-4 text-red-500">{error}</StyledText>}
      </StyledView>
    );
  }

  // Renderizado condicional para mostrar error
  if (error) {
    console.log("Renderizando pantalla de error:", error);
    return (
      <StyledView className="flex-1 justify-center items-center p-4">
        <StyledText className="text-lg text-red-500 mb-4">
          {error}
        </StyledText>
        <StyledText className="text-base text-gray-700">
          API_URL: {API_URL}
        </StyledText>
      </StyledView>
    );
  }

  // Renderizado condicional si leaflet no está listo
  if (!leafletReady) {
    console.log("Esperando a que Leaflet esté listo");
    return (
      <StyledView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <StyledText className="mt-4">Cargando el mapa...</StyledText>
      </StyledView>
    );
  }

  // Renderización del mapa usando un enfoque más seguro
  console.log("Renderizando mapa con MapContainer");
  return <LeafletMap location={location} distritos={distritos} />;
};

const StyledView = styled(View);
const StyledText = styled(Text);

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