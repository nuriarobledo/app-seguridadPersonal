import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Button, Modal, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

//importaciones de componentes
import ContactosList from '@/components/contactos/contactosList';
import AgregarContacto from '@/components/contactos/contactoAdd';

export default function TabTwoScreen() {
  //modal para agregar contacto
  const [modalVisible, setModalVisible] = useState(false);
  const [contactos, setContactos] = useState<{ id: string; nombre: string; telefono: string }[]>([
    { id: '1', nombre: 'Juan Pérez', telefono: '123456789' },
    { id: '2', nombre: 'Ana Gómez', telefono: '987654321' },
  ]);

  const agregarContacto = (nombre: string, telefono: string) => {
    const nuevo = {
      //random hasta que este la bd
      id: Math.random().toString(),
      nombre,
      telefono,
    };
    setContactos((prevContactos) => [...prevContactos, nuevo]);
    setModalVisible(false); //cierra el modal desp de crear un contacto
  };

  const eliminarContacto = (id: string) => {
    setContactos(contactos.filter((contacto) => contacto.id !== id));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<AntDesign name="contacts" size={24} color="black" />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Contactos de Emergencia</ThemedText>
      </ThemedView>

      {/* Icono para abrir el modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="person-add-outline" size={28} color="white" />
      </TouchableOpacity>

      {/* Lista de contactos */}
      <ContactosList contactos={contactos} eliminarContacto={eliminarContacto} />


      {/* Modal para agregar contactos */}
      <Modal
        animationType="slide"
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AgregarContacto agregarContacto={agregarContacto} />

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close-outline" size={32} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#4fdf57',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff', 
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});