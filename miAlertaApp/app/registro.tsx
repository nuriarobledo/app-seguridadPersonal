import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";
import { RootStackParamList } from "../assets/types";
import SHA256 from "crypto-js/sha256";

//firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//componentes
import validarDataRegistroUsuario from "../components/validaciones/validarDataRegistroUsuario";

//data
import { addUsuario } from "../database/database";
type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

const Registro = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [pin, setPin] = useState("");


  const handleRegistro = async () => {
    if (!validarDataRegistroUsuario(nombre, email, celular, pin)) {
      return;
    }
     // Hashear la contraseña
     const pinHash = SHA256(pin).toString();

     try {
      // Inicializar Firebase Auth
      const auth = getAuth();

      // Crea el usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pin
      );
      const firebaseId = userCredential.user.uid; // Obtiene el firebaseId

      // Agrega el usuario a la base de datos local, incluyendo el firebaseId
      const success = await addUsuario(
        nombre,
        email,
        Number(celular),
        pinHash,
        firebaseId
      );
      if (!success) {
        Alert.alert(
          "Error",
          "El usuario fue registrado en Firebase, pero no se pudo guardar en la base de datos local."
        );
        return;
      }

      Alert.alert(
        "Registro exitoso",
        `Nombre: ${nombre}\nEmail: ${email}\nNúmero Celular: ${celular}`
      );

      // Espera 2 segundos antes de navegar
      setTimeout(() => {
        navigation.navigate("index");
      }, 800);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo registrar el usuario. " + (error as Error).message
      );
    }
};

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Registro</ThemedText>
      <ThemedInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <ThemedInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <ThemedInput
        placeholder="Número Celular"
        value={celular}
        onChangeText={setCelular}
        keyboardType="phone-pad"
      />
      <ThemedInput
        placeholder="Código PIN"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      {/* boton registro */}
      <TouchableOpacity
        style={styles.buttonRegistarme}
        onPress={handleRegistro}
      >
        <ThemedText style={styles.buttonTextWhite}>Registrarme</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  buttonRegistarme: {
    backgroundColor: "#007BFF", // celeste
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  buttonTextWhite: {
    color: "#FFFFFF", // blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonHuella: {
    backgroundColor: "transparent",
    borderColor: "#007BBF", // azul oscuro
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  buttonTextBlack: {
    color: "#000000", // negro
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Registro;
