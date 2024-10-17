import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface AgregarContactoProps {
  agregarContacto: (nombre: string, telefono: string) => void;
}

const AgregarContacto: React.FC<AgregarContactoProps> = ({ agregarContacto }) => {
  const [nombre, setNombre] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const handleAgregarContacto = () => {
    if (nombre && telefono){
    agregarContacto(nombre, telefono);
    setNombre('');
    setTelefono('');
    setIsAdding(false); //oculta formulario
  }
  };

  return (
    <View style={styles.container}>
      {isAdding ? (
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
          <Button title="Agregar Contacto" onPress={handleAgregarContacto} color="#4fdf57"/>
          <Button title="Cancelar" onPress={() => setIsAdding(false)} color="#f24022" />
        </>
      ) : (
        <Button title="Agregar Contacto" onPress={() => setIsAdding(true)} color="#4fdf57" />
      )}
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
    color: '#000',
    padding: 10,
    marginBottom: 10,
  },
});

export default AgregarContacto;