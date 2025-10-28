
///////////////////                  SCREEN OLVIDASTE CONTRASENA

import { Text, StyleSheet, View, Button, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import Sesion from './Sesion';

export default function Password() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [screen, setScreen] = useState('registro'); 

    const registrarme = () => {
        if (email.trim() === '' || password.trim() === '' || conPassword.trim() === '') {
            Alert.alert("Llenar todos los campos (móvil)");
            alert("Llenar todos los campos (web)");
        } else if (password !== conPassword) {
            Alert.alert('Error \nLas contraseñas no coinciden');
            alert('Error \nLas contraseñas no coinciden');
        } else {
            Alert.alert('Registro exitoso');
            setScreen('sesion'); 
        }
    };


    switch (screen) {
        case 'sesion':
            return <Sesion />;
        case 'registro':
            return (
                <View style={styles.container}>
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
                            <Button color='#1D617A' title='Cancelar' onPress={() => setScreen('sesion')} />
                            <Button color="#DBEFE1E1" onPress={registrarme} title='Continuar' />
                        </View>
                    </View>
                </View>
            );
    }
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
});
