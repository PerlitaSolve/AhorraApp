
///////////////////                  SCREEN DE INICIAR SESION CON USUARIO

import { Text, StyleSheet, View, TextInput, Alert, Pressable, StatusBar, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { iniciarSesion } from '../services/authService';
import { initDatabase } from '../services/database';
import { UserContext } from '../context/UserContext';


export default function Sesion({ navigation, volver }) {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
                setUser(resultado.usuario);
                navigation.replace('Home');
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
                    <Pressable style={styles.botonPrimario} onPress={entrar}>
                        <Text style={styles.botonTextoPrimario}>Iniciar Sesión</Text>
                    </Pressable>
                    </View>

                    <View style={styles.contenedorBotones}>
                    <Pressable style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
                        <Text style={styles.botonTextoSecundario}>Quiero registrarme</Text>
                    </Pressable>
                    <Pressable style={styles.botonSecundario} onPress={() => navigation.navigate('Password')}>
                        <Text style={styles.botonTextoSecundario}>¿Olvidaste tu contraseña?</Text>
                    </Pressable>
                    </View>

                    <StatusBar style="auto" />
                </View>  
    );
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
    botonPrimario: {
        backgroundColor: '#DBEFE1E1',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
    },
    botonTextoPrimario: {
        color: '#1D617A',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botonSecundario: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
    },
    botonTextoSecundario: {
        color: '#fff',
        fontSize: 14,
    },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
    backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
    contenedorBotones: {
        marginTop:95, 
        flexDirection:'column', 
        gap:15,
    },

})