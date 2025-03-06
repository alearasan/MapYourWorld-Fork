/**
 * App principal de MapYourWorld Mobile
 */
import React from 'react';
import { SafeAreaView, StatusBar, View, Text, Image } from 'react-native';
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

const distritosEjemplo = [
  {
    nombre: "Distrito Centro",
    coordenadas: [
      { latitude: 37.3252, longitude: -6.0365 }, // Noroeste
      { latitude: 37.3252, longitude: -6.0280 }, // Noreste
      { latitude: 37.3205, longitude: -6.0280 }, // Sureste
      { latitude: 37.3205, longitude: -6.0365 }, // Suroeste
    ],
  },
  {
    nombre: "Distrito Parque de la Marina",
    coordenadas: [
      { latitude: 37.3200, longitude: -6.0450 }, // Noroeste
      { latitude: 37.3200, longitude: -6.0385 }, // Noreste
      { latitude: 37.3160, longitude: -6.0385 }, // Sureste
      { latitude: 37.3160, longitude: -6.0450 }, // Suroeste
    ],
  },
  {
    nombre: "Distrito Río Guadalquivir",
    coordenadas: [
      { latitude: 37.3170, longitude: -7.0600 }, // Noroeste
      { latitude: 37.3170, longitude: -6.0500 }, // Noreste
      { latitude: 37.3125, longitude: -6.0500 }, // Sureste
      { latitude: 37.3125, longitude: -6.0600 }, // Suroeste
    ],
  },
  {
    nombre: "Coria",
    coordenadas: [
      { latitude: 37.301037, longitude:  -6.067630 },
      { latitude: 37.295721, longitude: -6.035927 },
      { latitude: 37.275537, longitude: -6.044450 },
      { latitude: 37.284229, longitude: -6.071458 },
    ],
  },
];



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
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Welcome</StyledText>
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
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Register</StyledText>
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
            <StyledText className="text-xl font-bold ml-2 text-gray-800">Login</StyledText>
          </View>
          )
          
        }}/>
        <Stack.Screen name="Map" 
        component={(props:any) => <MapScreen {...props} distritos={distritosEjemplo} />} 
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('./src/assets/images/logo.png')} 
              style={{ width: 35, height: 35, marginRight: 5 }}
            />
            <StyledText className="text-xl font-bold ml-2 text-gray-800">MapYourWorld</StyledText>
           
          </View>
          )
          
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Registramos directamente el componente App como componente raíz de la aplicación
registerRootComponent(App);

export default App; 