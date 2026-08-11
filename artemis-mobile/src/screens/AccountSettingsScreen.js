import React, { useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, Modal, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountSettingsScreen({ navigation }) {
  const [email, setEmail] = useState('leonardo.flores@utd.edu.mx');
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      {/* ENCABEZADO DE NAVEGACIÓN */}
      <View className="flex-row items-center px-6 py-4 border-b border-[#F7F4D5]/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Text className="text-black text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-black text-xl font-bold flex-1 text-center mr-10">
          Ajustes de Cuenta
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN: CORREO ELECTRÓNICO */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-4">Correo Electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
          />
        </View>

        {/* SECCIÓN: CONTRASEÑA */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-2">Contraseña</Text>
          <Text className="text-[#F7F4D5] text-sm mb-4 leading-5">
            Tu seguridad es nuestra prioridad. Si deseas cambiar tu contraseña, haz clic en el botón de abajo y te enviaremos un enlace seguro de restablecimiento a tu correo.
          </Text>
          <TouchableOpacity className="bg-[#0A3323] rounded-xl py-4 items-center">
            <Text className="text-[#F7F4D5] text-base font-bold">Restablecer Contraseña</Text>
          </TouchableOpacity>
        </View>

        {/* SEPARADOR */}
        <View className="h-[1px] bg-[#F7F4D5]/30 mb-8" />

        {/* SECCIÓN: ZONA DE PELIGRO */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-4">Zona de Peligro</Text>
          <TouchableOpacity 
            onPress={() => setDeleteModalVisible(true)}
            className="flex-row justify-between items-center bg-[#FEE2E2] rounded-xl p-4 border border-[#CC3333]/30"
          >
            <View className="flex-row items-center">
              <Text className="text-[#CC3333] text-lg mr-3">🗑️</Text>
              <Text className="text-[#CC3333] text-base font-bold">Eliminar Cuenta</Text>
            </View>
            <Text className="text-[#CC3333] text-lg font-bold">›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ==========================================
          MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE CUENTA
          ========================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="w-full bg-[#2E5834] rounded-[24px] p-8 items-center shadow-2xl">
            
            <Text className="text-[#0A3323] text-xl font-bold mb-4">Ártemis</Text>
            
            {/* Círculo de Alerta */}
            <View className="w-20 h-20 bg-[#FFAEAE] rounded-full items-center justify-center mb-6">
              <Text className="text-[#CC3333] text-4xl font-bold">!</Text>
            </View>

            <Text className="text-[#0A3323] text-2xl font-bold mb-2 text-center">
              ¿Eliminar Cuenta?
            </Text>
            <Text className="text-[#F7F4D5] text-sm text-center mb-6 px-2">
              Esta acción es permanente y no se puede deshacer.
            </Text>

            {/* Puntos de advertencia */}
            <View className="w-full mb-6 px-2">
              <View className="flex-row mb-3 pr-4">
                <Text className="text-[#0A3323] text-sm mr-2">•</Text>
                <Text className="text-[#F7F4D5] text-sm">Todas tus recetas publicadas serán eliminadas.</Text>
              </View>
              <View className="flex-row mb-3 pr-4">
                <Text className="text-[#0A3323] text-sm mr-2">•</Text>
                <Text className="text-[#F7F4D5] text-sm">Se perderán tus marcadores y recetas guardadas.</Text>
              </View>
              <View className="flex-row pr-4">
                <Text className="text-[#0A3323] text-sm mr-2">•</Text>
                <Text className="text-[#F7F4D5] text-sm">Los datos de tu perfil serán borrados permanentemente.</Text>
              </View>
            </View>

            {/* Botones */}
            <TouchableOpacity 
              onPress={() => {
                setDeleteModalVisible(false);
                // Aquí iría la lógica para cerrar sesión y mandar al inicio
              }}
              className="w-full min-h-[56px] bg-[#CC3333] rounded-xl items-center justify-center mb-4"
            >
              <Text className="text-white text-base font-bold">Sí, eliminar mi cuenta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => setDeleteModalVisible(false)}
              className="w-full min-h-[56px] bg-[#839958] border border-[#F7F4D5]/30 rounded-xl items-center justify-center"
            >
              <Text className="text-[#F7F4D5] text-base font-bold">Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}