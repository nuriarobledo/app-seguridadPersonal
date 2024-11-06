import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../assets/types";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedInput } from "@/components/ThemedInput";

//componentes
import HuellaAutenticacion from "../components/login/HuellaAutenticacion";
import validarDataLogin from "@/components/validaciones/validarDataLogin";
//firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

//data
import { getUserByFirebaseId } from "@/database/database";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    if (!validarDataLogin(email, pin)) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      //Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pin
      );
      const firebaseId = userCredential.user.uid; // Obtiene el ID de Firebase
      const token = await userCredential.user.getIdToken(); //token JWT

      // almaceno token
      await AsyncStorage.setItem("userToken", token);

      // Obtiene el usuario de la base de datos local usando el firebaseId
      const user = await getUserByFirebaseId(firebaseId);

      if (user) { 
        //almaceno en asyncStorage los datos del usuario
        await AsyncStorage.setItem("userId", user.id.toString());
        await AsyncStorage.setItem("userName", user.nombre);
        console.log("Usuario recuperado:", user);

      } else {
        console.warn("No se encontró el usuario en la base de datos local");
      }
      navigation.navigate("(tabs)");
    } catch (error) {
      Alert.alert(
        "Error, la combinación de usuario y contraseña es incorrecta",
        (error as Error).message
      );
    }
  };
  const handleRegistro = () => {
    navigation.navigate("registro");
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Iniciar Sesión</ThemedText>
      <ThemedInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <ThemedInput
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />

      {/* Botón de olvidé pin */}
      <TouchableOpacity onPress={handleRegistro}>
        <ThemedText style={styles.buttonRestaurarPin}>Olvidé mi pin</ThemedText>
      </TouchableOpacity>

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <ThemedText style={styles.buttonTextWhite}>Iniciar Sesión</ThemedText>
      </TouchableOpacity>

      {/* Botón de registro */}
      <TouchableOpacity onPress={handleRegistro}>
        <ThemedText style={styles.buttonRegistro}>Registrarme</ThemedText>
      </TouchableOpacity>

      {/* Botón de inicio con huella */}
      <TouchableOpacity
        style={styles.buttonHuella}
        onPress={() => HuellaAutenticacion(navigation)}
      >
        <Ionicons name="finger-print" size={24} color="black" />
        <ThemedText style={styles.buttonTextBlack}>Iniciar con huella</ThemedText>
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
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  buttonRestaurarPin: {
    color: "#003366", // Azul oscuro
    textDecorationLine: "underline",
    textAlign: "left",
    marginTop: 0,
  },
  buttonLogin: {
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
  buttonRegistro: {
    color: "#003366", // Azul oscuro
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 20,
  },
  buttonHuella: {
    backgroundColor: "transparent",
    borderColor: "#007BBF", // azul oscuro
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 100,
  },
  buttonTextBlack: {
    color: "#000000", // negro
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;
