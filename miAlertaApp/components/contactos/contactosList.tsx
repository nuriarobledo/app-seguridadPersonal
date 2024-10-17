import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import ContactoItem from './contactoItem';

interface Contacto {
  id: string;
  nombre: string;
  telefono: string;
}

interface ContactosListProps {
  contactos: Contacto[];
  eliminarContacto: (id: string) => void;
}

const ContactosList: React.FC<ContactosListProps> = ({ contactos, eliminarContacto }) => {
  return (
    <FlatList
      data={contactos}
      renderItem={({ item }) => (
        <ContactoItem
          nombre={item.nombre}
          telefono={item.telefono}
          onEliminar={() => eliminarContacto(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={styles.mensajeVacio}>No hay contactos de emergencia</Text>}
    />
  );
};

const styles = StyleSheet.create({
  mensajeVacio: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 20,
  },
});

export default ContactosList;
