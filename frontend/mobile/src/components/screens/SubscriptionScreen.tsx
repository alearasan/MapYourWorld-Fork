import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';  // Para la navegación
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '../../constants/config';
import { useAuth } from '@/contexts/AuthContext';


type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

const SubscriptionScreen = () => {
   
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<PaymentScreenNavigationProp>();  // Navegación a otras pantallas

  const { user } = useAuth();
  

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stripe/${user?.id}`, { //Falta meter el user-Id para que funcione.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 550 }),
      });
  
      if (!response.ok) {
        // Imprimir detalles de la respuesta de error
        const errorData = await response.json();
        console.error('Error en la respuesta del servidor:', errorData);
        throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
      }
  
      const { paymentIntent } = await response.json();
      console.log('Client Secret:', paymentIntent);
      return paymentIntent;
    } catch (error) {
      console.error('Error al hacer el fetch:', error);
    }
  };
  
  

  const openPaymentSheet = async () => {
    setLoading(true);
    const clientSecret = await fetchPaymentSheetParams();

    if (!clientSecret) {
      console.error('Error: clientSecret no recibido');
      setLoading(false);
      return;
    }

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Mi Empresa',
    });

    if (!error) {
      // Presentar el PaymentSheet de Stripe
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) {
        console.log('Error al procesar el pago:', paymentError);
      } else {
        // Navegar a una pantalla de éxito si el pago es exitoso
        console.log('Pago exitoso!');
        navigation.navigate('Map');  // Redirigir a la pantalla de éxito
      }
    } else {
      console.log('Error al abrir PaymentSheet:', error);
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-bold">Suscribirse a Premium</Text>
      <TouchableOpacity 
        onPress={openPaymentSheet} 
        className="bg-blue-500 px-4 py-2 rounded-lg mt-4"
        disabled={loading}
      >
        <Text className="text-white">{loading ? 'Cargando...' : 'Pagar con Stripe'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionScreen;
