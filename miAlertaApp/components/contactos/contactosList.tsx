import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import ContactoItem from "../contactos/contactoItem";

//data
import {
  ContactoEmergencia,
  deleteContactoEmergencia,
  updateContactoPredeterminado,
} from "../../database/database";

interface ContactosListProps {
  listado: ContactoEmergencia[];
  onRefresh: () => void; // prop para recargar
}

export default function ContactosList({ listado, onRefresh }: ContactosListProps) {
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  useEffect(() => {
    const fetchIdUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id !== null) {
          setIdUsuario(Number(id));
        }
      } catch (error) {
        console.error("Error al obtener el idUsuario:", error);
      }
    };

    fetchIdUsuario();
  }, []);

  // Función para marcar un contacto como predeterminado
  const marcarComoPredeterminado = async (id: number) => {
    try {
      await updateContactoPredeterminado(true, id); // Marcar este contacto como predeterminado
      console.log(`Contacto ${id} marcado como predeterminado`);
    } catch (error) {
      console.error("Error al marcar el contacto como predeterminado:", error);
    }
  };

  // Función para eliminar un contacto
  const eliminarContacto = async (id: number) => {
    try {
      // Llamar a la función deleteContactoEmergencia para eliminarlo de la base de datos
      const success = await deleteContactoEmergencia(id);
      if (success) {
        onRefresh(); // Llama a la función de refresco después de eliminar
        console.log("Contacto eliminado con éxito");
      } else {
        console.log("Error al eliminar el contacto");
      }
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
    }
  };

  useEffect(() => {
    onRefresh(); 
  }, [onRefresh]);

  return (
    <ScrollView
      contentContainerStyle={listado.length === 0 && styles.containerVacio}
    >
      {/* Mostrar mensaje si no hay contactos */}
      {listado.length === 0 ? (
        <Text style={styles.mensajeVacio}>No hay contactos de emergencia</Text>
      ) : (
        listado.map((item) => (
          <ContactoItem
            key={item.id}
            nombre={item.nombre}
            celular={item.celular}
            relacion={item.relacion ? item.relacion : ""}
            esPredeterminado={item.esPredeterminado}
            onEliminar={() => eliminarContacto(item.id)}
            onMarkAsDefault={() => marcarComoPredeterminado(item.id)}
            id={item.id}
            idUsuario={idUsuario!}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerVacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mensajeVacio: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 20,
  },
  contactoItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactoContent: {
    flex: 1,
    marginRight: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  telefono: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
});
