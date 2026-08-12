import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Ingredientes'); 

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(`http://10.40.92.65:3000/api/recetas/${recipeId}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error al cargar el detalle:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#839958] justify-center items-center">
        <ActivityIndicator size="large" color="#0A3323" />
        <Text className="text-[#0A3323] font-bold mt-4">Preparando cocina...</Text>
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView className="flex-1 bg-[#839958] justify-center items-center">
        <Text className="text-[#F7F4D5] text-lg font-bold">No se encontró la receta.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-[#0A3323] px-6 py-3 rounded-xl">
          <Text className="text-[#F7F4D5] font-bold">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* IMAGEN DE PORTADA Y BOTONES */}
        <View className="relative w-full h-72">
          <Image
            source={{ uri: recipe.image_url || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/jetwaqsi_expires_30_days.png" }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute top-0 w-full h-24 bg-black/30 pt-10 px-6 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-[#F7F4D5]/90 rounded-full items-center justify-center">
              <Text className="text-black text-xl font-bold">←</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-[#F7F4D5]/90 rounded-full items-center justify-center">
              <Text className="text-black text-xl">🔖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENEDOR PRINCIPAL */}
        <View className="flex-1 bg-[#F7F4D5] -mt-8 rounded-t-3xl px-6 pt-8 pb-10 shadow-lg">
          
          <Text className="text-black text-3xl font-bold mb-2 leading-tight">{recipe.title}</Text>
          <Text className="text-[#0A3323] text-base font-bold mb-6">por {recipe.chef}</Text>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <View className="flex-row justify-between items-center mb-6 py-4 border-y border-[#839958]/30">
            <View className="items-center">
              <Text className="text-[#839958] text-sm font-bold mb-1">⏱ Tiempo</Text>
              <Text className="text-black text-base font-bold">{recipe.total_time_minutes} min</Text>
            </View>
            <View className="items-center border-x border-[#839958]/30 px-6">
              <Text className="text-[#839958] text-sm font-bold mb-1">🍽 Porciones</Text>
              <Text className="text-black text-base font-bold">{recipe.servings} pers.</Text>
            </View>
            <View className="items-center">
              <Text className="text-[#839958] text-sm font-bold mb-1">🏷 Categoría</Text>
              <Text className="text-black text-base font-bold">{recipe.category}</Text>
            </View>
          </View>

          <Text className="text-[#444444] text-base leading-relaxed mb-8">{recipe.description}</Text>

          {/* PESTAÑAS INTERNAS */}
          <View className="flex-row items-center bg-[#EEEEEE] rounded-xl p-1 mb-6">
            <TouchableOpacity 
              onPress={() => setActiveTab('Ingredientes')}
              className={`flex-1 items-center py-3 rounded-lg ${activeTab === 'Ingredientes' ? 'bg-[#0A3323]' : 'bg-transparent'}`}
            >
              <Text className={`text-sm font-bold ${activeTab === 'Ingredientes' ? 'text-[#F7F4D5]' : 'text-black'}`}>Ingredientes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setActiveTab('Instrucciones')}
              className={`flex-1 items-center py-3 rounded-lg ${activeTab === 'Instrucciones' ? 'bg-[#0A3323]' : 'bg-transparent'}`}
            >
              <Text className={`text-sm font-bold ${activeTab === 'Instrucciones' ? 'text-[#F7F4D5]' : 'text-black'}`}>Instrucciones</Text>
            </TouchableOpacity>
          </View>

          {/* VISTA 1: INGREDIENTES */}
          {activeTab === 'Ingredientes' && (
            <View className="mb-8">
              {recipe.ingredientes && recipe.ingredientes.length > 0 ? (
                recipe.ingredientes.map((ing, index) => (
                  <View key={index} className="flex-row justify-between items-center py-3 border-b border-[#D9D9D9]">
                    <View className="flex-row items-center flex-1 pr-4">
                      <Text className="text-[#839958] mr-3">●</Text>
                      <Text className="text-black text-base font-medium">{ing.name}</Text>
                    </View>
                    <Text className="text-[#444444] text-base font-bold">{ing.quantity} {ing.unit}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-black text-center mt-4">Aún no hay ingredientes registrados.</Text>
              )}
            </View>
          )}

          {/* VISTA 2: INSTRUCCIONES Y CONSEJO */}
          {activeTab === 'Instrucciones' && (
            <View className="mb-8">
              {recipe.pasos && recipe.pasos.length > 0 ? (
                recipe.pasos.map((paso) => (
                  <View key={paso.step_number} className="flex-row mb-6">
                    <View className="w-8 h-8 bg-[#0A3323] rounded-full items-center justify-center mr-4">
                      <Text className="text-[#F7F4D5] font-bold">{paso.step_number}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-black text-base font-bold mb-1">Paso {paso.step_number}</Text>
                      <Text className="text-[#444444] text-base leading-relaxed">{paso.instruction_text}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-black text-center mt-4">Aún no hay instrucciones registradas.</Text>
              )}

              {/* CONSEJO DEL CHEF (Dinámico desde la BD) */}
              {recipe.chef_tips && (
                <View className="bg-[#EAECE3] rounded-2xl p-5 mt-4 border border-[#839958]/20">
                  <View className="flex-row items-center mb-2">
                    <Text className="text-xl mr-2">💡</Text>
                    <Text className="text-[#0A3323] text-base font-bold">Consejos del Chef</Text>
                  </View>
                  <Text className="text-[#444444] text-sm leading-relaxed">
                    {recipe.chef_tips}
                  </Text>
                </View>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}