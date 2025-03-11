import React from 'react';
import { View, Text, Image, ImageBackground, Platform } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '@components/UI/Button';
import {styles} from '@assets/styles/styles';

// importamos los estilos web sólo si estamos en web
const web = Platform.OS === 'web'
if (web) {
  require('../../assets/styles/web.css');
}

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
    <ImageBackground
      source={require("../../assets/images/login_background.webp")} 
      style={styles.background_image}
      resizeMode="cover"
      className='image-background'
    >
      <View style={styles.semi_transparent_overlay} className=''/>
      {/* Main content */}
      <StyledView className={"flex-1 justify-center items-center mx-5 base-container"}>
        <StyledText className="text-6xl font-bold text-gray-900 mb-2 text-center title">
          Transforma{web ? ' ' : '\n'}tus <StyledText className="text-teal-500 title teal">viajes</StyledText>
        </StyledText>
        
        <StyledText className="text-gray-700 text-xl mb-8 text-center mt-4 normal-text">
          Descubre una nueva forma de viajar con nuestra plataforma de 
          geolocalización gamificada.{web ? '\n' : ' '}Registra tus aventuras, completa retos y 
          conecta con otros viajeros.
        </StyledText>
        
        <StyledView className='w-full button-container'>
          <Button 
            style={{ marginBottom: 16 }}
            title="Comenzar gratis" 
            onPress={handleRegisterPress} 
            variant="primary"
            fullWidth
            className="button primary"
          />
          
          <Button 
            title="Iniciar sesión" 
            onPress={handleLoginPress}
            variant="secondary"
            fullWidth
            className="button secondary"
          />
        </StyledView>
      </StyledView>
    </ImageBackground>
  );
};

export default WelcomeScreen; 