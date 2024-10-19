import { Tabs } from 'expo-router';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contactosEmergencia"
        options={{
          title: 'Contactos',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name= 'contacts' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="consejosSeguridad"
        options={{
          title: 'Consejos',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name= 'Safety' size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="map-pin" size={24} color={color}/>
          ),
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
