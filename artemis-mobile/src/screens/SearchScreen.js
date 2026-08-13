import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/api";

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto que se dispara cada vez que cambia el texto en el buscador
  useEffect(() => {
    // Retrasamos la búsqueda 500ms para esperar a que termines de teclear
    const delaySearch = setTimeout(async () => {
      if (searchQuery.trim() === '') {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/recetas/buscar?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error buscando recetas:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      {/* ENCABEZADO Y BARRA DE BÚSQUEDA */}
      <View className="px-6 py-4">
        <Text className="text-black text-2xl font-bold mb-4">Descubre Recetas</Text>
        
        <View className="flex-row items-center bg-[#0A3323] border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
          <Text className="text-xl opacity-80 mr-3">🔍</Text>
          <TextInput
            className="flex-1 text-[#F7F4D5] text-base"
            placeholder="Busca pollo, ensalada, chef..."
            placeholderTextColor="#D9D9D980"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true} 
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
              <Text className="text-[#F7F4D5] text-lg font-bold">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ÁREA DE RESULTADOS */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#0A3323" className="mt-10" />
        ) : results.length > 0 ? (
          <View className="flex-row flex-wrap justify-between mt-4">
            <Text className="w-full text-[#F7F4D5] text-sm font-bold mb-4">
              Se encontraron {results.length} resultados
            </Text>
            
            {results.map((receta) => (
              <TouchableOpacity 
                key={receta.id}
                className="w-[48%] mb-6"
                onPress={() => navigation.navigate('RecipeDetail', { recipeId: receta.id })}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: receta.imagen || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/jetwaqsi_expires_30_days.png" }}
                  className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
                />
                <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                  {receta.titulo}
                </Text>
                <Text className="text-[#F7F4D5] text-sm mb-2" numberOfLines={1}>
                  por {receta.chef}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : searchQuery.trim() !== '' ? (
          <View className="items-center mt-20">
            <Text className="text-5xl mb-4">🍽️</Text>
            <Text className="text-black text-lg font-bold text-center">No encontramos recetas</Text>
            <Text className="text-[#F7F4D5] text-center mt-2 px-4">
              No hay coincidencias para "{searchQuery}". Intenta buscar con otras palabras o ingredientes.
            </Text>
          </View>
        ) : (
          <View className="items-center mt-20">
            <Text className="text-5xl mb-4">🔎</Text>
            <Text className="text-[#F7F4D5] text-base text-center font-medium px-4">
              Escribe algo arriba para empezar a explorar nuestra base de datos.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}