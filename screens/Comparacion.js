import React from 'react';
import { View, Text, StyleSheet, SafetyAreaView, ScrollView } from 'react-native';
import { BarChart} from 'react-native-chart-kit';


export default function Comparacion(){
const Comparacion = () => {
    const data = {
        labels: ['INGRESOS', 'GASTOS'],
        datasets: [
            {
                data: [1800, 5200],
                colors: [() => '#66CDAA', () => '#FF4500'],
            },
        ],
};
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.simpleHeader}>
                <Text style={styles.headerText}>AHORRA + APP</Text>
            </View>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>COMPARACIÓN DE INGRESOS Y GASTOS</Text>
                <Text style={styles.mounthName}>SEPTIEMBRE</Text>

                <View style={styles.chartArea}>
                    <Text style={styles.chartText}>Gráfico de Barras</Text>
                    <View style={styles.legend}>
                        <Text style={styles.legendItem}><View style={[styles.colorBox, {backgroundColor: '#66CDAA'}]}></View> INGRESOS</Text>
                        <Text style={styles.legendItem}><View style={[styles.colorBox, {backgroundColor: '#FF4500'}]}></View> GASTOS</Text>
                    </View>
                </View>

                <View style={styles.alertBox}>
                    <Text style={styles.alertText}>¡Atención! Tus gastos superan tus ingresos este mes.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
}

const styles = StyleSheet.create({
    title:{
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#004A77',
    },
    mounthName:{
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    chartArea:{
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'center',
        height: 300,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 10,
    },
    legend:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 10,
    },
    legendItem:{
        fontSize: 14,
    },
    alertBox:{
        backgroundColor: '#FFF0F0',
        borderColor: '#FF4500',
        borderWidth: 1,
        padding: 15,
        borderRadius: 8,
    },
    alertText:{
        color: '#555',
    fontSize: 15,
    },
});