import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";

//data
import { ContactoEmergencia } from "../../database/database";

const ContactoItem = ({
  nombre,
  celular,
  relacion,
  esPredeterminado,
  onEliminar,
  onMarkAsDefault,
}: ContactoEmergencia & {
  onEliminar: () => void;
  onMarkAsDefault: () => void;
}) => {
  // Función para realizar la llamada
  const llamarContacto = () => {
    Linking.openURL(`tel:${celular}`);
  };

  // Función para manejar la eliminación del contacto
  const handleEliminar = () => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Está seguro de que desea eliminar este contacto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            onEliminar(); // Llama a la función para eliminar el contacto
            Alert.alert("Éxito", "Contacto eliminado con éxito"); 
          },
        },
      ]
    );
  };

  // Función para manejar el marcado como predeterminado
  const handleMarkAsDefault = () => {
    onMarkAsDefault(); // Llama a la función pasada como prop
    Alert.alert(
      "Éxito",
      `Contacto ${nombre} es el seleccionado como predeterminado para enviar las alertas`,
      [{ text: "OK" }]
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.contactoContainer}
        onLongPress={handleMarkAsDefault}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.contactoNombre}>{nombre}</Text>
          <Text style={styles.contactoTelefono}>{celular}</Text>
          {/* Relación (opcional) */}
          {relacion && relacion.trim() !== "" && (
            <Text style={[styles.contactoTelefono]}>{relacion}</Text>
          )}

          {esPredeterminado == true && (
            <Text style={[styles.predeterminadoTexto]}>
              Contacto predeterminado
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={llamarContacto} style={styles.botonLlamar}>
          <Ionicons name="call-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEliminar} style={styles.botonEliminar}>
          <AntDesign name="delete" size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contactoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: "auto",
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  contactoNombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contactoTelefono: {
    fontSize: 16,
    color: "#888",
  },
  predeterminadoTexto: {
    fontSize: 14,
    color: "green",
    fontWeight: "bold",
    marginTop: 5,
  },
  botonEliminar: {
    backgroundColor: "#ff6961",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  botonLlamar: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "green",
  },
});

export default ContactoItem;
