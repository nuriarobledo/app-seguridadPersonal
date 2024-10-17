import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface AgregarContactoProps {
  agregarContacto: (nombre: string, telefono: string) => void;
}

const AgregarContacto: React.FC<AgregarContactoProps> = ({ agregarContacto }) => {
  const [nombre, setNombre] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');

  const handleAgregarContacto = () => {
    if (nombre && telefono){
    agregarContacto(nombre, telefono);
    setNombre('');
    setTelefono('');
  }
  };

  return (
    <View style={styles.container}>
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#A9A9A9"
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            placeholderTextColor="#A9A9A9"
          />
          <Button title="Agregar" onPress={handleAgregarContacto} color="#4fdf57"/>
        </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: 300,
    color: '#000',
    padding: 10,
    marginBottom: 20,
    marginTop: 5,
  },
});

export default AgregarContacto;