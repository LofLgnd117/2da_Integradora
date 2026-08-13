import React, { useState, useCallback } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator, Modal, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const DEFAULT_AVATAR = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/p0afafy0_expires_30_days.png";
const DEFAULT_RECIPE_IMAGE = "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/jetwaqsi_expires_30_days.png";

export default function ProfileScreen({ navigation }) {
  const { user, authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('Mis Recetas');

  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [recipeToUnsave, setRecipeToUnsave] = useState(null);

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [recipesRes, savedRes] = await Promise.all([
        authFetch(`/api/usuarios/${user.id}/recetas`),
        authFetch('/api/recetas/guardadas'),
      ]);
      const recipesData = await recipesRes.json();
      const savedData = await savedRes.json();
      setMyRecipes(Array.isArray(recipesData) ? recipesData : []);
      setSavedRecipes(Array.isArray(savedData) ? savedData : []);
    } catch (error) {
      console.error("Error cargando datos del perfil:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, authFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [fetchProfileData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProfileData();
  };

  // --- Funciones para quitar de "Guardadas" ---
  const openUnsaveModal = (recipeId) => {
    setRecipeToUnsave(recipeId);
    setModalVisible(true);
  };

  const confirmUnsave = async () => {
    const recipeId = recipeToUnsave;
    setModalVisible(false);
    setRecipeToUnsave(null);
    setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    try {
      await authFetch(`/api/recetas/${recipeId}/guardar`, { method: 'DELETE' });
    } catch (error) {
      console.error("Error al quitar receta guardada:", error);
      fetchProfileData();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#F7F4D5" />}
      >

        {/* ENCABEZADO DEL PERFIL */}
        <View className="items-center pt-8 pb-6 px-6 bg-[#839958]">
          <TouchableOpacity
            onPress={() => navigation.navigate('AccountSettings')}
            className="absolute top-8 right-6 w-11 h-11 items-center justify-center bg-[#0A3323]/40 rounded-full"
          >
            <Text className="text-[#F7F4D5] text-lg">⚙️</Text>
          </TouchableOpacity>

          <Image
            source={{ uri: user?.avatar_url || DEFAULT_AVATAR }}
            className="w-24 h-24 rounded-full border-4 border-[#F7F4D5] mb-4"
          />
          <Text className="text-[#F7F4D5] text-3xl font-bold mb-1">
            {user ? `${user.first_name} ${user.last_name}` : 'Cargando...'}
          </Text>
          <Text className="text-[#F7F4D5]/80 text-base mb-4" numberOfLines={2}>
            {user?.about_me || 'Chef amateur en Ártemis 🍳'}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            className="flex-row justify-center bg-[#0A3323] px-6 py-2 rounded-full"
          >
            <Text className="text-[#F7F4D5] font-bold text-sm">Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* CONTENEDOR BLANCO INFERIOR */}
        <View className="flex-1 bg-[#F7F4D5] rounded-t-3xl pt-6 px-6 min-h-[500px]">

          {/* PESTAÑAS */}
          <View className="flex-row mb-6 bg-[#EAECE3] rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setActiveTab('Mis Recetas')}
              className={`flex-1 items-center py-3 rounded-lg ${activeTab === 'Mis Recetas' ? 'bg-[#0A3323]' : 'bg-transparent'}`}
            >
              <Text className={`font-bold ${activeTab === 'Mis Recetas' ? 'text-[#F7F4D5]' : 'text-[#0A3323]'}`}>
                Mis Recetas ({myRecipes.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('Guardadas')}
              className={`flex-1 items-center py-3 rounded-lg ${activeTab === 'Guardadas' ? 'bg-[#0A3323]' : 'bg-transparent'}`}
            >
              <Text className={`font-bold ${activeTab === 'Guardadas' ? 'text-[#F7F4D5]' : 'text-[#0A3323]'}`}>
                Guardadas ({savedRecipes.length})
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#0A3323" className="mt-10" />
          ) : (
            <>
              {/* CONTENIDO 1: MIS RECETAS */}
              {activeTab === 'Mis Recetas' && (
                <View>
                  {myRecipes.length > 0 ? (
                    <View className="flex-row flex-wrap justify-between">
                      {myRecipes.map((receta) => (
                        <TouchableOpacity
                          key={receta.id}
                          className="w-[48%] mb-6"
                          onPress={() => navigation.navigate('RecipeDetail', { recipeId: receta.id })}
                          activeOpacity={0.8}
                        >
                          <Image
                            source={{ uri: receta.imagen || DEFAULT_RECIPE_IMAGE }}
                            className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
                          />
                          <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                            {receta.titulo}
                          </Text>
                          <View className="flex-row items-center">
                            <Text className="text-[#839958] text-xs font-bold">⏱ {receta.tiempo} min</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View className="items-center mt-10">
                      <Text className="text-4xl mb-4">📝</Text>
                      <Text className="text-black text-base font-bold text-center mb-2">Aún no tienes recetas</Text>
                      <Text className="text-[#444444] text-center px-4">
                        Anímate a publicar tu primer platillo y compártelo con la comunidad.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* CONTENIDO 2: GUARDADAS */}
              {activeTab === 'Guardadas' && (
                <View className="flex-row flex-wrap justify-between">
                  {savedRecipes.map((recipe) => (
                    <TouchableOpacity
                      key={recipe.id}
                      className="w-[48%] mb-8 relative"
                      onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id })}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{ uri: recipe.imagen || DEFAULT_RECIPE_IMAGE }}
                        className="w-full h-40 rounded-2xl mb-3 bg-[#E5E5E5]"
                      />
                      <Text className="text-black text-base font-bold mb-1 leading-tight" numberOfLines={2}>
                        {recipe.titulo}
                      </Text>
                      <Text className="text-[#0A3323] text-xs mb-2">por {recipe.chef}</Text>
                      <Text className="text-[#839958] text-xs font-medium">⏱ {recipe.tiempo} min</Text>

                      {/* Botón flotante para quitar (Rojo) */}
                      <TouchableOpacity
                        onPress={() => openUnsaveModal(recipe.id)}
                        className="absolute top-2 right-2 w-10 h-10 bg-[#FAD1D1]/90 rounded-full items-center justify-center border border-[#CC3333]/30"
                      >
                        <Text className="text-[#CC3333] text-lg">🗑️</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}

                  {savedRecipes.length === 0 && (
                    <View className="w-full items-center justify-center py-10">
                      <Text className="text-4xl mb-4">🔖</Text>
                      <Text className="text-[#0A3323] text-lg font-bold">No tienes recetas guardadas.</Text>
                      <Text className="text-[#444444] text-center px-4 mt-2">
                        Toca el ícono de marcador en cualquier receta para guardarla aquí.
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </>
          )}

        </View>
      </ScrollView>

      {/* ==========================================
          MODAL DE CONFIRMACIÓN (Al quitar de Guardadas)
          ========================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="w-full bg-[#2E5834] rounded-[24px] p-8 items-center shadow-2xl">

            <Text className="text-[#0A3323] text-xl font-bold mb-6">Ártemis</Text>

            <View className="w-20 h-20 bg-[#FFAEAE] rounded-full items-center justify-center mb-6">
              <Text className="text-[#CC3333] text-4xl font-bold">!</Text>
            </View>

            <Text className="text-[#0A3323] text-2xl font-bold mb-3 text-center">
              Quitar Guardado
            </Text>
            <Text className="text-[#F7F4D5] text-base text-center mb-8 px-2">
              ¿Estás seguro de que deseas quitar esta receta de tus guardados?
            </Text>

            <TouchableOpacity
              onPress={confirmUnsave}
              className="w-full min-h-[56px] bg-[#CC3333] rounded-xl items-center justify-center mb-4"
            >
              <Text className="text-white text-base font-bold">Sí, quitar receta</Text>
            </TouchableOpacity>

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
