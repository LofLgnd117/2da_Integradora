import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../config/api";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Todo');
  
  // Categorías sincronizadas con tu Base de Datos
  const categories = ['Todo', 'Comidas y Platillos', 'Dietas', 'Populares', 'Desayuno', 'Cena'];

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      setHasError(false);
      const response = await fetch(`${API_BASE_URL}/api/recetas`);
      if (!response.ok) throw new Error('Respuesta no válida del servidor');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error conectando al backend:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [fetchRecipes])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchRecipes();
  };

  // ==========================================
  // LÓGICA DE FILTRADO LOCAL 
  // ==========================================
  const recetasFiltradas = recipes.filter(receta => {
    // 1. Validar la pestaña seleccionada
    const coincideCategoria = activeTab === 'Todo' || receta.categoria === activeTab;
    
    // 2. Validar lo que se escribe en la barra
    const textoBusqueda = searchQuery.toLowerCase().trim();
    const coincideBusqueda = 
      receta.titulo?.toLowerCase().includes(textoBusqueda) || 
      receta.chef?.toLowerCase().includes(textoBusqueda);
    
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#0A3323" />
        }
      >
        
        {/* ENCABEZADO */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ofhp1p1q_expires_30_days.png" }}
            resizeMode="contain"
            className="w-40 h-14"
          />
          <TouchableOpacity
            className="min-h-[48px] min-w-[48px] items-center justify-center"
            onPress={() => navigation.navigate('Perfil')}
          >
            <Image
              source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0afafy0_expires_30_days.png" }}
              resizeMode="cover"
              className="w-12 h-12 rounded-full border-2 border-[#F7F4D5]"
            />
          </TouchableOpacity>
        </View>

        {/* BUSCADOR */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center bg-[#0A3323] border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
            <Text className="text-xl opacity-80 mr-3">🔍</Text>
            <TextInput
              className="flex-1 text-[#F7F4D5] text-base"
              placeholder="Buscar recetas, chefs..."
              placeholderTextColor="#D9D9D980"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {/* Botón X para limpiar barra */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="p-2">
                <Text className="text-[#F7F4D5] text-lg font-bold">✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* CATEGORÍAS */}
        <View className="mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
            {categories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveTab(cat)}
                className={`min-h-[48px] justify-center px-6 mr-3 rounded-full border ${
                  activeTab === cat 
                    ? 'bg-[#0A3323] border-[#0A3323]' 
                    : 'bg-transparent border-[#F7F4D5]/30'
                }`}
              >
                <Text className="text-base font-bold text-[#F7F4D5]">
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECCIÓN: RECETAS */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-black text-2xl font-bold">
              {searchQuery !== '' ? 'Resultados' : 'Recetas Destacadas'}
            </Text>
            {searchQuery === '' && (
              <TouchableOpacity className="min-h-[48px] justify-center">
                <Text className="text-[#F7F4D5] text-sm font-bold">Ver todo</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0A3323" className="mt-10" />
          ) : recetasFiltradas.length > 0 ? (
            <View className="flex-row flex-wrap justify-between">
              
              {/* MAPEAMOS LAS RECETAS FILTRADAS */}
              {recetasFiltradas.map((receta) => (
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
                  <View className="flex-row items-center">
                    <Text className="text-[#F7F4D5] text-xs font-medium">⏱ {receta.tiempo} min</Text>
                  </View>
                </TouchableOpacity>
              ))}

            </View>
          ) : hasError ? (
            <View className="items-center mt-10">
              <Text className="text-4xl mb-4">📡</Text>
              <Text className="text-black text-base font-bold text-center mb-2">Sin conexión con el servidor</Text>
              <Text className="text-[#444444] text-center px-4 mb-4">
                Verifica que el backend esté encendido y que tu celular esté en la misma red Wi-Fi.
              </Text>
              <TouchableOpacity onPress={fetchRecipes} className="bg-[#0A3323] px-6 py-3 rounded-xl">
                <Text className="text-[#F7F4D5] font-bold">Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center mt-10">
              <Text className="text-4xl mb-4">🍽️</Text>
              <Text className="text-black text-base font-bold text-center">No encontramos recetas</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}