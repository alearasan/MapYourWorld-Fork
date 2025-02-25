/**
 * Componente de MapView
 * Muestra un mapa interactivo con distritos y puntos de interés
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styled } from 'nativewind';

// Aplicamos styled a los componentes nativos para poder usar Tailwind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Importaciones de servicios, hooks y types se agregarán posteriormente
// TODO: Importar tipos y servicios necesarios

interface DistrictMapProps {
  initialRegion?: Region;
  showUserLocation?: boolean;
  onDistrictPress?: (districtId: string) => void;
  onPoiPress?: (poiId: string) => void;
}

export const DistrictMap: React.FC<DistrictMapProps> = ({
  initialRegion,
  showUserLocation = true,
  onDistrictPress,
  onPoiPress,
}) => {
  const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();
  
  const [region, setRegion] = useState<Region>(
    initialRegion || {
      latitude: 37.389091, // Sevilla por defecto
      longitude: -5.984459,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }
  );
  
  const [districts, setDistricts] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga los distritos iniciales
   */
  useEffect(() => {
    const loadDistricts = async () => {
      // TODO: Implementar carga de distritos
      // 1. Mostrar indicador de carga
      // 2. Obtener distritos desde el servicio del mapa
      // 3. Actualizar el estado con los distritos
      // 4. Manejar errores
      setLoading(true);
      try {
        // Llamada al servicio pendiente de implementar
        setDistricts([]);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar distritos');
        setLoading(false);
      }
    };
    
    loadDistricts();
  }, []);

  /**
   * Carga los puntos de interés cuando se selecciona un distrito
   */
  useEffect(() => {
    if (!selectedDistrict) return;
    
    const loadPois = async () => {
      // TODO: Implementar carga de POIs
      // 1. Mostrar indicador de carga
      // 2. Obtener POIs desde el servicio del mapa
      // 3. Actualizar el estado con los POIs
      // 4. Manejar errores
      setLoading(true);
      try {
        // Llamada al servicio pendiente de implementar
        setPois([]);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar puntos de interés');
        setLoading(false);
      }
    };
    
    loadPois();
  }, [selectedDistrict]);

  /**
   * Maneja el cambio de región del mapa
   */
  const handleRegionChange = (newRegion: Region) => {
    // TODO: Implementar manejo de cambio de región
    // 1. Actualizar estado de región
    // 2. Considerar cargar nuevos distritos si es necesario
    setRegion(newRegion);
  };

  /**
   * Maneja la selección de un distrito
   */
  const handleDistrictPress = (districtId: string) => {
    // TODO: Implementar manejo de selección de distrito
    // 1. Actualizar distrito seleccionado
    // 2. Notificar al componente padre
    // 3. Considerar centrar mapa en el distrito
    setSelectedDistrict(districtId);
    if (onDistrictPress) {
      onDistrictPress(districtId);
    }
  };

  /**
   * Maneja la selección de un punto de interés
   */
  const handlePoiPress = (poiId: string) => {
    // TODO: Implementar manejo de selección de POI
    // 1. Notificar al componente padre
    // 2. Considerar mostrar información del POI
    if (onPoiPress) {
      onPoiPress(poiId);
    }
  };

  /**
   * Centra el mapa en la ubicación del usuario
   */
  const centerOnUserLocation = async () => {
    // TODO: Implementar centrado en ubicación del usuario
    // 1. Obtener ubicación actual
    // 2. Animar mapa a la ubicación
    // 3. Manejar errores de permisos
  };

  return (
    <StyledView className="flex-1 relative">
      {loading && (
        <StyledView className="absolute inset-0 bg-white/70 justify-center items-center z-10">
          <ActivityIndicator size="large" color="#3B82F6" />
        </StyledView>
      )}
      
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        showsCompass={true}
        onRegionChangeComplete={handleRegionChange}
      >
        {/* Renderizado de distritos como polígonos */}
        {districts.map((district) => (
          // TODO: Implementar renderizado de distritos
          <Polygon
            key={district.id}
            coordinates={[]} // Coordenadas del distrito
            fillColor={
              selectedDistrict === district.id
                ? 'rgba(59, 130, 246, 0.3)' // Azul con transparencia (primary)
                : 'rgba(59, 130, 246, 0.1)'
            }
            strokeColor="rgba(59, 130, 246, 0.8)"
            strokeWidth={2}
            onPress={() => handleDistrictPress(district.id)}
          />
        ))}
        
        {/* Renderizado de POIs como marcadores */}
        {pois.map((poi) => (
          // TODO: Implementar renderizado de POIs
          <Marker
            key={poi.id}
            coordinate={{
              latitude: poi.location.latitude,
              longitude: poi.location.longitude,
            }}
            title={poi.name}
            description={poi.description}
            onPress={() => handlePoiPress(poi.id)}
          />
        ))}
      </MapView>
      
      {/* Botón para centrar en ubicación del usuario */}
      <StyledTouchableOpacity
        className="absolute bottom-4 right-4 bg-white rounded-full w-14 h-14 justify-center items-center shadow-md"
        onPress={centerOnUserLocation}
      >
        <Icon name="my-location" size={24} color="#3B82F6" />
      </StyledTouchableOpacity>
      
      {error && (
        <StyledView className="absolute top-4 left-4 right-4 bg-red-500/70 p-2 rounded">
          <StyledText className="text-white text-center">{error}</StyledText>
        </StyledView>
      )}
    </StyledView>
  );
}; 