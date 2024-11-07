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
  getContactoEmergenciaByIdUser,
  deleteContactoEmergencia,
  updateContactoPredeterminado,
} from "../../database/database";

export default function ContactosList({}) {
  const [listado, setListadoContactoEmergencia] = useState<
    ContactoEmergencia[]
  >([]); // almacena los contactos
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  const obtenerContactosEmergencia = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id !== null) {
        setIdUsuario(Number(id));
        // Usa el firebaseId para obtener los hábitos
        const listado = await getContactoEmergenciaByIdUser(Number(id));
        console.log("Listado de contacto de emergencia obtenidos:", listado);
        if (listado && listado.length > 0) {
          setListadoContactoEmergencia(listado); // Establece los hábitos
        } else {
          console.warn("No existen contactos de emergencia para este usuario");
        }
      } else {
        console.warn("No se encontró ningún ID de Firebase en AsyncStorage");
      }
    } catch (error) {
      console.error("Error al cargar los contactos de emergencia:", error);
    }
  };

  useEffect(() => {
    obtenerContactosEmergencia();
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
        // Si la eliminación fue exitosa, actualizar el listado
        setListadoContactoEmergencia((prevListado) =>
          prevListado.filter((item) => item.id !== id)
        );
        console.log("Contacto eliminado con éxito");
      } else {
        console.log("Error al eliminar el contacto");
      }
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
    }
  };

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
