import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../assets/types";
import * as LocalAuthentication from "expo-local-authentication";

//componentes
import HuellaRegistro from "../components/login/HuellaRegistro";

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
        <HuellaRegistro onSuccess={() => setHuellaDactilar(huellaDactilar)} />
      )}

      {/* boton registro */}
      <Button title="Registrarme" onPress={handleRegistro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
});

export default Registro;
