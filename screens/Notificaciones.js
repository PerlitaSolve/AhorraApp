import { Text, StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function Notificaciones({ navigation }) {

    const notificaciones = [
        {
            id: 1,
            mensaje: 'Se realizó modificaciones a un movimiento del día 15 de Septiembre'
        },
        {
            id: 2,
            mensaje: 'Se excedió el presupuesto de la categoría "Transporte"'
        },
        {
            id: 3,
            mensaje: 'Falta poco para llegar al límite del presupuesto de la categoría "Alimentos"'
        },
        {
            id: 4,
            mensaje: 'Se eliminó el movimiento del día 21 de Agosto'
        },
        {
            id: 5,
            mensaje: 'Se modificó el movimiento del día 15 de julio'
        }
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1D617A" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.titulo}>AHORRA + APP</Text>
            </View>

            {/* Título de la sección */}
            <Text style={styles.subtitulo}>"NOTIFICACIONES"</Text>

            {/* Lista de notificaciones */}
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <View style={styles.notificacionesContainer}>
                    {notificaciones.map((notif) => (
                        <View key={notif.id} style={styles.notificacionItem}>
                            <View style={styles.iconoContainer}>
                                <Text style={styles.iconoEmail}>✉</Text>
                            </View>
                            <Text style={styles.notificacionTexto}>{notif.mensaje}</Text>
                        </View>
                    ))}
                    
                    {/* Botón Ver todo */}
                    <TouchableOpacity style={styles.verTodoButton}>
                        <Text style={styles.verTodoTexto}>Ver todo</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1D617A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    backArrow: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    titulo: {
        fontFamily: 'Times New Roman',
        fontSize: 24,
        color: 'white',
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    subtitulo: {
        fontFamily: 'Times New Roman',
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 30,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    notificacionesContainer: {
        backgroundColor: '#E8F4F8',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    notificacionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D0D0',
    },
    iconoContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconoEmail: {
        fontSize: 28,
        color: '#5A5A5A',
    },
    notificacionTexto: {
        flex: 1,
        fontSize: 14,
        color: '#4A5568',
        lineHeight: 20,
        fontWeight: '500',
    },
    verTodoButton: {
        alignSelf: 'flex-end',
        marginTop: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    verTodoTexto: {
        fontSize: 16,
        color: '#1D617A',
        fontWeight: '600',
    },
});
