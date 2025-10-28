
///////////////////                  SCREEN DE REGISTRARSE 

import { Text, StyleSheet, View, Button, TextInput, Alert } from 'react-native'
import React,{useState} from 'react'
import Autenticacion from './Autenticacion';
import Egresos from './Egresos';

export default function Registro() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setconPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [screen, setScreen] = useState('registro');

    const registrarme = () => {
        if(nombre.trim() === '' || password.trim() === '' || telefono.trim()=== '' || email.trim()=== ''|| conPassword.trim()=== ''){
            Alert.alert("Llenar todos los campos  (movil)");
            alert("Llenar todos los campos (web)");
        } else if (conPassword != password){
            //alert para movil
            Alert.alert('Error \n' + 'Las contraseñas no coinciden');
            //alert para web
            alert('Error \n' + 'Las contraseñas no coinciden');
        }else{
            setScreen('egresos');
        }
    }

    if(screen === 'egresos'){
        return<Egresos />;
    }
    if(screen === 'cancelar'){
        return<Autenticacion/>;
    }
    

    return(
        <View style={styles.container}>
            <View style={styles.fondoArriba}>
                <Text style= {styles.titulo}>AHORRA + APP</Text>
            </View>
            <View style={styles.fondoAbajo}></View>

         <View style={styles.contenido}>
            <Text style= {styles.subTitulo}>Inicia tu registro</Text>
            <Text style={styles.etiquetas}>Nombre: </Text>
            <TextInput
                style={styles.input}
                placeholder='Correo electronico *'
                value={email}
                onChangeText={setEmail}
                keyboardType='email-address'
            
            />

            <TextInput
                style={styles.input}
                placeholder='Crear contraseña *'
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            
            />
            
            <TextInput
                style={styles.input}
                placeholder='Confirmar contraseña *'
                secureTextEntry={true}
                value={conPassword}
                onChangeText={setconPassword}
            />
            
            <TextInput
                style={styles.input}
                placeholder='Nombre Usuario *'
                value={nombre}
                onChangeText={setNombre}
            
            />
            
            <TextInput
                style={styles.input}
                placeholder='Numero de telefono *'
                keyboardType='phone-pad'
                value={telefono}
                onChangeText={setTelefono}
            
            />

            <Text style= {styles.politica}>Acepto el aviso de privacidad y{'\n'} la Jurisdiccion aplicable.</Text>

            <View style={styles.contenedorBotones}>
                <Button color='#1D617A' title='Cancelar' onPress={() => setScreen('cancelar')} />
                <Button color='#1D617A' title='Registrarme' onPress={registrarme}/>
            </View>
         </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor:'#fff',
    },
    
    fondoArriba:{
        position:'absolute',// fondo azul pegado a arriba
        height:'23%',// espacio que ocupa verticalmente 
        width:'100%',// espacio que ocupa horizontalmente
        backgroundColor:'#1D617A',
        alignItems:'center',// alinear el texto 
        justifyContent:'center',
   
    },
    fondoAbajo:{
        posistion:'absolute',
        top:0,
        height:'25%',
        width:'100%',
        backgroundColor:'white',
        zIndex:-1,
    },
    contenido:{
        flex:1,
        alignItems:'center',
        marginTop:1,
        justifyContent:'center',
    },
    titulo:{
        fontFamily: 'Times New Roman',
        fontSize:40,
        color:'#fff',
        marginTop:'40',
        marginBottom:10,
        fontStyle:'italic', 
    },
    subTitulo:{
        fontFamily: 'Courier',
        fontSize:20,
        color:'black',
        marginBottom:10,
        marginTop:1,
    },
    politica:{
        fontFamily: 'Courier',
        fontSize:10,
        color:'black',
        marginBottom:20,
        marginTop:40,
    },
    etiquetas:{
        fontSize: 16,
        marginBottom:5,
        marginTop:10,
    },
    input:{
        width:'50%',//ocupa el ancho disponible 
        borderWidth:2,//Grosor del borde
        borderColor:'#1D617A',//color del borde
        borderRadius:8,//para los bordes redondeados
        padding:10,//espacio interno dentro del input
        marginBottom:10,//espacio esntre cada campo
        backgroundColor:'#fff'//color fondo
    },
    contenedorBotones:{ 
    marginTop:25, 
    flexDirection:'row', 
    gap:65, 
  },
})




