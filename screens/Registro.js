
///////////////////                  SCREEN DE REGISTRARSE 

import { Text, StyleSheet, View, Button, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'
import React,{useState, useEffect} from 'react'
import Autenticacion from './Autenticacion';
import Egresos from './Egresos';
import { registrarUsuario } from '../services/authService';
import { initDatabase } from '../services/database';

export default function Registro({ volver }) {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setconPassword] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [screen, setScreen] = useState('registro');
    const [loading, setLoading] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        initDatabase();
    }, []);

    const registrarme = async () => {
        // Validación de campos vacíos
        if(nombre.trim() === '' || password.trim() === '' || telefono.trim()=== '' || email.trim()=== ''|| conPassword.trim()=== ''){
            Alert.alert("Error", "Todos los campos son obligatorios");
            return;
        }
        
        // Validación de contraseñas coinciden
        if (conPassword !== password){
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        
        try {
            // Registrar usuario en la base de datos
            const resultado = await registrarUsuario(nombre, email, password, telefono);
            
            if (resultado.success) {
                Alert.alert('Éxito', resultado.message);
                setUsuarioId(resultado.userId);
                setScreen('egresos');
            } else {
                Alert.alert('Error', resultado.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al registrar el usuario');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if(screen === 'egresos'){
        return<Egresos usuarioId={usuarioId} />;
    }
    if(screen === 'cancelar'){
        return<Autenticacion/>;
    }
    
    if(loading){
        return(
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#1D617A" />
                <Text style={{marginTop: 10}}>Registrando usuario...</Text>
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
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backArrow: { fontSize: 30, color: 'white', fontWeight: 'bold' },
})




