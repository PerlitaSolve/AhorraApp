import { Text, StyleSheet, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

export default function CalendarioComparacion({ navigation, volver }) {

    const [mesSeleccionado, setMesSeleccionado] = useState(null);
    const [anio] = useState('20 Sep');

    const meses = [
        { id: 1, nombre: 'ENE', activo: true },
        { id: 2, nombre: 'FEB', activo: false },
        { id: 3, nombre: 'MAR', activo: true },
        { id: 4, nombre: 'ABR', activo: false },
        { id: 5, nombre: 'MAY', activo: false },
        { id: 6, nombre: 'JUN', activo: true },
        { id: 7, nombre: 'JUL', activo: false },
        { id: 8, nombre: 'AGO', activo: true },
        { id: 9, nombre: 'SEP', activo: true },
        { id: 10, nombre: 'OCT', activo: false },
        { id: 11, nombre: 'NOV', activo: true },
        { id: 12, nombre: 'DIC', activo: false },
    ];

    const handleMesPress = (mes) => {
        if (mes.activo) {
            setMesSeleccionado(mes.id);
            console.log('Mes seleccionado:', mes.nombre);
            // navigation?.navigate('DetalleComparacion', { mes: mes.nombre });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1D617A" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => volver ? volver() : navigation?.goBack()} style={styles.backButton}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.titulo}>AHORRA + APP</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            </View>

            {/* Título de la sección */}
            <Text style={styles.subtitulo}>"COMPARACIÓN DEL MES"</Text>

            {/* Año */}
            <View style={styles.anioContainer}>
                <Text style={styles.anioTexto}>{anio}</Text>
            </View>

            {/* Contenedor del calendario */}
            <View style={styles.calendarioContainer}>
                
                {/* Icono de calendario */}
                <View style={styles.iconoCalendarioContainer}>
                    <TouchableOpacity style={styles.iconoCalendario}>
                        <Text style={styles.iconoTexto}>📅</Text>
                    </TouchableOpacity>
                </View>

                {/* Grid de meses */}
                <View style={styles.mesesGrid}>
                    {meses.map((mes) => (
                        <TouchableOpacity
                            key={mes.id}
                            style={[
                                styles.mesBoton,
                                mes.activo ? styles.mesActivo : styles.mesInactivo,
                                mesSeleccionado === mes.id && styles.mesSeleccionado,
                            ]}
                            onPress={() => handleMesPress(mes)}
                            disabled={!mes.activo}
                        >
                            <Text style={[
                                styles.mesTexto,
                                !mes.activo && styles.mesTextoInactivo,
                            ]}>
                                {mes.nombre}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
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
        flex: 1,
    },
    menuButton: {
        padding: 5,
    },
    menuIcon: {
        fontSize: 28,
        color: 'white',
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
    anioContainer: {
        alignItems: 'flex-end',
        paddingRight: 30,
        marginBottom: 20,
    },
    anioTexto: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
    calendarioContainer: {
        flex: 1,
        backgroundColor: '#E8F4F8',
        marginHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconoCalendarioContainer: {
        position: 'absolute',
        top: -25,
        right: 20,
        zIndex: 10,
    },
    iconoCalendario: {
        backgroundColor: '#6BA5C0',
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconoTexto: {
        fontSize: 28,
    },
    mesesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    mesBoton: {
        width: '22%',
        aspectRatio: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    mesActivo: {
        backgroundColor: '#A8D5E2',
    },
    mesInactivo: {
        backgroundColor: '#E0E0E0',
    },
    mesSeleccionado: {
        backgroundColor: '#6BA5C0',
        borderWidth: 2,
        borderColor: '#1D617A',
    },
    mesTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3748',
    },
    mesTextoInactivo: {
        color: '#9CA3AF',
    },
});
