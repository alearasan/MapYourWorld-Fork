/**
 * App principal de MapYourWorld Mobile
 */
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { styled } from 'nativewind';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';

// importamos los estilos web sólo si estamos en web
if (Platform.OS === 'web') {
  require('./src/assets/styles/web.css');
}

// Importamos las pantallas
import WelcomeScreen from './src/components/screens/WelcomeScreen';
import LoginScreen from './src/components/screens/LoginScreen';
import RegisterScreen from './src/components/screens/RegisterScreen';
import MapScreen from './src/components/Map/MapScreen';
import HamburgerMenu from '@/components/UI/HamburgerMenu';

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



// Definimos un wrapper para MapScreen que incluye los distritos de ejemplo
const MapScreenWithDistritos = (props: any) => <MapScreen {...props} />;


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" 
        component={WelcomeScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800 navbar-text">Welcome</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Register" 
        component={RegisterScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800 navbar-text">Register</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Login" 
        component={LoginScreen} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800 navbar-text">Login</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen 
          name="Map" 
          component={MapScreenWithDistritos}
          options={{
            headerTitle: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('./src/assets/images/logo.png')} 
                  style={{ width: 35, height: 35, marginRight: 5 }}
                />
                <StyledText className="text-xl font-bold ml-2 text-gray-800 navbar-text">MapYourWorld</StyledText>
              </View>
            ),
            headerRight: () => <HamburgerMenu />,
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Registramos directamente el componente App como componente raíz de la aplicación
registerRootComponent(App);

export default App; 