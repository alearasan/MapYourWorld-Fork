import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';  // Para la navegación
import { RootStackParamList } from '../../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

const SubscriptionScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<PaymentScreenNavigationProp>();  // Navegación a otras pantallas

  const fetchPaymentSheetParams = async () => {
    console.log('Fetching PaymentSheet params...');
    const response = await fetch('https://tu-backend.com/payments/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const openPaymentSheet = async () => {
    setLoading(true);
    const clientSecret = "await fetchPaymentSheetParams()";

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
        navigation.navigate('Welcome');  // Redirigir a la pantalla de éxito
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
