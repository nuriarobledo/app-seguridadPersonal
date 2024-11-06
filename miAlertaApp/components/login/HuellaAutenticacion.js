import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const HuellaAutenticacion = async ( navigation) => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autenticarse con huella dactilar",
        fallbackLabel: "Usar PIN",
      });

      if (result.success) {
        // Aquí puedes navegar a la pantalla principal si la autenticación es exitosa
        navigation.navigate("(tabs)");
      } else {
        Alert.alert("Error", "No se pudo autenticar con la huella dactilar.");
      }
    } else {
      Alert.alert("Error", "No hay hardware biométrico disponible o no hay huellas registradas.");
    }
  };

export default HuellaAutenticacion;