import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen({ navigation }) {
  // Estados para los campos de texto
  const [firstName, setFirstName] = useState('Leonardo');
  const [lastName, setLastName] = useState('Flores');
  const [website, setWebsite] = useState('https://github.com/leoflores');
  const [about, setAbout] = useState('Estudiante de TI apasionado por el desarrollo de software y la buena comida. Cocinando desde Durango.');

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      {/* ENCABEZADO DE NAVEGACIÓN */}
      <View className="flex-row items-center px-6 py-4 border-b border-[#F7F4D5]/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Text className="text-black text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-black text-xl font-bold flex-1 text-center mr-10">
          Editar Perfil
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* FOTO DE PERFIL */}
        <View className="items-center mb-8">
          <Text className="text-black text-base font-bold mb-4 self-start">Foto de Perfil</Text>
          <TouchableOpacity className="relative">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0afafy0_expires_30_days.png" }}
              className="w-24 h-24 rounded-full border-2 border-[#0A3323]"
            />
            {/* Ícono de cámara sobrepuesto */}
            <View className="absolute bottom-0 right-0 bg-[#0A3323] w-8 h-8 rounded-full items-center justify-center border-2 border-[#839958]">
              <Text className="text-[#F7F4D5] text-xs">📷</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN DEL PERFIL */}
        <Text className="text-black text-base font-bold mb-4">Información Personal</Text>
        
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-[#F7F4D5] text-sm font-bold mb-2">Nombre</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[#F7F4D5] text-sm font-bold mb-2">Apellidos</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-[#F7F4D5] text-sm font-bold mb-2">Sitio Web / Portafolio</Text>
          <TextInput
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            autoCapitalize="none"
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-8">
          <Text className="text-[#F7F4D5] text-sm font-bold mb-2">Sobre mí</Text>
          <TextInput
            value={about}
            onChangeText={setAbout}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[100px]"
          />
        </View>

        {/* BOTÓN ACTUALIZAR */}
        <TouchableOpacity 
          className="bg-[#0A3323] rounded-xl py-4 items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-[#F7F4D5] text-base font-bold">Actualizar Perfil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}