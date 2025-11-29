import { Text, StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

export default function Presupuesto1({ navigation, volver }) {

    const [categorias, setCategorias] = useState([
        { id: 1, nombre: 'ALIMENTACIÓN', monto: '3,500' },
        { id: 2, nombre: 'EDUCACIÓN', monto: '5,000' },
        { id: 3, nombre: 'TRANSPORTE', monto: '600' },
        { id: 4, nombre: 'SERVICIOS', monto: '1,300' },
        { id: 5, nombre: 'SALUD', monto: '2,000' },
    ]);

    const handleEdit = (id) => {
        console.log('Editar categoría:', id);
        // navigation?.navigate('EditarCategoria', { categoriaId: id });
    };

    const handleDelete = (id) => {
        setCategorias(categorias.filter(cat => cat.id !== id));
    };

    const handleAgregarCategoria = () => {
        console.log('Agregar nueva categoría');
        // navigation?.navigate('AgregarCategoria');
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
            <Text style={styles.subtitulo}>"PRESUPUESTO"</Text>

            {/* Contenedor principal */}
            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <View style={styles.presupuestoContainer}>
                    
                    {/* Encabezados */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>CATEGORÍA</Text>
                        <Text style={styles.headerText}>MONTO</Text>
                    </View>

                    {/* Lista de categorías */}
                    {categorias.map((categoria) => (
                        <View key={categoria.id} style={styles.categoriaRow}>
                            <Text style={styles.categoriaNombre}>{categoria.nombre}</Text>
                            <View style={styles.montoContainer}>
                                <Text style={styles.categoriaMontoTexto}>$ {categoria.monto} MX</Text>
                                <TouchableOpacity 
                                    onPress={() => handleEdit(categoria.id)}
                                    style={styles.iconButton}
                                >
                                    <Text style={styles.editIcon}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => handleDelete(categoria.id)}
                                    style={styles.iconButton}
                                >
                                    <Text style={styles.deleteIcon}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Botón Agregar Categoría */}
                    <TouchableOpacity 
                        style={styles.agregarButton}
                        onPress={handleAgregarCategoria}
                    >
                        <Text style={styles.agregarButtonText}>Agregar Categoría</Text>
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
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    presupuestoContainer: {
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#1D617A',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D617A',
        flex: 1,
        textAlign: 'center',
    },
    categoriaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#D0D0D0',
    },
    categoriaNombre: {
        fontSize: 15,
        color: '#2D3748',
        fontWeight: '600',
        flex: 1,
    },
    montoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    categoriaMontoTexto: {
        fontSize: 15,
        color: '#2D3748',
        fontWeight: '500',
        marginRight: 10,
    },
    iconButton: {
        marginLeft: 8,
        padding: 5,
    },
    editIcon: {
        fontSize: 20,
    },
    deleteIcon: {
        fontSize: 20,
    },
    agregarButton: {
        backgroundColor: '#A8D5E2',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    agregarButtonText: {
        fontSize: 16,
        color: '#1D617A',
        fontWeight: '600',
    },
});
