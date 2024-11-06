import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const handleRegistroBiometrico = async (navigation) => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (hasHardware && isEnrolled) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Registra tu huella dactilar",
      fallbackLabel: "Usar PIN",
    });

    if (result.success) {
      Alert.alert("Huella dactilar registrada con éxito.");
    } else {
      Alert.alert("Error", "No se pudo registrar la huella dactilar.");
    }
  } else {
    Alert.alert(
      "Error",
      "No hay hardware biométrico disponible o no hay huellas registradas."
    );
  }
};

export default handleRegistroBiometrico;
