import React from 'react';
import { View, Text, Image, ImageBackground } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '@components/UI/Button';
import {styles} from '@assets/styles/styles';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

// Definir el tipo para la navegación
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Map: undefined;
  ForgotPassword: undefined;
};

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  
  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };
  
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  fetch('http://localhost:5999/districts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    return response.text();  // Cambiar a `text()` para ver el contenido raw
  })
  .then(data => {
    console.log('Respuesta del servidor:', data);  // Ver el contenido de la respuesta
    try {
      const jsonData = JSON.parse(data);  // Intentar parsear JSON manualmente
      console.log('Datos JSON:', jsonData);
    } catch (e) {
      console.error('No es un JSON válido:', e);
    }
  })
  .catch(error => console.error('Error al obtener los distritos:', error));

  return (
    <ImageBackground
      source={require("../../assets/images/login_background.webp")} 
      style={styles.background_image}
      resizeMode="cover"
    >
      <View style={styles.semi_transparent_overlay} />
      {/* Main content */}
      <StyledView className="flex-1 justify-center items-center mx-5">
        <StyledText className="text-6xl font-bold text-gray-900 mb-2 text-center">
          Transforma{'\n'}tus <StyledText className="text-teal-500">viajes</StyledText>
        </StyledText>
        
        <StyledText className="text-gray-700 text-xl mb-8 text-center mt-4">
          Descubre una nueva forma de viajar con nuestra plataforma de 
          geolocalización gamificada. Registra tus aventuras, completa retos y 
          conecta con otros viajeros.
        </StyledText>
        
        <Button 
          style={{ marginBottom: 16 }}
          title="Comenzar gratis" 
          onPress={handleRegisterPress} 
          variant="primary"
          fullWidth
        />
        
        <Button 
          title="Iniciar sesión" 
          onPress={handleLoginPress}
          variant="secondary"
          fullWidth
        />
      </StyledView>
    </ImageBackground>
  );
};

export default WelcomeScreen; 