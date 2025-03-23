import { RootStackParamList } from "@/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageBackground, View, TouchableOpacity, StyleSheet, Text, Platform, TextInput, ScrollView } from "react-native";
import { styles } from '../../assets/styles/styles';
import React, { useState } from "react";

type AdvertisementFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AdvertisementForm'>;

interface AdvertisementPoint {
    email: string,
    name: string,
    description?: string,
    longitude: string,
    latitude: string,
}

const AdvertisementForm = () => {
  const [ point, setPoint ] = useState<AdvertisementPoint>({
    email:'',
    name:'',
    description:undefined,
    longitude:'',
    latitude:''
  })
  const [errors, setErrors] = useState({
    email: '',
    name:'',
    description:'',
    longitude:'',
    latitude:'',
  });
  const [loading, setLoading] = useState(false);
    
  const navigation = useNavigation<AdvertisementFormNavigationProp>();

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // validación del correo
    if (!point.email.trim()) {
        newErrors.email = 'El correo electrónico es obligatorio';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(point.email)) {
        newErrors.email = 'Introduce un correo electrónico válido';
        isValid = false;
    }

    // validación del nombre
    if (!point.name.trim()) {
        newErrors.name = 'El nombre es obligatorio';
        isValid = false;
    }

    // validación de la longitud y la latitud
    if (!point.longitude.trim()) {
        newErrors.longitude = 'La longitud es obligatoria';
        isValid = false;
    } else if (/[a-zA-Z]/.test(point.longitude)) {
        newErrors.longitude = 'La longitud debe ser un número'
        isValid = false;
    } else if (Math.abs(Number(point.longitude))>180) {
        newErrors.longitude = 'La longitud debe estar entre -180º y 180º'
        isValid = false;
    }

    if (!point.latitude.trim()) {
        newErrors.latitude = 'La latitud es obligatoria';
        isValid = false;
    } else if (/[a-zA-Z]/.test(point.latitude)) {
        newErrors.latitude = 'La latitud debe ser un número'
        isValid = false;
    } else if (Math.abs(Number(point.longitude))>90) {
        newErrors.latitude = 'La latitud debe estar entre -90º y 90º'
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleChange = (field: keyof typeof point, value: string) => {
    setPoint(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    const subject = `Solicitud de punto publicitario: ${point.name}`
    const body = `Solicitud de punto publicitario con los siguientes datos:`
        + `\nNombre del punto: ${point.name}`
        + `\n${point.description ?? `Descripción del punto: ${point.description}`}`
        + `\nCoordenadas del punto (longitud, latitud): ${point.longitude}, ${point.latitude}`
        + `\nEmail de contacto: ${point.email}`
        + `\nFecha de registro de la solicitud: ${new Date(Date.now()).toLocaleString()}`;

    try {
        
    }  catch (error: unknown) {
        console.error('Error al registrarse:', error);

        let errorMessage: string = 'Ocurrió un error inesperado';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }

    } finally {
        setLoading(false);
    }
    
  };
  
  const customInputStyles = `
    .input-container input {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 15px;
      font-size: 16px;
      transition: border-color 0.2s;
      height: 44px;
      box-sizing: border-box;
    }
    
    .input-container input:focus {
      border-color: #2bbbad;
      outline: none;
    }
    
    .input-container {
      margin-bottom: 20px;
    }

    button {
      box-sizing: border-box;
      height: 44px;
    }
  `;

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.webp')}
      style={styles.background_image}
            resizeMode="cover"
            className='image-background'
    >
      <View style={styles.semi_transparent_overlay} />
        <ScrollView>
          {/* Content */}
          <View className="flex-1 justify-center items-center min-h-screen">
            <style dangerouslySetInnerHTML={{ __html: customInputStyles }} />
            <div style={{ 
              backgroundColor: 'white', 
              padding: 40,
              borderRadius: 12, 
              width: '600px',
              maxWidth: '600px', 
              margin: '0 auto',
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              
              <div style={{ width: '100%', marginBottom: 20 }}>
                {/* Correo electrónico */}
                <div className="input-container" style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                    Correo electrónico
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={point.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      style={{ 
                        width: '100%',
                        paddingLeft: '35px',
                        paddingRight: '10px',
                        height: '44px',
                        borderColor: errors.email ? '#e53e3e' : undefined
                      }}
                    />
                  </div>
                  {errors.email && (
                    <div style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Nombre */}
                <div className="input-container" style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                    Nombre
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={point.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      style={{ 
                        width: '100%',
                        paddingLeft: '35px',
                        paddingRight: '10px',
                        height: '44px',
                        borderColor: errors.name ? '#e53e3e' : undefined
                      }}
                    />
                  </div>
                  {errors.name && (
                    <div style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <div className="input-container" style={{ marginBottom: 20 }}>
                  <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                    Descripción
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="textarea"
                      placeholder="Descripción"
                      value={point.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      style={{ 
                        width: '100%',
                        paddingLeft: '35px',
                        paddingRight: '10px',
                        height: '44px',
                        borderColor: errors.description ? '#e53e3e' : undefined
                      }}
                    />
                  </div>
                  {errors.description && (
                    <div style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                      {errors.description}
                    </div>
                  )}
                </div>

                {/* Coordenadas */}
                <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                    Coordenadas
                </div>
                <div style={{ flexDirection: 'row', gap: 5, marginBottom: 20 }}>
                  {/* Longitud */}
                  <div className="input-container" style={{ width: '50%', }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                      Longitud
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="Longitud"
                        value={point.longitude}
                        onChange={(e) => handleChange('longitude', e.target.value)}
                        style={{ 
                          width: '100%',
                          paddingLeft: '35px',
                          paddingRight: '10px',
                          height: '44px',
                          borderColor: errors.longitude ? '#e53e3e' : undefined
                        }}
                      />
                    </div>
                    {errors.longitude && (
                      <div style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                        {errors.longitude}
                      </div>
                    )}
                  </div>
                  {/* Latitude */}
                  <div className="input-container" style={{ width: '50%', }}>
                    <div style={{ marginBottom: 8, fontWeight: 500, color: '#333', textAlign: 'left' }}>
                      Latitud
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="Latitud"
                        value={point.latitude}
                        onChange={(e) => handleChange('latitude', e.target.value)}
                        style={{ 
                          width: '100%',
                          paddingLeft: '35px',
                          paddingRight: '10px',
                          height: '44px',
                          borderColor: errors.name ? '#e53e3e' : undefined
                        }}
                      />
                    </div>
                    {errors.latitude && (
                      <div style={{ color: '#e53e3e', fontSize: '14px', marginTop: '4px', textAlign: 'left' }}>
                        {errors.latitude}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón */}
                <div style={{ width: '100%' }}>
                  <button 
                    onClick={handleSubmit}
                    style={{
                      width: '100%',
                      backgroundColor: '#2bbbad',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      height: '44px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {loading ? 'Cargando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            </div>
          </View>
        </ScrollView>
    </ImageBackground>
  );
};

export default AdvertisementForm; 