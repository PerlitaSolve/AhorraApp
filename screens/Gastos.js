import React from 'react';
import { View, Text, StyleSheet, SafeAreaViewBase, ScrollView, TouchableOpacity } from 'react-native';


export default function Gastos(){
const Gastos = () => {
    const categorias = [
        {nombre: ' Educación', monto: '$5.000', color : '#1E90FF'},
        {nombre: 'Servicio', monto: '$220', color : '#32CD32'},
        {nombre: 'Salud', monto: '$150', color : '#FF4500'},
        {nombre: 'Transporte', monto: '$50', color : '#FFD700'},
    ];

    return (
        <SafeAreaViewBase style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>AHORRA + APP</Text>
                <Text style={styles.balanceTitle}>Saldo disponible</Text>
                <Text style={styles.balanceAmount}>$ 10.000</Text>

                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                        <Text style={styles.tabTextActive}>EGRESOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>INGRESOS</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.timeFilter}>
                    <Text style={styles.timeFilterText}>Semana</Text>
                    <Text style={styles.timeFilterText}>Mes</Text>
                    <Text style={styles.timeFilterText}>Año</Text>
                </View>

                <Text style={styles.mounhTitle}>SEPTIEMBRE</Text>

                <View style={styles.chartPlaceholder}>
                   <PieChartPlaceholder />
                   <Text style={styles.chartText}>Gráfico circular (SEPTIEMBRE)</Text>
                </View>

                {categorias.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <Text style={[styles.colorDot, {backgroundColor: item.color}]}></Text>
                        <Text style={styles.listItemText}>{item.nombre}</Text>
                        <Text style={styles.listItemAmount}>{item.monto}</Text>
                    </View>

                ))}

                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Añadir +</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaViewBase>
    )
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#004A77',
        padding: 20,
        paddingBottom: 50,
    },
    headerText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    balanceText: {
        color: '#B0E0E6',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    balanceAmount: {
        color: '#FFF',
        fontSize: 32,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    tabTextActive: {
        color: '#B0E0E6',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    timeFilter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        paddingBottom: 10,
    },
    timeFilterText: {
        color: '#888',
        fontSize: 16,
    },
    filterTextActive: {
        color: '#004A77',
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: '#004A77',
    },
    mounhTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    chartPlaceholder: {
        height: 180,
        borderRadius: 90,
        backgroundColor: '#ADD8E6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    chartText: {
        color: '#555',
        fontSize: 16,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    listItemAmount: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#004A77',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});