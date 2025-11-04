import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function MenuLateral(props) {
  const { navigation } = props; 

  const menuItems = [
    { nombre: 'Inicio', screen: 'Inicio', icon: '🏠' },
    { nombre: 'Notificaciones', screen: 'Notificaciones', icon: '🔔' },
    { nombre: 'Ingresos', screen: 'Ingresos', icon: '💰' },
    { nombre: 'Gastos', screen: 'Gastos', icon: '💵' },
    { nombre: 'Presupuesto', screen: 'Presupuesto', icon: '📊' },
    { nombre: 'Transacciones', screen: 'Transacciones', icon: '📝' },
  ];

  const handleLogout = () => {
    // Aquí iría la lógica de cerrar sesión
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContainer}>
      <View style={styles.container}>
        {/* Header con logo */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/L-SFon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Lista de opciones del menú */}
        <View style={styles.menuList}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                if (navigation?.navigate) {
                  navigation.navigate(item.screen);
                }
              }}
              style={styles.menuItem}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1D617A',
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  menuList: {
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 5,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    color: '#E8F6F7',
  },
  menuText: {
    fontSize: 16,
    color: '#E8F6F7',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 'auto',
    marginHorizontal: 15,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E8F6F7',
  },
  logoutText: {
    color: '#E8F6F7',
    fontSize: 16,
    textAlign: 'center',
  },
});