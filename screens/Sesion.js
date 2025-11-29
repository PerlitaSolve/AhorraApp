
///////////////////                  SCREEN DE INICIAR SESION CON USUARIO

import { Text, StyleSheet, View, TextInput, Alert, Button, StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useState, useEffect } from 'react'
import Registro from './Registro';
import Egresos from './Egresos';
import Password from './Password';
import { iniciarSesion } from '../services/authService';
import { initDatabase } from '../services/database';


export default function Sesion({ volver }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [screen, setScreen] = useState('menu');
    const [loading, setLoading] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        initDatabase();
    }, []);

    const entrar = async () =>{
        if(email.trim() === '' || password.trim() === '' ){
            Alert.alert("Error", "Por favor llena todos los campos");
            return;
        }

        setLoading(true);

        try {
            const resultado = await iniciarSesion(email, password);
            
            if (resultado.success) {
                Alert.alert('Bienvenido', `Hola ${resultado.usuario.nombre}`);
                setUsuarioActual(resultado.usuario);
                setScreen('iniciarSesion');
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    switch (screen){
        case 'iniciarSesion':
            return <Egresos usuarioId={usuarioActual?.id} usuario={usuarioActual} />
        case 'registro':
            return<Registro/>
        case 'password':
            return <Password/>
        case 'menu':
            if(loading){
                return(
                    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={{marginTop: 10, color: '#fff'}}>Iniciando sesión...</Text>
                    </View>
                );
            }

            return(

                <View style={styles.container}>
                    {volver && (
                      <TouchableOpacity onPress={volver} style={styles.backButton}>
                        <Text style={styles.backArrow}>←</Text>
                      </TouchableOpacity>
                    )}
            
                    <Text style={styles.titulo}>AHORRO + APP</Text> 
    
                    <TextInput
                        style={styles.input}
                        placeholder='Email *'
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <TextInput
                        style={styles.input}
                        placeholder='Contraseña *'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}      
                    /> 

                    <View style={styles.contenedorBoton}>
                    <Button color="#DBEFE1E1" onPress={entrar} title='Iniciar Sesion'></Button>
                    </View>

                    <View style={styles.contenedorBotones}>
                    <Button color="#1D617A" onPress={() => setScreen('registro')} title='Quiero registrarme '></Button>
                    <Button color="#1D617A" onPress={() => setScreen('password')} title='¿ Olvidaste tú contraseña ? '></Button>
                    </View>

                    <StatusBar style="auto" />
                </View>  
            );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1D617A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo:{
        fontFamily: 'Times New Roman',
        fontSize:40,
        color:'#fff',
        marginBottom:70,
        fontStyle:'italic', 
    },
    
    input:{
        width:'50%',//ocupa el ancho disponible 
        borderWidth:2,//Grosor del borde
        borderColor:'#1D617A',//color del borde
        borderRadius:8,//para los bordes redondeados
        padding:10,//espacio interno dentro del input
        marginBottom:20,//espacio esntre cada campo
        backgroundColor:'#fff'//color fondo
    },
    contenedorBoton:{ 
        marginTop:25, 
        flexDirection:'column', 
    },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    contenedorBotones: {
        marginTop:95, 
        flexDirection:'column', 
        gap:15,
    },

})