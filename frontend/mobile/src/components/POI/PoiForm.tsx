import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface PuntoDeInteresFormProps {
  pointOfInterest: any;
  setPointOfInterest: (pointOfInterest: any) => void;
  setShowForm: (showForm: boolean) => void;
}

const categories = [
  { label: 'Cultura', value: 'CULTURA' },
  { label: 'Naturaleza', value: 'NATURALEZA' },
  { label: 'Gastronomía', value: 'GASTRONOMIA' },
  { label: 'Historia', value: 'HISTORIA' },
  { label: 'Arte', value: 'ARTE' },
];

const PuntoDeInteresForm: React.FC<PuntoDeInteresFormProps> = ({
  pointOfInterest,
  setPointOfInterest,
  setShowForm,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  // Estado inicial para reiniciar el formulario
  const initialPoint = { name: '', description: '', category: '', photos: [] };

  // NUEVO: Función para seleccionar una foto desde la galería del móvil usando Expo Image Picker
  const handleAddPhoto = async () => {
    // Solicitar permisos para acceder a la galería (si es necesario)
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permiso denegado', 'Se requiere acceso a la galería para seleccionar una imagen.');
      return;
    }

    // Abrir la galería para seleccionar una imagen
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Para Expo SDK 48 y posteriores, la respuesta tiene un array "assets"
      const uri = result.assets[0].uri;
      const updatedPhotos = pointOfInterest.photos
        ? [...pointOfInterest.photos, uri]
        : [uri];
      setPointOfInterest({ ...pointOfInterest, photos: updatedPhotos });
    }
  };

  const handleSelectCategory = (categoryValue: string) => {
    setPointOfInterest({ ...pointOfInterest, category: categoryValue });
    setDropdownVisible(false);
  };

  const handleSubmit = async () => {
    console.log('Punto de interés registrado:', pointOfInterest);
    console.log('Hay que unir con las rutas de backend');
    /*/try {
      const response = await fetch("http://tu-backend-url/api/points-of-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pointOfInterest),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Éxito", "Punto de interés creado correctamente.");
        setPointOfInterest(initialPoint);
        setShowForm(false);
      } else {
        Alert.alert("Error", "No se pudo crear el punto de interés.");
      }
    } catch (error) {
      console.error("Error al crear el punto de interés:", error);
      Alert.alert("Error", "Ocurrió un error al crear el punto de interés.");
    }/*/
  };

  return (
    <View className="w-80 bg-white rounded-lg p-5 shadow-lg self-center">
      <ScrollView>
        <Text className="text-center text-xl font-semibold mb-4">
          Registrar Punto de Interés
        </Text>
        <View className="mb-4">
        <Text className="text-lg mb-1">Nombre</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            placeholder="Nombre del punto de interés"
            value={pointOfInterest.name}
            onChangeText={(text) =>
              setPointOfInterest({ ...pointOfInterest, name: text })
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-lg mb-1">Descripción</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 h-20"
            
            placeholder="Descripción del punto de interés"
            value={pointOfInterest.description}
            multiline
            onChangeText={(text) =>
              setPointOfInterest({ ...pointOfInterest, description: text })
            }
          />
        </View>
        <View className="mb-4">
          <Text className="text-lg mb-1">Categoría</Text>
          <TouchableOpacity
            className="border border-gray-300 rounded-lg px-3 py-2"
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text>
              {pointOfInterest.category
                ? categories.find((cat) => cat.value === pointOfInterest.category)?.label
                : 'Seleccionar categoría'}
            </Text>
          </TouchableOpacity>
          {dropdownVisible && (
            <View className="border border-gray-300 rounded-lg mt-1">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  className="px-3 py-2 border-b last:border-b-0"
                  onPress={() => handleSelectCategory(cat.value)}
                >
                  <Text>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View className="mb-4">
          <Text className="text-lg mb-1">Fotos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pointOfInterest.photos &&
              pointOfInterest.photos.map((uri: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri }}
                  className="w-16 h-16 rounded-lg mr-2"
                />
              ))}
            <TouchableOpacity
              className="w-16 h-16 rounded-lg border border-gray-300 justify-center items-center"
              onPress={handleAddPhoto}
            >
              <Text className="text-2xl text-gray-500">+</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-lg items-center mt-2"
          onPress={() => {
            
            handleSubmit();
            setPointOfInterest(initialPoint);
            setShowForm(false);
          }}
        >
          <Text className="text-white text-base font-semibold">Registrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-lg items-center mt-2"
          onPress={() => {
            setPointOfInterest(initialPoint);
            setShowForm(false);
          }}
        >
          <Text className="text-white text-base font-semibold">Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PuntoDeInteresForm;
