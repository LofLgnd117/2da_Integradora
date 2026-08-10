import React from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Recibimos 'navigation' como propiedad para poder cambiar de pantalla
export default function SplashScreen({ navigation }) {
  return (
    // SafeAreaView respeta el "notch" (la ceja de la cámara) y los bordes del celular
    <SafeAreaView className="flex-1 bg-[#839958]">
      
      {/* Esto controla la barra de estado real de tu celular (batería, señal, hora) */}
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      {/* Contenedor central para el logo y eslogan */}
      <View className="flex-1 justify-center items-center px-8">
        
        {/* LOGO */}
        <Image
          source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/3jkur8wh_expires_30_days.png" }}
          resizeMode="contain"
          // Tamaños dinámicos con Tailwind para que no se aplaste en pantallas chicas
          className="w-64 h-64 mb-8 rounded-3xl"
        />

        {/* ESLOGAN EN ESPAÑOL */}
        <Text className="text-[#F7F4D5] text-xl text-center font-medium leading-relaxed">
          Domina el arte de la cocina con miles de recetas seleccionadas.
        </Text>
        
      </View>

      {/* CONTENEDOR DE BOTONES (Fijado en la parte inferior) */}
      <View className="px-6 pb-12">
        
        <TouchableOpacity 
          // Accesibilidad: Altura mínima de 56px (min-h-[56px]) para fácil toque
          className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] mb-4 shadow-sm" 
          // Navegación real hacia la pantalla de Registro
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.8}
        >
          <Text className="text-[#F7F4D5] text-lg font-bold tracking-wide">
            Registrarse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          // Accesibilidad: Contraste y bordes claros
          className="border-2 border-[#D9D9D9]/50 rounded-2xl items-center justify-center min-h-[56px]" 
          // Navegación real hacia la pantalla de Login
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text className="text-[#F7F4D5] text-lg font-bold tracking-wide">
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}