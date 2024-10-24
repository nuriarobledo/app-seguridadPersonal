import React from "react";
import { View, Button, Text, Alert, StyleSheet } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const HuellaRegistro = ({ onSuccess }) => {
  const handleRegistroBiometrico = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Registra tu huella dactilar",
        fallbackLabel: "Usar PIN",
      });

      if (result.success) {
        Alert.alert("Huella dactilar registrada con éxito.");
        onSuccess(); // Llama a la función pasada como prop
      } else {
        Alert.alert("Error", "No se pudo registrar la huella dactilar.");
      }
    } else {
      Alert.alert("Error", "No hay hardware biométrico disponible o no hay huellas registradas.");
    }
  };

  return (
    <View style={styles.biometricContainer}>
      <Button title="Registrar Huella Dactilar" onPress={handleRegistroBiometrico} />
    </View>
  );
};

const styles = StyleSheet.create({
  biometricContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default HuellaRegistro;