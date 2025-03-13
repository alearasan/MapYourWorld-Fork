import React, { useState } from 'react';
import { View, Text, ScrollView, ImageBackground, Image } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Button from '../UI/Button';
import TextInput from '../UI/TextInput';
import { styles as globalStyles } from '../../assets/styles/styles';

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

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es obligatorio';
      isValid = false;
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Aquí iría la lógica real de registro
      // await authService.register(formData);
      
      // Simulamos un delay para mostrar el spinner
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navegar a la pantalla principal después del registro exitoso
      navigation.navigate('Map');
    } catch (error) {
      console.error('Error al registrarse:', error);
      // Manejar errores
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.webp')}
      style={globalStyles.background_image}
      resizeMode="cover"
    >
      <View style={globalStyles.semi_transparent_overlay} />
      <StyledScrollView className="flex-1">
        <StyledView className="flex-1 p-6 justify-center min-h-screen">
          {/* Formulario */}
          <StyledView className="bg-white p-6 rounded-lg w-full shadow-md">
            <StyledView className="flex-row items-center justify-center mb-6">
              <Image source={require('../../assets/images/logo.png')} style={{ width: 35, height: 35 }} />
              <StyledText className="text-xl font-bold ml-2 text-gray-800">MapYourWorld</StyledText>
            </StyledView>
            
            <StyledText className="text-2xl font-bold text-center mb-2">
              Crea tu cuenta
            </StyledText>
            <StyledText className="text-gray-600 text-center mb-6">
              Comienza a documentar tus aventuras hoy mismo
            </StyledText>
            
            <TextInput
              label="Nombre completo"
              placeholder="Nombre completo"
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              autoCapitalize="words"
              error={errors.fullName}
              icon="user"
            />
            
            <TextInput
              label="Correo electrónico"
              placeholder="Correo electrónico"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              error={errors.email}
              icon="mail"
            />
            
            <TextInput
              label="Contraseña"
              placeholder="Contraseña"
              value={formData.password}
              onChangeText={(text) => handleChange('password', text)}
              secureTextEntry
              error={errors.password}
              icon="lock"
            />
            
            <Button 
              title="Registrarse" 
              onPress={handleRegister}
              isLoading={isLoading}
              fullWidth
              className="mt-4 mb-3"
            />
            
            <StyledView className="flex-row justify-center mt-4">
              <StyledText className="text-gray-600">
                ¿Ya tienes una cuenta?{' '}
              </StyledText>
              <StyledText 
                className="text-teal-500 font-medium"
                onPress={goToLogin}
              >
                Inicia sesión
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </ImageBackground>
  );
};

export default RegisterScreen; 