import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';


export default function MenuLateral(){
const MenuLateral = ({ navigation }) => {

    const menuItems =[
        { nombre: 'Notificaciones',icono: 'notificaciones-outline', screen: 'Notificaciones' },
        { nombre: 'Gastos',icono: 'arrow-up-circle-outline', screen: 'Gastos' },
        { nombre: 'Ingresos',icono: 'arrow-down-circle-outline', screen: 'Ingresos' },
        { nombre: 'Transacciones',icono: 'list-circle-outline', screen: 'Transacciones' },
        { nombre: 'Presupuesto',icono: 'wallet-outline', screen: 'Presupuesto' },
        { nombre: 'Gráficas',icono: 'bar-chart-outline', screen: 'Gráficas' },
    ];

    return(
        <View style={styles.container}>
            <View style={styles.profileHeader}>
            <Text style={styles.profileName}>Pedro Perez</Text>
            <Text style={styles.profileBalance}>$ 20, 585</Text>
            </View>

            <View style={styles.menuList}>
                {menuItems.map((item) => (
                    <TouchableOpacity 
                    key={index} 
                    style={styles.menuItems}
                    onPress={() => navigation.navigate(item.screen)}
                    >
                        <Text style={styles.menuItemText}>{item.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </View>

           <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
           </TouchableOpacity> 
        </View>
    )
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileHeader:{
        padding: 20,
        backgroundColor: '#004A77',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    profileName:{
        color: '#fff',
        fontSize: 18,
        marginTop: 10,
    },
    profileBalance:{
        color: '#B0E0E6',
        fontSize: 24,
        fontWeight: 'bold',
    },
    menulist: {
        paddingHorizontal: 10,
    },
    menuItems:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    menuItemText:{
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    logoutButton:{
        position: 'absolute',
        bottom: 30,
        left: 20,
        padding: 10,
    },
    logoutButtonText:{
        color: '#FF4500',
        fontSize: 16,
        fontWeight: 'bold',
    },
})