import { Alert } from "react-native";

const validarDataLogin = (email, pin) => {
if (!email || !pin) {
    Alert.alert("Error", "Por favor, complete todos los campos.");
    return;
  }
  // Validación del formato del correo electrónico
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    Alert.alert("Error", "Por favor ingresa un correo electrónico válido.");
    return;
  }

  // Validación de la longitud del PIN
  if (pin.length < 4 || pin.length > 6) {
    Alert.alert("Error", "La contraseña debe tener entre 4 y 6 dígitos.");
    return;
  }
  return true; // Si todas las validaciones pasan
};

export default validarDataLogin;