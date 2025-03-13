import React from 'react';
import { View, Text, Image } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../UI/Button';

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
  
  return (
    <StyledView className="flex-1 bg-gray-100 p-6">
      {/* Header */}
      <StyledView className="flex-row items-center mt-6">
        <StyledView className="w-10 h-10 bg-teal-500 rounded-md"></StyledView>
        <StyledText className="text-xl font-bold ml-2 text-gray-800">MapYourWorld</StyledText>
      </StyledView>
      
      {/* Main content */}
      <StyledView className="flex-1 justify-center items-start">
        <StyledView className="bg-white p-6 rounded-lg w-full shadow-md">
          <StyledText className="text-4xl font-bold text-gray-900 mb-2">
            Transforma{'\n'}tus <StyledText className="text-teal-500">viajes</StyledText>
          </StyledText>
          
          <StyledText className="text-gray-700 mb-8">
            Descubre una nueva forma de viajar con nuestra plataforma de 
            geolocalización gamificada. Registra tus aventuras, completa retos y 
            conecta con otros viajeros.
          </StyledText>
          
          <Button 
            title="Comenzar gratis" 
            onPress={handleRegisterPress} 
            variant="primary"
            fullWidth
            className="mb-3"
          />
          
          <Button 
            title="Iniciar sesión" 
            onPress={handleLoginPress}
            variant="secondary"
            fullWidth
          />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default WelcomeScreen; 