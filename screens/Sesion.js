
///////////////////                  SCREEN DE INICIAR SESION CON USUARIO

import { Text, StyleSheet, View, TextInput, Alert, Button, StatusBar} from 'react-native'
import React, { useState } from 'react'
import Registro from './Registro';
import Egresos from './Egresos';
import Password from './Password';


export default function Sesion() {

    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [screen, setScreen] = useState('menu');

    const entrar = () =>{
        if(nombre.trim() === '' || password.trim() === '' ){
            Alert.alert("Llenar todos los campos  (movil)");
            alert("Llenar todos los campos (web)");
        }else{
            setScreen('iniciarSesion')
        }
    }

    switch (screen){
        case 'iniciarSesion':
            return <Egresos/>
        case 'registro':
            return<Registro/>
        case 'password':
            return <Password/>
        case 'menu':
            return(

                <View style={styles.container}>
            
                    <Text style={styles.titulo}>AHORRO + APP</Text> 
    
                    <TextInput
                        style={styles.input}
                        placeholder='Usuario *'
                        value={nombre}
                        onChangeText={setNombre}  
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
    contenedorBotones:{ 
        marginTop:95, 
        flexDirection:'column', 
        gap:15,
    },

})