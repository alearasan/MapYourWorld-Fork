import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

// Componente para versión web que usa un mapa simple basado en iframe para evitar conflictos
const MapScreen = () => {
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // En web usamos la API de geolocalización del navegador
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setError("No se pudo acceder a tu ubicación. Mostrando una ubicación predeterminada.");
          // Ubicación por defecto (Madrid)
          setLocation({
            latitude: 40.416775,
            longitude: -3.703790
          });
          setLoading(false);
        }
      );

      // Seguimiento en tiempo real
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
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
      setLocation({
        latitude: 40.416775,
        longitude: -3.703790
      });
      setLoading(false);
    }
  }, []);

  const getMapUrl = () => {
    if (!location) return '';
    // Usamos OpenStreetMap para mostrar el mapa
    return `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01}%2C${location.latitude - 0.01}%2C${location.longitude + 0.01}%2C${location.latitude + 0.01}&amp;layer=mapnik&amp;marker=${location.latitude}%2C${location.longitude}`;
  };

  // Los estilos para iframe deben aplicarse como atributos en la etiqueta
  const iframeStyle = {
    border: 0,
    width: '100%',
    height: '100%'
  };

  return (
    <StyledView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : location ? (
        <>
          {error && (
            <StyledView style={styles.errorContainer}>
              <StyledText style={styles.errorText}>{error}</StyledText>
            </StyledView>
          )}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={getMapUrl()}
              style={iframeStyle}
              title="Mapa"
              data-testid="map-iframe"
            ></iframe>
          </div>
          <StyledView style={styles.attribution}>
            <StyledText style={styles.attributionText}>
              © OpenStreetMap contributors
            </StyledText>
          </StyledView>
        </>
      ) : (
        <StyledView style={styles.errorContainer}>
          <StyledText style={styles.errorText}>No se pudo cargar el mapa</StyledText>
        </StyledView>
      )}
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000
  },
  errorText: {
    color: 'white',
    textAlign: 'center'
  },
  attribution: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 3,
    borderRadius: 3,
    zIndex: 1000
  },
  attributionText: {
    fontSize: 10,
    color: '#333'
  }
});

export default MapScreen; 