import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../assets/types'; 

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'index'>;

const Registro = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [pin, setPin] = useState('');

    const handleRegistro = () => {
        Alert.alert('Registro exitoso', `Nombre: ${nombre}\nEmail: ${email}\nNúmero Celular: ${numeroCelular}\nCódigo PIN: ${pin}`);

        // espera 2 segundos antes de navegar
        setTimeout(() => {
            navigation.navigate('index'); 
        }, 800); // 2000 ms = 2 segundos
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Número Celular"
                value={numeroCelular}
                onChangeText={setNumeroCelular}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Código PIN"
                value={pin}
                onChangeText={setPin}
                keyboardType="phone-pad"
            />
            <Button title="Registrarme" onPress={handleRegistro} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
    },
});

export default Registro;