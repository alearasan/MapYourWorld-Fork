/**
 * App principal de MapYourWorld Mobile
 */
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import LoginScreen from './src/components/screens/LoginScreen';
import RegisterScreen from './src/components/screens/RegisterScreen';

// Aplicamos styled a los componentes nativos para poder usar Tailwind
const StyledSafeAreaView = styled(SafeAreaView);

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
            component={() => (
              <StyledSafeAreaView className="flex-1 justify-center items-center">
                {/* Aquí iría el componente del mapa */}
              </StyledSafeAreaView>
            )} 
          />
          <Stack.Screen 
            name="ForgotPassword" 
            component={() => (
              <StyledSafeAreaView className="flex-1 justify-center items-center">
                {/* Aquí iría el componente de recuperación de contraseña */}
              </StyledSafeAreaView>
            )} 
          />
        </Stack.Navigator>
      </StyledSafeAreaView>
    </NavigationContainer>
  );
};

export default App; 