
///////////////////                  SCREEN OLVIDASTE CONTRASENA

import { Text, StyleSheet, View, Pressable, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { recuperarPassword } from '../services/authService';
import { initDatabase } from '../services/database';

export default function Password({ navigation, volver }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        initDatabase();
    }, []);

    const recuperarContrasena = async () => {
        if (email.trim() === '' || password.trim() === '' || conPassword.trim() === '') {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
        
        if (password !== conPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const resultado = await recuperarPassword(email, password);
            
            if (resultado.success) {
                Alert.alert('Éxito', resultado.message);
                navigation.navigate('Sesion');
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al recuperar la contraseña');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    if(loading){
        return(
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#1D617A" />
                <Text style={{marginTop: 10}}>Recuperando contraseña...</Text>
            </View>
        );
    }

    return (
                <View style={styles.container}>
                    {volver && (
                      <TouchableOpacity onPress={volver} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                      </TouchableOpacity>
                    )}
                    <View style={styles.fondoArriba}>
                        <Text style={styles.titulo}>AHORRA + APP</Text>
                    </View>

                    <View style={styles.contenido}>
                        <Text style={styles.subTitulo}>¿ Olvidaste tu contraseña ?</Text>

                        <TextInput
                            style={styles.input}
                            placeholder='Correo electrónico *'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Nueva contraseña *'
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder='Confirmar contraseña *'
                            secureTextEntry={true}
                            value={conPassword}
                            onChangeText={setConPassword}
                        />

                        <View style={styles.contenedorBotones}>
                            <Pressable style={styles.boton} onPress={() => navigation.goBack()}>
                                <Text style={styles.botonTexto}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={styles.botonPrimario} onPress={recuperarContrasena}>
                                <Text style={styles.botonTextoPrimario}>Continuar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    fondoArriba: {
        position: 'absolute',
        height: '23%',
        width: '100%',
        backgroundColor: '#1D617A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contenido: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        fontFamily: 'Times New Roman',
        fontSize: 40,
        color: '#fff',
        fontStyle: 'italic',
    },
    subTitulo: {
        fontFamily: 'Courier',
        fontSize: 20,
        color: 'black',
        marginBottom: 40,
        marginTop: 20,
    },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    input: {
        width: '70%',
        borderWidth: 2,
        borderColor: '#1D617A',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    contenedorBotones: {
        marginTop: 25,
        flexDirection: 'row',
        gap: 65,
    },
    boton: {
        backgroundColor: '#1D617A',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonPrimario: {
        backgroundColor: '#DBEFE1E1',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonTextoPrimario: {
        color: '#1D617A',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
