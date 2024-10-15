import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenido ..nombre..!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Botón de Emergencia en el medio */}
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.buttonText}>Emergencia</Text>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 80,
    width: 180,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  // estilo del contenedor del botón
  buttonContainer: {
    flex: 1, 
    marginTop: 150,
    justifyContent: "center", 
    alignItems: "center", 
  },
  // estilo del botón de emergencia
  emergencyButton: {
    backgroundColor: "red",
    width: 150, 
    height: 150, 
    borderRadius: 75, 
    justifyContent: "center", 
    alignItems: "center", 
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
