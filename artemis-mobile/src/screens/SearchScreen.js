import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen({ navigation }) {
  // Estado para la barra de búsqueda
  const [searchQuery, setSearchQuery] = useState('Pasta Italiana');
  
  // Estado para los filtros rápidos
  const [activeFilter, setActiveFilter] = useState('Menos de 30m');
  const filters = ['Vegetariano', 'Menos de 30m', 'Calif. 4.0+'];

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* BARRA DE BÚSQUEDA Y BOTÓN DE REGRESO */}
        <View className="flex-row items-center px-6 py-4 mt-2">
          {/* Botón Volver */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="min-h-[48px] min-w-[48px] justify-center mr-2 -ml-2"
          >
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/rmv86df7_expires_30_days.png" }}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          {/* Input de Búsqueda */}
          <View className="flex-1 flex-row items-center bg-[#0A3323] border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
            <TextInput
              className="flex-1 text-[#F7F4D5] text-base"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar recetas..."
              placeholderTextColor="#D9D9D980"
            />
            {/* Botón para limpiar búsqueda (la tachita) */}
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              className="min-h-[48px] min-w-[48px] items-center justify-center -mr-3"
            >
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/hcjh4hff_expires_30_days.png" }}
                resizeMode="contain"
                className="w-5 h-5 opacity-80"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* FILTROS RÁPIDOS */}
        <View className="px-6 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveFilter(filter)}
                className={`min-h-[48px] justify-center px-5 mr-3 rounded-full border ${
                  activeFilter === filter 
                    ? 'bg-[#0A3323] border-[#0A3323]' 
                    : 'bg-transparent border-[#F7F4D5]/40'
                }`}
              >
                <Text className="text-[#F7F4D5] text-base font-bold">
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* CONTADOR DE RESULTADOS */}
        <View className="px-6 mb-6">
          <Text className="text-black text-lg font-bold">
            48 recetas encontradas
          </Text>
        </View>

        {/* GRID DE RESULTADOS (2 COLUMNAS) */}
        <View className="px-6">
          <View className="flex-row flex-wrap justify-between">
            
            {/* RECETA 1 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/4abbar24_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Sopa Cremosa de Tomate
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Chef Leo</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/15h3hron_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.5</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/3et63cuv_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">20 min</Text>
                </View>
              </View>
            </View>

            {/* RECETA 2 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/f23ikkxa_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Pizza Casera
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Italiana</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/1fy7u116_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.8</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/gyzgja1w_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">60 min</Text>
                </View>
              </View>
            </View>

            {/* RECETA 3 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ixg6q4cf_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Ensalada César
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Green Eats</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/6nkr091t_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.4</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/c0lbcdb8_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">15 min</Text>
                </View>
              </View>
            </View>

            {/* RECETA 4 */}
            <View className="w-[48%] mb-6">
              <Image
                source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/sapxh40u_expires_30_days.png" }}
                className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
              />
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                Costillas BBQ
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">por Maestro Parrillero</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/gco81whu_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">4.9</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/1b47wtx9_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">120 min</Text>
                </View>
              </View>
            </View>
            
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}