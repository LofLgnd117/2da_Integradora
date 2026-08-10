import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailScreen({ navigation }) {
  // Estado para controlar qué pestaña interna está activa
  const [activeTab, setActiveTab] = useState('Ingredientes');

  return (
    <SafeAreaView className="flex-1 bg-[#839958]" edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN SUPERIOR: IMAGEN Y BOTONES DE REGRESO/GUARDAR */}
        <View className="relative w-full h-72 bg-gray-300">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/jetwaqsi_expires_30_days.png" }}
            className="absolute w-full h-full"
            resizeMode="cover"
          />
          
          <View className="absolute top-6 left-0 right-0 flex-row justify-between px-6">
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              className="w-11 h-11 bg-[#FBFBFB]/90 rounded-full items-center justify-center shadow-sm"
            >
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/a1fu9rji_expires_30_days.png" }} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
            
            <TouchableOpacity className="w-11 h-11 bg-[#FBFBFB]/90 rounded-full items-center justify-center shadow-sm">
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/tpcehb1y_expires_30_days.png" }} className="w-5 h-5" resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECCIÓN DE CONTENIDO */}
        <View className="bg-[#839958] -mt-10 pt-8 px-6 rounded-t-[32px]">
          
          <Text className="text-black text-3xl font-bold mb-4 leading-tight">
            Fettuccine Cremoso con Vieiras a la Parrilla
          </Text>

          {/* PERFIL DEL CHEF */}
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center">
              <Image 
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/qfac8zo0_expires_30_days.png" }} 
                className="w-12 h-12 rounded-full mr-3 bg-[#E5E5E5]" 
              />
              <View>
                <Text className="text-black text-base font-bold">Chef Antonio</Text>
                <Text className="text-[#F7F4D5] text-sm">Cocinero Premium</Text>
              </View>
            </View>
            <TouchableOpacity className="border-2 border-[#0A3323] rounded-xl py-2 px-4">
              <Text className="text-[#0A3323] text-sm font-bold">Seguir</Text>
            </TouchableOpacity>
          </View>

          {/* BARRA DE ESTADÍSTICAS */}
          <View className="flex-row items-center bg-[#0A3323] rounded-2xl py-4 px-2 mb-8 shadow-sm">
            <View className="flex-1 items-center border-r border-[#F7F4D5]/20">
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ji11uriw_expires_30_days.png" }} className="w-5 h-5 mb-2" style={{tintColor: '#F7F4D5'}}/>
              <Text className="text-[#F7F4D5] text-base font-bold">2 pers</Text>
              <Text className="text-[#F7F4D5] text-xs opacity-80">Porciones</Text>
            </View>
            <View className="flex-1 items-center border-r border-[#F7F4D5]/20">
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/yptjvysg_expires_30_days.png" }} className="w-5 h-5 mb-2" style={{tintColor: '#F7F4D5'}}/>
              <Text className="text-[#F7F4D5] text-base font-bold">35 min</Text>
              <Text className="text-[#F7F4D5] text-xs opacity-80">Prep.</Text>
            </View>
            <View className="flex-1 items-center">
              <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/gj6w6vap_expires_30_days.png" }} className="w-5 h-5 mb-2" style={{tintColor: '#F7F4D5'}}/>
              <Text className="text-[#F7F4D5] text-base font-bold">Fácil</Text>
              <Text className="text-[#F7F4D5] text-xs opacity-80">Dificultad</Text>
            </View>
          </View>

          {/* MENÚ DE PESTAÑAS INTERNAS (AHORA ES FUNCIONAL) */}
          <View className="flex-row items-center mb-6 border-b border-[#F7F4D5]/30">
            {['Ingredientes', 'Instrucciones', 'Reseñas'].map((tab) => (
              <TouchableOpacity 
                key={tab} 
                onPress={() => setActiveTab(tab)}
                className={`mr-6 pb-2 ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
              >
                <Text className={`text-base ${activeTab === tab ? 'text-black font-bold' : 'text-[#F7F4D5] font-medium'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* RENDERIZADO CONDICIONAL: Muestra contenido según la pestaña */}
          <View>
            
            {/* VISTA 1: INGREDIENTES */}
            {activeTab === 'Ingredientes' && (
              <View>
                <View className="flex-row justify-between items-center mb-4 bg-[#8F9E70] p-3 rounded-2xl">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-[#FBFBFB] rounded-xl items-center justify-center mr-4">
                      <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/972z4wse_expires_30_days.png" }} className="w-5 h-5" resizeMode="contain" />
                    </View>
                    <Text className="text-black text-base font-medium">Pasta fettuccine</Text>
                  </View>
                  <Text className="text-[#F7F4D5] text-base font-bold mr-2">250g</Text>
                </View>

                <View className="flex-row justify-between items-center mb-4 bg-[#8F9E70] p-3 rounded-2xl">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-[#FBFBFB] rounded-xl items-center justify-center mr-4">
                      <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/whbomxs4_expires_30_days.png" }} className="w-5 h-5" resizeMode="contain" />
                    </View>
                    <Text className="text-black text-base font-medium">Vieiras frescas</Text>
                  </View>
                  <Text className="text-[#F7F4D5] text-base font-bold mr-2">8 pzas</Text>
                </View>
              </View>
            )}

            {/* VISTA 2: INSTRUCCIONES */}
            {activeTab === 'Instrucciones' && (
              <View className="bg-[#8F9E70] p-5 rounded-2xl">
                <Text className="text-black font-bold mb-1 text-base">Paso 1:</Text>
                <Text className="text-[#F7F4D5] mb-4 text-base leading-relaxed">Hierve abundante agua con sal en una olla grande. Agrega el fettuccine y cocina de 8 a 10 minutos hasta que esté al dente.</Text>
                
                <Text className="text-black font-bold mb-1 text-base">Paso 2:</Text>
                <Text className="text-[#F7F4D5] text-base leading-relaxed">Mientras tanto, seca las vieiras con toallas de papel. Sazónalas con sal y pimienta. En un sartén caliente, séllalas por 2 minutos de cada lado hasta que doren.</Text>
              </View>
            )}

            {/* VISTA 3: RESEÑAS */}
            {activeTab === 'Reseñas' && (
              <View className="bg-[#8F9E70] p-6 rounded-2xl items-center justify-center">
                <Text className="text-black text-lg font-bold mb-2">Aún no hay reseñas</Text>
                <Text className="text-[#F7F4D5] text-base text-center">¡Prepara este platillo y sé el primero en compartir tu experiencia!</Text>
              </View>
            )}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}