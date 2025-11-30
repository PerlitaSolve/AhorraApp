import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';  


export default function MenuLateral({ navigation, volver }) {

  const menuItems = [
        { name: 'Transacciones', icon: 'repeat', navigation: 'Transactions' },
        { name: 'Presupuesto', icon: 'currency-usd', navigation: 'P' },
        { name: 'Notificaciones', icon: 'bell', navigation: 'Notifications' },
  ];

  const handlelogout = () => {
    alert('Cerrando sesión...');
};

const navigateToDetails = (screen) => {
  alert(`Navegando a ${screen}...`);
};

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdrop} 
        onPress={() => navigation?.goBack()} 
        activeOpacity={1}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Menú</Text>

        <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={40} color="#357D8B"></MaterialCommunityIcons>
          </View>
          <View>
            <Text style={styles.profileName}>Michael Jackson</Text> 
            <Text style={styles.userBalance}>$ 20, 989</Text> 
          </View>
        </View>  
        </View>

        <Text style={styles.sectionTitle}>Opciones de la app</Text>

        {/* Menu de opciones */}
        <View style={styles.optionsList}>
          {menuItems.map((item) => (
            <TouchableOpacity
            key={item.name}
              style={styles.optionItem}
              onPress={() => navigateToDetails(item.screen)}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#357D8B" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.name}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="gray"/>
            </TouchableOpacity>
          ))}
        </View>
        {/* Boton cerrar sesion */}
        <TouchableOpacity style={styles.logoutButton} onPress={handlelogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity> 
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    safeArea: {
        width: 280,
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    container: {
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 8,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E6F0F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    userBalance: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#357D8B',
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'gray',
        marginBottom: 10,
        marginTop: 10,
    },
    optionsList: {
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        marginRight: 15,
        width: 30,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    
    logoutButton: {
        marginTop: 30,
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButtonTop: { marginBottom: 10 },
    backArrow: { fontSize: 30, color: '#357D8B', fontWeight: 'bold' },
});