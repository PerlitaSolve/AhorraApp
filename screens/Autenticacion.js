
///////////////////                  SCREEN 1 LOGIN 

import { Text, StyleSheet, View, StatusBar, TouchableOpacity, Pressable } from 'react-native'// StatusBar controla la barra de estado 
import React from 'react'

export default function Autenticacion({ navigation, volver }){
  return (
    <View style={styles.container}>
      {volver && (
        <TouchableOpacity onPress={volver} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.texto}>AHORRA + APP</Text>
      <Text style={styles.texto2}>"¡Bienvenido!{'\n'}Tu dinero, más organizado y seguro que {'\n'} nunca."</Text>

      <View style={styles.contenedorBoton}>
        <Pressable style={styles.botonPrimario} onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.botonTextoPrimario}>Regístrate</Text>
        </Pressable>
        <Pressable style={styles.botonSecundario} onPress={() => navigation.navigate('Sesion')}>
          <Text style={styles.botonTextoSecundario}>Iniciar sesión</Text>
        </Pressable>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D617A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
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
  contenedorBoton:{ 
    marginTop:25, 
    flexDirection:'column', 
    gap:15,
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

});









