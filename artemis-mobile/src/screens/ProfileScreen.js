import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen({ navigation }) {
  // Estado para controlar qué pestaña del perfil está activa
  const [activeTab, setActiveTab] = useState('Guardadas');

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO: Íconos superiores */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <TouchableOpacity className="w-10 h-10 items-start justify-center">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/48xxdivq_expires_30_days.png" }}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 items-end justify-center">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/wyt7925f_expires_30_days.png" }}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        </View>

        {/* INFORMACIÓN DEL PERFIL */}
        <View className="items-center px-6 mb-6">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0afafy0_expires_30_days.png" }}
            resizeMode="cover"
            className="w-24 h-24 rounded-full mb-4 border-2 border-[#0A3323]"
          />
          <Text className="text-black text-2xl font-bold mb-2">
            Leonardo Flores
          </Text>
          <Text className="text-[#F7F4D5] text-sm text-center px-4 leading-relaxed">
            Estudiante de TI apasionado por el desarrollo de software y la buena comida. Cocinando desde Durango.
          </Text>
        </View>

        {/* ESTADÍSTICAS */}
        <View className="flex-row items-center justify-between mx-6 py-4 border-y border-[#F7F4D5]/30 mb-6">
          <View className="flex-1 items-center">
            <Text className="text-black text-lg font-bold mb-1">12</Text>
            <Text className="text-[#F7F4D5] text-xs font-medium">Recetas</Text>
          </View>
          <View className="flex-1 items-center border-x border-[#F7F4D5]/20">
            <Text className="text-black text-lg font-bold mb-1">340</Text>
            <Text className="text-[#F7F4D5] text-xs font-medium">Siguiendo</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-black text-lg font-bold mb-1">1.2k</Text>
            <Text className="text-[#F7F4D5] text-xs font-medium">Seguidores</Text>
          </View>
        </View>

        {/* BOTONES DE ACCIÓN */}
        <View className="flex-row items-center mx-6 mb-8">
          <TouchableOpacity className="flex-1 bg-[#0A3323] rounded-xl py-4 items-center mr-3">
            <Text className="text-[#F7F4D5] text-base font-bold">
              Editar Perfil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-14 h-14 bg-[#0A3323] rounded-xl items-center justify-center">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/299zevfv_expires_30_days.png" }}
              resizeMode="contain"
              className="w-6 h-6"
              style={{ tintColor: '#F7F4D5' }}
            />
          </TouchableOpacity>
        </View>

        {/* MENÚ INTERNO (PESTAÑAS FUNCIONALES) */}
        <View className="flex-row items-center bg-[#0A3323] mx-6 rounded-2xl p-1 mb-6">
          <TouchableOpacity 
            onPress={() => setActiveTab('Guardadas')}
            className={`flex-1 items-center py-3 rounded-xl ${activeTab === 'Guardadas' ? 'bg-[#839958]' : 'bg-transparent'}`}
          >
            <Text className={`text-base font-bold ${activeTab === 'Guardadas' ? 'text-black' : 'text-[#F7F4D5]'}`}>
              Guardadas
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('Mis Recetas')}
            className={`flex-1 items-center py-3 rounded-xl ${activeTab === 'Mis Recetas' ? 'bg-[#839958]' : 'bg-transparent'}`}
          >
            <Text className={`text-base font-bold ${activeTab === 'Mis Recetas' ? 'text-black' : 'text-[#F7F4D5]'}`}>
              Mis Recetas
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTENIDO DINÁMICO DE LAS PESTAÑAS */}
        <View className="px-6">
          
          {/* VISTA 1: GUARDADAS */}
          {activeTab === 'Guardadas' && (
            <View className="flex-row flex-wrap justify-between">
              {/* Receta 1 */}
              <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail')} className="w-[48%] mb-6">
                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/vsnmeveh_expires_30_days.png" }} className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]" />
                <Text className="text-black text-base font-bold mb-1">Pollo al Limón</Text>
                <Text className="text-[#F7F4D5] text-xs mb-2">por Chef Leo</Text>
                <View className="flex-row items-center">
                  <Text className="text-black text-xs font-bold mr-3">⭐ 4.8</Text>
                  <Text className="text-[#F7F4D5] text-xs">⏱ 30 min</Text>
                </View>
              </TouchableOpacity>

              {/* Receta 2 */}
              <TouchableOpacity onPress={() => navigation.navigate('RecipeDetail')} className="w-[48%] mb-6">
                <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ffstq9m3_expires_30_days.png" }} className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]" />
                <Text className="text-black text-base font-bold mb-1">Tarta de Moras</Text>
                <Text className="text-[#F7F4D5] text-xs mb-2">por Repostería</Text>
                <View className="flex-row items-center">
                  <Text className="text-black text-xs font-bold mr-3">⭐ 4.9</Text>
                  <Text className="text-[#F7F4D5] text-xs">⏱ 50 min</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* VISTA 2: MIS RECETAS */}
          {activeTab === 'Mis Recetas' && (
            <View className="items-center justify-center py-10 bg-[#8F9E70] rounded-2xl">
              <Text className="text-black text-lg font-bold mb-2">Aún no has subido recetas</Text>
              <Text className="text-[#F7F4D5] text-center px-6">Toca el botón con el ícono de "+" arriba para compartir tu primer platillo con el mundo.</Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}