import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Componente de prueba que usa el hook useAuth
const TestComponent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut } = useAuth();
  
  return (
    <View>
      <Text>Estado: {isAuthenticated ? 'Autenticado' : 'No autenticado'}</Text>
      {user && <Text>Usuario: {user.username}</Text>}
      
      <TouchableOpacity onPress={() => signIn('test@example.com', 'password')}>
        <Text>Iniciar sesión</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => signUp('testuser', 'test@example.com', 'password')}>
        <Text>Registrarse</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Limpiamos los mocks entre pruebas
    jest.clearAllMocks();
  });
  
  test('inicia con el usuario no autenticado', async () => {
    // Configurar AsyncStorage para devolver null (no hay usuario almacenado)
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(null));
    
    const { getByText, queryByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Esperar a que se termine de cargar el estado inicial
    await waitFor(() => {
      expect(getByText('Estado: No autenticado')).toBeTruthy();
      expect(queryByText(/Usuario:/)).toBeNull();
    });
  });
  
  test('carga el usuario desde AsyncStorage al iniciar', async () => {
    // Usuario almacenado en AsyncStorage
    const storedUser = {
      id: 'user-123',
      username: 'saveduser',
      email: 'saved@example.com'
    };
    
    // Configurar AsyncStorage para devolver un usuario
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === '@MapYourWorld:user') {
        return Promise.resolve(JSON.stringify(storedUser));
      }
      if (key === '@MapYourWorld:token') {
        return Promise.resolve('saved-token-123');
      }
      return Promise.resolve(null);
    });
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Esperar a que se cargue el usuario desde AsyncStorage
    await waitFor(() => {
      expect(getByText('Estado: Autenticado')).toBeTruthy();
      expect(getByText('Usuario: saveduser')).toBeTruthy();
    });
  });
  
  test('permite iniciar sesión', async () => {
    // Configurar AsyncStorage para devolver null (no hay usuario almacenado)
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(null));
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Verificar que comienza no autenticado
    await waitFor(() => {
      expect(getByText('Estado: No autenticado')).toBeTruthy();
    });
    
    // Hacer clic en el botón de iniciar sesión
    fireEvent.press(getByText('Iniciar sesión'));
    
    // Verificar que se llamó a AsyncStorage.setItem para guardar el usuario y token
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@MapYourWorld:user', expect.any(String));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@MapYourWorld:token', expect.any(String));
    });
    
    // Verificar que el estado de autenticación cambió
    await waitFor(() => {
      expect(getByText('Estado: Autenticado')).toBeTruthy();
      expect(getByText('Usuario: test')).toBeTruthy(); // El nombre de usuario se extrae del correo
    });
  });
  
  test('permite registrarse', async () => {
    // Configurar AsyncStorage para devolver null (no hay usuario almacenado)
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(null));
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Verificar que comienza no autenticado
    await waitFor(() => {
      expect(getByText('Estado: No autenticado')).toBeTruthy();
    });
    
    // Hacer clic en el botón de registrarse
    fireEvent.press(getByText('Registrarse'));
    
    // Verificar que se llamó a AsyncStorage.setItem para guardar el usuario y token
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@MapYourWorld:user', expect.any(String));
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@MapYourWorld:token', expect.any(String));
    });
    
    // Verificar que el estado de autenticación cambió
    await waitFor(() => {
      expect(getByText('Estado: Autenticado')).toBeTruthy();
      expect(getByText('Usuario: testuser')).toBeTruthy();
    });
  });
  
  test('permite cerrar sesión', async () => {
    // Usuario almacenado en AsyncStorage
    const storedUser = {
      id: 'user-123',
      username: 'saveduser',
      email: 'saved@example.com'
    };
    
    // Configurar AsyncStorage para devolver un usuario
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === '@MapYourWorld:user') {
        return Promise.resolve(JSON.stringify(storedUser));
      }
      if (key === '@MapYourWorld:token') {
        return Promise.resolve('saved-token-123');
      }
      return Promise.resolve(null);
    });
    
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Esperar a que se cargue el usuario desde AsyncStorage
    await waitFor(() => {
      expect(getByText('Estado: Autenticado')).toBeTruthy();
    });
    
    // Hacer clic en el botón de cerrar sesión
    fireEvent.press(getByText('Cerrar sesión'));
    
    // Verificar que se llamó a AsyncStorage.removeItem para eliminar el usuario y token
    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@MapYourWorld:user');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@MapYourWorld:token');
    });
    
    // Verificar que el estado de autenticación cambió
    await waitFor(() => {
      expect(getByText('Estado: No autenticado')).toBeTruthy();
    });
  });
}); 