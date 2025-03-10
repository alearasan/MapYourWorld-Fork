import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HamburgerMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigate = (route: string) => {
    setMenuVisible(false);
    navigation.navigate(route as never);
  };

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Text style={{ fontSize: 30 }}>☰</Text>
      </TouchableOpacity>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => handleNavigate('CollaborativeMaps')} style={styles.menuItem}>
              <Text style={styles.menuItemText}>Mapas Colaborativos</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 60,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: 220, // Ancho aumentado para un menú más grande
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 18, // Texto más grande
    fontWeight: '500',
  },
});

export default HamburgerMenu;
