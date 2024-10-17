import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';
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
  const [contactos, setContactos] = useState<{ id: string; nombre: string; telefono: string }[]>([
    { id: '1', nombre: 'Juan Pérez', telefono: '123456789' },
    { id: '2', nombre: 'Ana Gómez', telefono: '987654321' },
  ]);

  const agregarContacto = (nombre: string, telefono: string) => {
    const nuevo = {
      id: Math.random().toString(),
      nombre,
      telefono,
    };
    setContactos((prevContactos) => [...prevContactos, nuevo]);
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
      
      {/* Lista de contactos */}
      <ContactosList contactos={contactos} eliminarContacto={eliminarContacto} />
      
      {/* Componente para agregar contactos */}
      <AgregarContacto agregarContacto={agregarContacto} />

      
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
});