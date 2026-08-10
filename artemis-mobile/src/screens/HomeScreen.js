import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  // Estado para el buscador
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para saber qué pestaña de categoría está activa
  const [activeTab, setActiveTab] = useState('Todo');
  const categories = ['Todo', 'Desayuno', 'Comida', 'Cena'];

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO (Logo y Foto de Perfil) */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ofhp1p1q_expires_30_days.png" }}
            resizeMode="contain"
            className="w-40 h-14"
          />
          <TouchableOpacity 
            className="min-h-[48px] min-w-[48px] items-center justify-center"
            // Suponiendo que tienes una pantalla Profile en tu navegación
            onPress={() => navigation.navigate('Profile')} 
          >
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/arukwc2q_expires_30_days.png" }}
              resizeMode="cover"
              className="w-12 h-12 rounded-full border-2 border-[#F7F4D5]"
            />
          </TouchableOpacity>
        </View>

        {/* BUSCADOR */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-[#0A3323] border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ln6qbig1_expires_30_days.png" }}
              resizeMode="contain"
              className="w-5 h-5 opacity-80"
            />
            <TextInput
              className="flex-1 text-[#F7F4D5] text-base ml-3"
              placeholder="Buscar recetas, chefs..."
              placeholderTextColor="#D9D9D980"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORÍAS (Deslizables horizontalmente) */}
        <View className="mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTab(cat)}
                className={`min-h-[48px] justify-center px-6 mr-3 rounded-full border ${
                  activeTab === cat 
                    ? 'bg-[#0A3323] border-[#0A3323]' 
                    : 'bg-transparent border-[#F7F4D5]/30' // Fondo transparente para que el texto F7F4D5 se lea
                }`}
              >
                <Text className={`text-base font-bold ${
                  activeTab === cat ? 'text-[#F7F4D5]' : 'text-[#F7F4D5]'
                }`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECCIÓN: RECETAS DESTACADAS */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-black text-2xl font-bold">
              Recetas Destacadas
            </Text>
            <TouchableOpacity className="min-h-[48px] justify-center">
              {/* Cambiado el gris por el F7F4D5 como pediste */}
              <Text className="text-[#F7F4D5] text-sm font-bold">Ver todo</Text>
            </TouchableOpacity>
          </View>

          {/* GRID DE 2 COLUMNAS PARA RECETAS */}
          <View className="flex-row flex-wrap justify-between">
            
            {/* TARJETA 1 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/jetwaqsi_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Camarones al Ajillo
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Chef Marco</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/4yokyams_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.8</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/smn7zpa7_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}} />
                  <Text className="text-[#F7F4D5] text-xs font-medium">25 min</Text>
                </View>
              </View>
            </View>

            {/* TARJETA 2 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/8vgwisuy_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Risotto de Champiñones
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Sarah Jenkins</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/po0bztgc_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.9</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/gg4f14z7_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">40 min</Text>
                </View>
              </View>
            </View>

            {/* TARJETA 3 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/rlaax0sz_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Bowl de Frutos Rojos
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Elena Gómez</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/vq9m3zh2_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.7</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/s3bwmaw4_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">15 min</Text>
                </View>
              </View>
            </View>

            {/* TARJETA 4 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/bp6og5vu_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Tacos Clásicos de Res
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Maestro Taquero</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/tnl8lqxq_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.6</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/t81dthaz_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">30 min</Text>
                </View>
              </View>
            </View>
            
          </View>
        </View>

        {/* SECCIÓN: ÚLTIMOS ARTÍCULOS */}
        <View className="px-6 mb-4">
          <Text className="text-black text-2xl font-bold mb-5">
            Últimos Artículos
          </Text>

          {/* ARTÍCULO 1 */}
          <TouchableOpacity className="flex-row items-center bg-[#8F9E70] rounded-2xl p-3 mb-4">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/vasw69kx_expires_30_days.png" }}
              className="w-20 h-20 rounded-xl bg-[#E5E5E5]"
            />
            <View className="flex-1 ml-4">
              <Text className="text-black text-base font-bold mb-1" numberOfLines={2}>
                10 Especias Secretas para la Cocina Italiana
              </Text>
              <Text className="text-[#F7F4D5] text-xs font-medium mt-1">
                5 min lectura • Equipo Editorial
              </Text>
            </View>
          </TouchableOpacity>

          {/* ARTÍCULO 2 */}
          <TouchableOpacity className="flex-row items-center bg-[#8F9E70] rounded-2xl p-3 mb-4">
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ubxg3tb8_expires_30_days.png" }}
              className="w-20 h-20 rounded-xl bg-[#E5E5E5]"
            />
            <View className="flex-1 ml-4">
              <Text className="text-black text-base font-bold mb-1" numberOfLines={2}>
                Cómo Lograr el Corte Juliana Perfecto
              </Text>
              <Text className="text-[#F7F4D5] text-xs font-medium mt-1">
                4 min lectura • Tips de Chef
              </Text>
            </View>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}