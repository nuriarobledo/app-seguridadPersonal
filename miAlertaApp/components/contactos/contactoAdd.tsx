import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//data
import { addContactoEmergencia } from '../../database/database'; 

const AgregarContacto = ( ) => {
  const [nombre, setNombre] = useState("");
  const [celular, setCelular] = useState("");
  const [relacion, setRelacion] = useState("");
  const [idUsuario, setIdUsuario] = useState<number | null>(null);


  //obtengo ID del usuario del AsyncStorage
  useEffect(() => {
    const fetchIdUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id !== null) {
          console.log("ID del usuario:", id);
          setIdUsuario(Number(id)); // Asegúrate de convertirlo a número si es necesario
        }
      } catch (error) {
        console.error("Error al obtener el idUsuario:", error);
      }
    };

    fetchIdUsuario();
  }, []);

  const handleAgregarContacto = async () => {
    // Verifica solo si nombre, celular e idUsuario son válidos
    if (nombre && celular && idUsuario !== null) {
      const result = await addContactoEmergencia(idUsuario, nombre, celular, relacion || undefined);
      if (result) {
        console.log("Contacto agregado exitosamente");
      } else {
        console.error("Error al agregar el contacto");
      }
      // Limpiar los campos después de agregar
      setNombre("");
      setCelular("");
      setRelacion("");
    } else {
      console.error("Faltan datos necesarios");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Celular"
        value={celular}
        onChangeText={setCelular}
        placeholderTextColor="#A9A9A9"
      />
      <TextInput
        style={styles.input}
        placeholder="Relación (opcional)"
        value={relacion}
        onChangeText={setRelacion}
        placeholderTextColor="#A9A9A9"
      />
      <Button
        title="Agregar"
        onPress={handleAgregarContacto}
        color="#4fdf57"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: 300,
    color: "#000",
    padding: 10,
    marginBottom: 20,
    marginTop: 5,
  },
});

export default AgregarContacto;