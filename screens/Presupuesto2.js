import { Text, StyleSheet, View, StatusBar, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';

export default function Presupuesto2({ navigation }) {

    const [moneda, setMoneda] = useState('MX');
    const [categorias, setCategorias] = useState([
        { id: 1, nombre: 'ALIMENTACIÓN', monto: '' },
        { id: 2, nombre: 'EDUCACIÓN', monto: '' },
        { id: 3, nombre: 'TRANSPORTE', monto: '' },
        { id: 4, nombre: 'SERVICIOS', monto: '' },
        { id: 5, nombre: 'SALUD', monto: '' },
    ]);

    const handleMontoChange = (id, valor) => {
        setCategorias(categorias.map(cat => 
            cat.id === id ? { ...cat, monto: valor } : cat
        ));
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
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
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
                
                {/* Instrucción */}
                <Text style={styles.instruccion}>
                    DEFINA UN PRESUPUESTO{'\n'}PARA CADA CATEGORÍA
                </Text>

                {/* Selector de moneda */}
                <View style={styles.monedaContainer}>
                    <TouchableOpacity style={styles.monedaSelector}>
                        <Text style={styles.monedaText}>{moneda}</Text>
                        <Text style={styles.monedaArrow}>▼</Text>
                    </TouchableOpacity>
                </View>

                {/* Formulario de categorías */}
                <View style={styles.formularioContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerText}>CATEGORÍA</Text>
                        <Text style={styles.headerText}>MONTO</Text>
                    </View>

                    {categorias.map((categoria) => (
                        <View key={categoria.id} style={styles.categoriaRow}>
                            <View style={styles.categoriaInput}>
                                <Text style={styles.categoriaNombre}>{categoria.nombre}</Text>
                            </View>
                            <View style={styles.montoInputContainer}>
                                <Text style={styles.simboloPeso}>$</Text>
                                <TextInput
                                    style={styles.montoInput}
                                    value={categoria.monto}
                                    onChangeText={(valor) => handleMontoChange(categoria.id, valor)}
                                    placeholder=""
                                    keyboardType="numeric"
                                    placeholderTextColor="#A0AEC0"
                                />
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
        marginBottom: 20,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    instruccion: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
        lineHeight: 24,
    },
    monedaContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
        paddingRight: 10,
    },
    monedaSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        minWidth: 80,
        justifyContent: 'space-between',
    },
    monedaText: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '600',
        marginRight: 10,
    },
    monedaArrow: {
        fontSize: 12,
        color: '#2D3748',
    },
    formularioContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        marginBottom: 15,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        textAlign: 'center',
    },
    categoriaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    categoriaInput: {
        flex: 1,
        backgroundColor: '#E8F4F8',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    categoriaNombre: {
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '600',
        textAlign: 'center',
    },
    montoInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    simboloPeso: {
        fontSize: 16,
        color: '#2D3748',
        fontWeight: '600',
        marginRight: 5,
    },
    montoInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#2D3748',
        fontWeight: '500',
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
