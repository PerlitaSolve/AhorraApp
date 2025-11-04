import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function MenuLateral(props) {
  const { navigation } = props; 

  const menuItems = [
    { nombre: 'Notificaciones', screen: 'Notificaciones' },
    { nombre: 'Gastos', screen: 'Gastos' },
    { nombre: 'Ingresos', screen: 'Ingresos' },
    { nombre: 'Transacciones', screen: 'Transacciones' },
    { nombre: 'Presupuesto', screen: 'Presupuesto' },
    { nombre: 'Gráficas', screen: 'Comparacion' }, 
  ];

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Text style={styles.title}>Menú</Text>

        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => {
              // navega sólo si la pantalla está registrada en el navigator
              if (navigation && typeof navigation.navigate === 'function') {
                navigation.navigate(item.screen);
              }
            }}
            style={styles.item}
          >
            <Text style={styles.itemText}>{item.nombre}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={() => navigation.closeDrawer && navigation.closeDrawer()} style={styles.closeBtn}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16,
},
  title: { 
    fontSize: 18, 
    marginBottom: 12,
},
  item: { 
    paddingVertical: 10,
},
  itemText: { 
    fontSize: 16, 
    color: '#333',
},
  closeBtn: { 
    paddingVertical: 10, 
    marginTop: 12,
},
  closeText: { 
    color: '#FF4500',
},
});