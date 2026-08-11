import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, Modal, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedBookmarksScreen({ navigation }) {
  // 1. Estado para controlar la visibilidad del Modal
  const [isModalVisible, setModalVisible] = useState(false);
  
  // 2. Estado para saber qué receta seleccionó el usuario para borrar
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  // 3. Lista de recetas guardadas (Estado para poder borrarlas en vivo)
  const [savedRecipes, setSavedRecipes] = useState([
    {
      id: 1,
      title: "Pan Tostado con Aguacate",
      chef: "por H. Baker",
      rating: "4.6",
      time: "10 min",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/83jq3kp5_expires_30_days.png"
    },
    {
      id: 2,
      title: "Pasta al Pesto",
      chef: "por Chef Gio",
      rating: "4.9",
      time: "20 min",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/yv3djssu_expires_30_days.png"
    },
    {
      id: 3,
      title: "Tarta de Frutas",
      chef: "por Sweet Shop",
      rating: "4.7",
      time: "55 min",
      image: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/he4r4di9_expires_30_days.png"
    }
  ]);

  // Función para abrir el modal preparándolo con el ID de la receta
  const openDeleteModal = (id) => {
    setRecipeToDelete(id);
    setModalVisible(true);
  };

  // Función para confirmar y eliminar la receta de la lista
  const confirmDelete = () => {
    setSavedRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeToDelete));
    setModalVisible(false);
    setRecipeToDelete(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* ENCABEZADO Y TÍTULO */}
        <View className="px-6 pt-4 mb-6">
          <Text className="text-black text-3xl font-bold mt-4">
            Recetas Guardadas
          </Text>
        </View>

        {/* GRID DE RECETAS */}
        <View className="px-6 flex-row flex-wrap justify-between">
          {savedRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id}
              className="w-[48%] mb-8"
              onPress={() => navigation.navigate('RecipeDetail')}
              activeOpacity={0.9}
            >
              {/* Imagen y Botón de Bookmark (visual) */}
              <View className="relative">
                <Image
                  source={{ uri: recipe.image }}
                  className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
                />
                <View className="absolute top-2 right-2 w-8 h-8 bg-[#FBFBFB] rounded-full items-center justify-center">
                  <Image 
                    source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0be1xgq_expires_30_days.png" }} 
                    className="w-4 h-4" 
                    style={{tintColor: '#000'}} 
                  />
                </View>
              </View>

              {/* Textos de la Receta */}
              <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                {recipe.title}
              </Text>
              <Text className="text-[#F7F4D5] text-sm mb-2">{recipe.chef}</Text>
              
              {/* Calificación y Tiempo */}
              <View className="flex-row items-center mb-3">
                <View className="flex-row items-center mr-3">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/6xwt2jfk_expires_30_days.png" }} className="w-4 h-4 mr-1" />
                  <Text className="text-black text-xs font-bold">{recipe.rating}</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/vvi6cm3z_expires_30_days.png" }} className="w-4 h-4 mr-1" style={{tintColor: '#F7F4D5'}}/>
                  <Text className="text-[#F7F4D5] text-xs font-medium">{recipe.time}</Text>
                </View>
              </View>

              {/* BOTÓN PARA ELIMINAR (Abre el Modal) */}
              <TouchableOpacity 
                onPress={() => openDeleteModal(recipe.id)}
                className="w-12 h-12 bg-[#FAD1D1] rounded-full items-center justify-center border border-[#CC3333]/30"
              >
                {/* Icono de basurero / borrar */}
                <Image 
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/ixyf3mx0_expires_30_days.png" }} 
                  className="w-5 h-5" 
                  style={{tintColor: '#CC3333'}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {/* Mensaje si no hay recetas */}
          {savedRecipes.length === 0 && (
            <View className="w-full items-center justify-center py-10">
              <Text className="text-[#F7F4D5] text-lg font-bold">No tienes recetas guardadas.</Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* ==========================================
          MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
          ========================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Fondo oscuro translúcido */}
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          
          {/* Tarjeta del Modal */}
          <View className="w-full bg-[#2E5834] rounded-[24px] p-8 items-center shadow-2xl">
            
            <Text className="text-[#0A3323] text-xl font-bold mb-6">Ártemis</Text>
            
            {/* Círculo de Alerta */}
            <View className="w-20 h-20 bg-[#FFAEAE] rounded-full items-center justify-center mb-6">
              <Text className="text-[#CC3333] text-4xl font-bold">!</Text>
            </View>

            <Text className="text-[#0A3323] text-2xl font-bold mb-3 text-center">
              Eliminar Receta
            </Text>
            <Text className="text-[#F7F4D5] text-base text-center mb-8 px-2">
              ¿Estás seguro de que deseas eliminar esta receta de tus guardados?
            </Text>

            {/* Botón Confirmar Eliminación */}
            <TouchableOpacity 
              onPress={confirmDelete}
              className="w-full min-h-[56px] bg-[#CC3333] rounded-xl items-center justify-center mb-4"
            >
              <Text className="text-white text-base font-bold">Sí, eliminar receta</Text>
            </TouchableOpacity>

            {/* Botón Cancelar */}
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
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