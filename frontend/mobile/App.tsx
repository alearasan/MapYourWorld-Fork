/**
 * App principal de MapYourWorld Mobile
 */
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { styled } from 'nativewind';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Aplicamos styled a los componentes nativos para poder usar Tailwind
const StyledSafeAreaView = styled(SafeAreaView);

// TODO: Importar pantallas y servicios necesarios

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StyledSafeAreaView className="flex-1 bg-white">
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#3B82F6', // primary-500
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {/* TODO: Agregar pantallas a la navegación */}
          <Stack.Screen 
            name="Home" 
            component={() => (
              <StyledSafeAreaView className="flex-1 justify-center items-center">
                {/* Esto será reemplazado por componentes reales */}
              </StyledSafeAreaView>
            )} 
            options={{ title: 'MapYourWorld' }}
          />
        </Stack.Navigator>
      </StyledSafeAreaView>
    </NavigationContainer>
  );
};

export default App; 