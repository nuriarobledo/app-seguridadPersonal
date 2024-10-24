import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../assets/types";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    // Credenciales hardcodeadas
    const hardcodedEmail = "usuario@example.com";
    const hardcodedPin = "1234";

    if (email === hardcodedEmail && pin === hardcodedPin) {
      // Navegar a la pantalla de inicio
      navigation.navigate("(tabs)");
    } else {
      // Mostrar un mensaje de error
      Alert.alert("Error", "Usuario o pin incorrectos");
    }
  };

  const handleRegistro = () => {
    navigation.navigate("registro");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Botón de registro */}
      <TouchableOpacity onPress={handleRegistro}>
        <Text style={styles.buttonRegistro}>Registrarme</Text>
      </TouchableOpacity>
    </View>
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
  buttonLogin: {
    backgroundColor: "#007BFF", //celeste
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
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
});

export default Login;
