import { Text, StyleSheet, View, ImageBackground, Image, Button, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';



export default function EditarTrans() {
  const [tipo, setTipo]=useState('GASTO');
  const Guardar=()=>{
      Alert.alert("Los cambios han sido guardados");
      alert("Los cambios han sido guardados");
  }

    return (
      <ImageBackground style={styles.background} source={require('../assets/FEdita.png')}>
        <View style={styles.container}>
            <Image source={require('../assets/L-SFon.png')} style={styles.logo}/>
            <Text style={styles.titulo}>Editar Transacción</Text>
            <Text style={styles.subtitulos}>Fecha</Text>

            <View style={styles.fecha}>
            <TextInput
              style={[styles.input2]}
              placeholder="15/Septiembre/2025"
              placeholderTextColor="#003d4d"
            />
            <Ionicons name="calendar-outline" size={24} color="#52b8d5ff" style={styles.iconos} />
            </View>

            <Text style={styles.subtitulos}>Tipo de Movimiento</Text>

            <View style={styles.botones}>
              <TouchableOpacity
                style={[ styles.tipoBtn,
                  { backgroundColor: tipo === 'INGRESO' ? '#7bdcb5' : '#dce5e8' } ]}
                onPress={() => setTipo('INGRESO')}
              >
                <Text style={styles.Texto}>INGRESO</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tipoBtn,
                  { backgroundColor: tipo === 'GASTO' ? '#7bdcb5' : '#dce5e8' }]}
                onPress={() => setTipo('GASTO')}
              >
                <Text style={styles.Texto}>GASTO</Text>
              </TouchableOpacity>
            </View>
            
            <View/>
            <Text style={styles.subtitulos}>Cantidad</Text>
            <TextInput style={styles.input} placeholder="Monto" keyboardType="numeric" />

            <Text style={styles.subtitulos}>Categoría</Text>
            <TextInput style={styles.input} placeholder="Categoría" />
            <Text style={styles.subtitulos}>Descripción</Text>
            <TextInput style={styles.input} placeholder="Descripción" />

            <View style={styles.botones}>
            <Button style={styles.boton} color='#4c79e3ce' title="Guardar cambios" onPress={Guardar}/>
            </View>
        </View>
      </ImageBackground>
    )
}

const styles = StyleSheet.create({
  background: {
        flex:1,
        width:'100%',
        height:'100%',
    },
    container: {
        flex: 1,
        padding: 16,
        alignContent:'center',
        alignItems:'center',
    },
     nombre: {  
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily:'Italic',
        color: '#fff',
    },
    iconos: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
        fontFamily:'Italic',
        color: '#fff',
    },
    input:{
        width: '50%',
        borderWidth:2,
        borderColor:'#d0d0d0ff',
        borderRadius:8,
        padding:10,
        marginBottom:10,
        backgroundColor: '#f1eeeec1',
        fontFamily:'Italic',
    },
    input2:{
        width: '60%',
        flex: 1,
        borderWidth:2,
        borderColor:'#d0d0d0ff',
        borderRadius:8,
        padding:10,
        marginBottom:10,
        backgroundColor: '#f1eeeec1',
        fontFamily:'Italic',
        alignItems:'center',
        alignContent:'center',
    },
    subtitulos:{
        color: '#fff',
        fontFamily:'Italic',
    },
    logo:{
        width:80, 
        height:80, 
        marginBottom:10,
        flexDirection: 'row',
    },
    botones:{
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'center', 
        alignItems: 'center',    
        gap: 15,

    },
    tipoBtn: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 5,
        padding: 20,
        marginTop:8,
        width: 120,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Texto: {
        textAlign: 'center',
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#003d4d',
                 
    },
    boton:{
        marginTop: 10,
        borderRadius: 50,
        padding: 12,
        alignItems: 'center',
        fontFamily:'Italic',     
    },
    fecha:{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:10,
    },
})