/**
 * App principal de MapYourWorld Mobile
 */
import React from 'react';
import { SafeAreaView, StatusBar, View, Text } from 'react-native';
import { styled } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';

// Importamos las pantallas
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import LoginScreen from './src/components/screens/LoginScreen';
import RegisterScreen from './src/components/screens/RegisterScreen';
import MapScreen from './src/components/Map/MapScreen';

// Aplicamos styled a los componentes nativos para poder usar Tailwind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledSafeAreaView = styled(SafeAreaView);

// Componente de respaldo para pantallas no implementadas
const FallbackScreen = ({ title, message }: { title: string, message: string }) => (
  <StyledView className="flex-1 justify-center items-center p-5">
    <StyledText className="text-xl font-bold mb-2">{title}</StyledText>
    <StyledText className="text-base text-gray-600 text-center">{message}</StyledText>
  </StyledView>
);

// Pantalla temporal para recuperar contraseña
const ForgotPasswordScreen = () => (
  <FallbackScreen 
    title="Recuperar Contraseña" 
    message="Esta funcionalidad está en desarrollo" 
  />
);

// Definimos los tipos para el navegador
type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Map: undefined;
  ForgotPassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StyledSafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
          />
          <Stack.Screen 
            name="Map" 
            component={MapScreen} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
          />
        </Stack.Navigator>
      </StyledSafeAreaView>
    </NavigationContainer>
  );
};

// Registramos directamente el componente App como componente raíz de la aplicación
registerRootComponent(App);

export default App; 