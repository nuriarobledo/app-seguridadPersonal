import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, TouchableOpacity } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../assets/types";

type ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "funciones"
>;

export default function FuncionesScreen() {
  const navigation = useNavigation<ScreenNavigationProp>();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Funciones</ThemedText>
      </ThemedView>

      {/* Botón para navegar a mapa.tsx */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("mapa")}
      >
        <ThemedText style={styles.buttonText}>Mapa</ThemedText>
      </TouchableOpacity>

      {/* Botón para navegar a consejosSeguridad.tsx */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("consejosSeguridad")}
      >
        <ThemedText style={styles.buttonText}>Consejos de seguridad</ThemedText>
      </TouchableOpacity>

      {/* Botón para navegar a llamadaFalsa.tsx */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("llamadaFalsa")}
      >
        <ThemedText style={styles.buttonText}>Llamada Falsa</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#007BFF", 
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10, 
  },
  buttonText: {
    color: "#FFFFFF", 
    fontSize: 16,
  },
});
