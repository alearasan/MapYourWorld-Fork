import React, { useEffect, useState, useRef } from "react";
import { Alert, ActivityIndicator, View, Text } from "react-native";
import { styled } from 'nativewind';
import { API_URL } from "@/constants/config";
import PuntoDeInteresForm from "../../components/POI/PoiForm";

// Agregar logs para depuración
console.log("Cargando CollaborativeMapScreen.web.tsx");
console.log("API_URL:", API_URL);

// Componente de Modal para alertas personalizado
const AlertModal = ({ visible, title, message, onClose }: { visible: boolean, title: string, message: string, onClose: () => void }) => {
  if (!visible) return null;
  
  // Determinar si es un error o información para usar el color apropiado
  const isError = title.toLowerCase().includes('error') || title.toLowerCase().includes('no válid') || title.toLowerCase().includes('bloqueado');
  const buttonColor = isError ? '#f44336' : (title.toLowerCase().includes('éxito') ? '#4CAF50' : '#2196F3');
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001 // Mayor que el formulario POI
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        style={{ 
          backgroundColor: 'white',
          borderRadius: '12px', 
          padding: '20px',
          maxWidth: '90%',
          width: '350px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '15px' }}>
          {isError ? (
            <span style={{ fontSize: '32px', color: '#f44336' }}>⚠️</span>
          ) : title.toLowerCase().includes('éxito') ? (
            <span style={{ fontSize: '32px', color: '#4CAF50' }}>✅</span>
          ) : (
            <span style={{ fontSize: '32px', color: '#2196F3' }}>ℹ️</span>
          )}
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#2d3748'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#4a5568',
          marginBottom: '20px'
        }}>
          {message}
        </p>
        <button 
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: buttonColor,
            color: 'white',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

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

const StyledView = styled(View);
const StyledText = styled(Text);

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

// Componente de mapa real que se renderizará
const LeafletMap = ({ location, distritos }: any) => {
  console.log("Renderizando LeafletMap colaborativo interno");
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Función para convertir un arreglo de { latitude, longitude } en arrays [lat, lng] para leaflet
  const convertirCoordenadas = (coords: { latitude: number; longitude: number }[]) =>
    coords.map((coord) => [coord.latitude, coord.longitude] as [number, number]);
  
  // Efecto para inicializar el mapa
  useEffect(() => {
    if (!mapContainerRef.current || !L) return;
    
    console.log("Inicializando mapa Leaflet colaborativo manualmente");
    
    // Crear instancia del mapa
    const map = L.map(mapContainerRef.current).setView(location, 13);
    
    // Agregar capa de mosaicos
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Añadir distritos al mapa
    distritos.forEach((distrito: Distrito) => {
      console.log(`Renderizando distrito colaborativo: ${distrito.nombre}`);
      const posiciones = convertirCoordenadas(distrito.coordenadas);
      const color = distrito.isUnlocked ? "rgb(0, 255, 0)" : "rgb(128, 128, 128)";
      
      L.polygon(posiciones, {
        fillColor: color,
        color: "#808080",
        weight: 2,
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
    <div style={{ height: "100vh", width: "100vw" }}>
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

// El componente principal
const CollaborativeMapScreenWeb = ({ mapId, userId }: { mapId: string; userId: string }) => {
  console.log("Renderizando CollaborativeMapScreenWeb con mapId:", mapId, "userId:", userId);
  
  const [location, setLocation] = useState<[number, number]>([40.416775, -3.70379]); // Madrid por defecto
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [pointsOfInterest, setPointsOfInterest] = useState<POI[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [pointOfInterest, setPointOfInterest] = useState<any>({
    name: "",
    description: "",
    category: "",
    photos: [],
    latitude: 0,
    longitude: 0,
    district: "",
  });
  const [alertModal, setAlertModal] = useState({ visible: false, title: '', message: '' });
  const mapRef = useRef(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [leafletReady, setLeafletReady] = useState(false);

  // Cargar Leaflet solo una vez al inicio
  useEffect(() => {
    console.log("Cargando módulos de Leaflet para mapa colaborativo...");
    
    // Función para cargar Leaflet de manera segura
    const loadLeaflet = async () => {
      // Solo cargamos Leaflet si estamos en un entorno web y aún no se ha cargado
      if (typeof window !== 'undefined' && typeof document !== 'undefined' && !leafletLoaded) {
        try {
          console.log("Intentando cargar módulos para web en CollaborativeMapScreen");
          
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
          
          console.log("Leaflet configurado correctamente para el mapa colaborativo");
          leafletLoaded = true;
          setLeafletReady(true);
        } catch (error) {
          console.error("Error al cargar los módulos de Leaflet para el mapa colaborativo:", error);
          setError("No se pudo cargar el mapa colaborativo. Error al cargar las dependencias.");
          setLoading(false);
        }
      } else if (!leafletLoaded) {
        console.log("No se puede cargar Leaflet en este entorno para el mapa colaborativo");
        setError("El mapa colaborativo no puede cargarse en este entorno. Por favor, accede desde un navegador web compatible.");
        setLoading(false);
      } else {
        console.log("Leaflet ya está cargado para el mapa colaborativo");
        setLeafletReady(true);
      }
    };
    
    loadLeaflet();
  }, []);

  // Efectos para cargar datos y ubicación
  useEffect(() => {
    console.log("CollaborativeMapScreen.web useEffect");
    
    // Solo procedemos si Leaflet está cargado o tenemos un error
    if (leafletReady || error) {
      // Cargar distritos del mapa colaborativo
      fetchDistricts();
      
      // Intentar obtener ubicación actual del usuario
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        console.log("Obteniendo geolocalización para el mapa colaborativo...");
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("Posición obtenida:", position.coords);
            setLocation([position.coords.latitude, position.coords.longitude]);
            setLoading(false);
          },
          (err) => {
            console.error("Error al obtener la ubicación:", err);
            setError("No se pudo acceder a tu ubicación. Mostrando una ubicación predeterminada.");
            setLocation([40.416775, -3.70379]); // Madrid por defecto si falla
            setLoading(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        console.log("Geolocalización no disponible para el mapa colaborativo");
        setError("Tu navegador no soporta geolocalización.");
        setLocation([40.416775, -3.70379]);
        setLoading(false);
      }
    }
  }, [leafletReady, error, mapId]);

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

  // Función para obtener los distritos desde el backend para el mapa colaborativo
  const fetchDistricts = async () => {
    try {
      console.log("Obteniendo distritos para el mapa colaborativo...");
      setLoading(true);
      console.log(`Fetching from: ${API_URL}/api/districts/map/${mapId}`);
      const response = await fetch(`${API_URL}/api/districts/map/${mapId}`);
      
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Respuesta de distritos colaborativos:", data.success, data.districts?.length);
      
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
          
        console.log("Distritos colaborativos mapeados:", distritosMapeados.length);
        setDistritos(distritosMapeados);
        setLoading(false);
      } else {
        console.error("No se pudieron cargar los distritos colaborativos:", data);
        setError("No se pudieron cargar los distritos del mapa colaborativo");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener los distritos colaborativos:", error);
      setError(`Error al cargar los distritos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setLoading(false);
    }
  };

  // Función para mostrar alertas con el modal
  const showAlert = (title: string, message: string) => {
    setAlertModal({
      visible: true,
      title,
      message
    });
  };
  
  // Función para cerrar el modal de alerta
  const closeAlertModal = () => {
    setAlertModal({
      ...alertModal,
      visible: false
    });
  };

  // Función para verificar si un punto está dentro de un polígono (para validar distritos)
  const isPointInPolygon = (
    point: { lat: number; lng: number },
    polygon: any[]
  ): boolean => {
    // Implementación del algoritmo de Ray Casting para determinar si un punto está dentro de un polígono
    let inside = false;
    const { lat, lng } = point;
    
    // Convertimos el polígono a formato [lat, lng] si viene en otro formato
    const polyPoints = polygon.map(p => {
      if ('latitude' in p && 'longitude' in p) {
        return [p.latitude, p.longitude];
      }
      return p;
    });
    
    if (polyPoints.length < 3) return false;
    
    let j = polyPoints.length - 1;
    for (let i = 0; i < polyPoints.length; i++) {
      const xi = polyPoints[i][0];
      const yi = polyPoints[i][1];
      const xj = polyPoints[j][0];
      const yj = polyPoints[j][1];
      
      const intersect = ((yi > lat) !== (yj > lat)) &&
          (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
      j = i;
    }
    
    return inside;
  };

  // Manejador cuando se hace clic en el mapa
  const handleMapClick = (coordinate: { latitude: number; longitude: number }) => {
    console.log("Clic en el mapa colaborativo:", coordinate);
    
    // Verificar si el punto está dentro de algún distrito
    let poiDistrict = null;
    for (const distrito of distritos) {
      if (isPointInPolygon(
        { lat: coordinate.latitude, lng: coordinate.longitude },
        distrito.coordenadas
      )) {
        poiDistrict = distrito;
        break;
      }
    }
    
    // Verificar si el distrito existe y está desbloqueado
    if (!poiDistrict) {
      // No está en ningún distrito
      showAlert('Ubicación no válida', 'No puedes crear un punto de interés fuera de un distrito.');
      return;
    }
    
    if (!poiDistrict.isUnlocked) {
      // Está en un distrito bloqueado
      showAlert('Distrito bloqueado', `El distrito "${poiDistrict.nombre}" está bloqueado. Desbloquéalo primero para añadir puntos de interés.`);
      return;
    }
    
    // Si llegamos aquí, el distrito está desbloqueado
    setPointOfInterest({
      ...pointOfInterest,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      district: poiDistrict,
    });
    
    setShowForm(true);
  };

  return (
    <>
      {/* Modal de alertas */}
      <AlertModal 
        visible={alertModal.visible}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlertModal}
      />
      
      {/* Modal para crear POI */}
      {showForm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            // Cerrar modal al hacer clic fuera del formulario
            if (e.target === e.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div 
            style={{ 
              backgroundColor: 'white',
              borderRadius: '12px', 
              padding: '20px',
              maxWidth: '90%',
              width: '380px',
              maxHeight: '90vh', 
              overflow: 'auto',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Estilo personalizado para el formulario web */}
            <style dangerouslySetInnerHTML={{ __html: `
              .form-container input, .form-container textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 16px;
                margin-bottom: 10px;
              }
              
              .form-container .dropdown {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 16px;
                background-color: white;
                cursor: pointer;
                margin-bottom: 10px;
              }
              
              .form-container .section-title {
                font-size: 18px;
                font-weight: 500;
                margin-bottom: 8px;
              }
              
              .form-container .add-photo-btn {
                width: 64px;
                height: 64px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
              
              .form-container .btn-primary {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                background-color: #2563eb;
                color: white;
                font-weight: 600;
                text-align: center;
                margin-bottom: 10px;
                cursor: pointer;
                border: none;
              }
              
              .form-container .btn-danger {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                background-color: #dc2626;
                color: white;
                font-weight: 600;
                text-align: center;
                cursor: pointer;
                border: none;
              }
            ` }} />

            <h1 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              Registrar Punto de Interés
            </h1>

            <div className="form-container">
              <PuntoDeInteresForm
                pointOfInterest={pointOfInterest}
                setPointOfInterest={setPointOfInterest}
                setShowForm={setShowForm}
                onSave={(newPOI: any) => {
                  // Convertir el POI recién creado al formato esperado
                  const poiConverted = {
                    ...newPOI,
                    location: {
                      type: "Point",
                      coordinates: [newPOI.longitude, newPOI.latitude],
                    },
                  };
                  setPointsOfInterest((prev) => [...prev, poiConverted]);
                }}
                showAlert={showAlert}
              />
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          {error && <StyledText className="mt-4 text-red-500">{error}</StyledText>}
          {!error && <StyledText className="mt-4">Cargando mapa colaborativo...</StyledText>}
        </StyledView>
      ) : error ? (
        <StyledView className="flex-1 justify-center items-center p-4">
          <StyledText className="text-lg text-red-500 mb-4">{error}</StyledText>
        </StyledView>
      ) : !leafletReady ? (
        <StyledView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <StyledText className="mt-4">Inicializando mapa colaborativo...</StyledText>
        </StyledView>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default CollaborativeMapScreenWeb;
