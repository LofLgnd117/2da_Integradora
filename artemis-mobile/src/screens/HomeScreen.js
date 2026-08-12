import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Todo');
  const categories = ['Todo', 'Desayuno', 'Comida', 'Cena'];

  // Nuevos estados para manejar los datos del backend
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener las recetas desde tu servidor Node.js
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // 🚨 CAMBIA ESTA IP POR TU DIRECCIÓN IPv4 REAL 🚨
        const backendURL = 'http://10.40.92.65:3000/api/recetas'; 
        
        const response = await fetch(backendURL);
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error("Error conectando al backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO */}
        <View className="flex-row justify-between items-center px-6 py-4">
          <Image
            source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ofhp1p1q_expires_30_days.png" }}
            resizeMode="contain"
            className="w-40 h-14"
          />
          <TouchableOpacity 
            className="min-h-[48px] min-w-[48px] items-center justify-center"
            onPress={() => navigation.navigate('Profile')} 
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

        {/* SECCIÓN: RECETAS DESTACADAS (CONECTADA A POSTGRESQL) */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-black text-2xl font-bold">
              Recetas Destacadas
            </Text>
            <TouchableOpacity className="min-h-[48px] justify-center">
              <Text className="text-[#F7F4D5] text-sm font-bold">Ver todo</Text>
            </TouchableOpacity>
          </View>

          {/* Renderizado Condicional: Muestra el spinner mientras carga, y luego las recetas */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#0A3323" className="mt-10" />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              
              {/* MAPEAMOS LOS DATOS DEL SERVIDOR */}
              {recipes.map((receta) => (
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
                    <View className="flex-row items-center mr-3">
                      <Text className="text-black text-xs font-bold mr-1">⭐ 4.8</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-[#F7F4D5] text-xs font-medium">⏱ {receta.tiempo} min</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}