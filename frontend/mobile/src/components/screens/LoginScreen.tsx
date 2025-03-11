import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Image, Platform } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '@components/UI/Button';
import TextInput from '@components/UI/TextInput';
import {styles} from '@assets/styles/styles';

// importamos los estilos web sólo si estamos en web
const web = Platform.OS === 'web'
if (web) {
  require('../../assets/styles/web.css');
  require('../../assets/styles/auth.css');
}

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

// Definir el tipo para la navegación
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Map: undefined;
  ForgotPassword: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo electrónico válido';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Aquí iría la lógica real de inicio de sesión
      // await authService.login(formData);
      
      // Simulamos un delay para mostrar el spinner
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar a la pantalla principal después del login exitoso
      navigation.navigate('Map');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Manejar errores
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    // Navegar a la pantalla de recuperación de contraseña
    navigation.navigate('ForgotPassword');
  };

  return (
    <ImageBackground
      source={require("../../assets/images/login_background.webp")} 
      style={styles.background_image}
      resizeMode="cover"
      className='image-background'
    >
      <View style={styles.semi_transparent_overlay} />
      <StyledScrollView className="flex-1 base-container">
        <StyledView className="flex-1 p-6 justify-start min-h-screen mt-20 auth-container">
          <StyledView className="bg-white p-6 rounded-lg w-full shadow-md">
            <StyledView className="flex-row items-center justify-center mb-6 disappear">
              <Image source={require('../../assets/images/logo.png')} style={{ width: 35, height: 35 }} />
              <StyledText className="text-xl font-bold ml-2 text-gray-800">MapYourWorld</StyledText>
            </StyledView>
            <StyledText className="text-2xl font-bold text-center mb-2 title">
              Bienvenido de nuevo
            </StyledText>
            <StyledText className="text-gray-600 text-center mb-6 normal-text">
              Inicia sesión para continuar tu aventura
            </StyledText>
            
            <StyledView className='input'>
              <TextInput
                label="Correo electrónico"
                placeholder="Correo electrónico"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                error={errors.email}
                icon="mail"
              />
            </StyledView>
            
            <StyledView className='input'>
              <TextInput
                label="Contraseña"
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
                error={errors.password}
                icon="lock"
              />
            </StyledView>
            
            <StyledText 
              className="text-teal-500 text-right mb-4"
              onPress={handleForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </StyledText>
            
            <Button 
              title="Iniciar sesión" 
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
              className="mb-3 button primary"
            />
            
            <StyledView className="flex-row justify-center mt-4 link">
              <StyledText className="text-gray-600">
                ¿No tienes una cuenta?{' '}
              </StyledText>
              <StyledText 
                className="text-teal-500 font-medium teal"
                onPress={goToRegister}
              >
                Regístrate
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </ImageBackground>
  );
};



export default LoginScreen; 