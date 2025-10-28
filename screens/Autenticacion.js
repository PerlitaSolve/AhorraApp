
///////////////////                  SCREEN 1 LOGIN 

import { Text, StyleSheet, View, Button, StatusBar } from 'react-native'// StatusBar controla la barra de estado 
import React, { useState } from 'react'

import Registro from './Registro';
import Sesion from './Sesion';

export default function App(){

    const [screen, setScreen] = useState('menu');

    switch (screen) {
        case 'registro':
            return <Registro />;
        case 'sesion':
            return <Sesion/>;
        case 'menu':   
            return (
               <View style={styles.container}>
           
                 <Text style={styles.texto}>AHORRA + APP</Text>
                 <Text style={styles.texto2}>“¡Bienvenido!{'\n'}Tu dinero, más organizado y seguro que {'\n'} nunca.”</Text>
           
                 <View style={styles.contenedorBotones}>
                 <Button color="#DBEFE1E1" onPress={() => setScreen('registro')} title='Regístrate'></Button>
                 <Button color="#1D617A" onPress={() => setScreen('sesion')} title='Iniciar sesión '></Button>
                 </View>
                 <StatusBar style="auto" />
               </View>
            );
    }
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D617A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto:{
    fontFamily:'Times New Roman',
    fontSize:30, 
    color:'white', 
    fontStyle:'italic', 
  },
  texto2:{
    fontFamily:'Courier',
    fontSize:15,
    color:'#ffffffff',
    fontWeight:'500',
    marginTop:100,
    textAlign: 'center', // alinea el texto
    
  },
  contenedorBotones:{ // nuestros botones tienen que estar dentro de View
    marginTop:100, // margen en la parte de arriba
    flexDirection:'column', // orden de botones 
    gap:15, // separacion entre elementos funciona para filas y columnas 
  },

});









