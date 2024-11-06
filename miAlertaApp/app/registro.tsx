import React, { useState, useEffect } from "react";
import {
  View,
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
import { RootStackParamList } from "../assets/types";
import * as LocalAuthentication from "expo-local-authentication";

//componentes
import handleRegistroBiometrico from "../components/login/HuellaRegistro";
import validarDataRegistroUsuario from "../components/validaciones/validarDataRegistroUsuario";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "index"
>;

const Registro = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [pin, setPin] = useState("");
  const [huellaDactilar, setHuellaDactilar] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };
    checkBiometricSupport();
  }, []);

  const handleRegistro = async () => {
    if (!validarDataRegistroUsuario(nombre, email, numeroCelular, pin)) {
      return;
    }

    Alert.alert(
      "Registro exitoso",
      `Nombre: ${nombre}\nEmail: ${email}\nNúmero Celular: ${numeroCelular}\nCódigo PIN: ${pin}`
    );

    // Espera 2 segundos antes de navegar
    setTimeout(() => {
      navigation.navigate("index");
    }, 800);
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
        secureTextEntry
        keyboardType="numeric"
      />
      {/* Registro de huella dactilar */}
      {isBiometricSupported && (
        <TouchableOpacity
          style={styles.buttonHuella}
          onPress={() => handleRegistroBiometrico(navigation)}
        >
          <Ionicons name="finger-print" size={24} color="black" />
          <Text style={styles.buttonTextBlack}>Registrar Huella Dactilar</Text>
        </TouchableOpacity>
      )}

      {/* boton registro */}
      <TouchableOpacity
        style={styles.buttonRegistarme}
        onPress={handleRegistro}
      >
        <Text style={styles.buttonTextWhite}>Registrarme</Text>
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
