import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const { authFetch, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Ingredientes');
  const [isSaving, setIsSaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // NUEVO ESTADO: Controla si el modal personalizado se ve o no
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const fetchRecipeDetail = useCallback(async () => {
    try {
      const response = await authFetch(`/api/recetas/${recipeId}`);
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error("Error al cargar el detalle:", error);
    } finally {
      setIsLoading(false);
    }
  }, [recipeId, authFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipeDetail();
    }, [fetchRecipeDetail])
  );

  // NUEVA FUNCIÓN: Ejecuta el borrado cuando el usuario confirma en el modal
  const confirmDelete = async () => {
    setDeleteModalVisible(false); // Cerramos el modal primero
    try {
      const response = await authFetch(`/api/recetas/${recipeId}`, { method: 'DELETE' });

      if (response.ok) {
        navigation.navigate('Main');
      } else {
        const data = await response.json().catch(() => ({}));
        Alert.alert("No se pudo eliminar", data.error || "Ocurrió un error al eliminar la receta.");
      }
    } catch (error) {
      console.error("Error de conexión al eliminar:", error);
      Alert.alert("Sin conexión", "Hubo un error de conexión al intentar eliminar la receta.");
    }
  };

  const toggleSaved = async () => {
    if (!recipe || isSaving) return;
    setIsSaving(true);
    const wasSaved = recipe.esta_guardada;
    // Actualización optimista para que se sienta instantáneo
    setRecipe((prev) => ({ ...prev, esta_guardada: !wasSaved }));
    try {
      const response = await authFetch(`/api/recetas/${recipeId}/guardar`, {
        method: wasSaved ? 'DELETE' : 'POST',
      });
      if (!response.ok) {
        throw new Error('No se pudo actualizar');
      }
    } catch (error) {
      console.error("Error al guardar/quitar receta:", error);
      setRecipe((prev) => ({ ...prev, esta_guardada: wasSaved }));
      Alert.alert("Sin conexión", "No se pudo actualizar tus guardados. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleLike = async () => {
    if (!recipe || isLiking) return;
    if (!isAuthenticated) {
      Alert.alert('Inicia sesión', 'Necesitas iniciar sesión para darle "Me gusta" a una receta.');
      return;
    }
    setIsLiking(true);
    const previous = { le_gusta: recipe.le_gusta, likes_count: recipe.likes_count };
    setRecipe((prev) => ({
      ...prev,
      le_gusta: !prev.le_gusta,
      likes_count: prev.le_gusta ? prev.likes_count - 1 : prev.likes_count + 1,
    }));
    try {
      const response = await authFetch(`/api/recetas/${recipeId}/like`, { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setRecipe((prev) => ({ ...prev, le_gusta: data.le_gusta, likes_count: data.likes_count }));
      } else {
        setRecipe((prev) => ({ ...prev, ...previous }));
      }
    } catch (error) {
      console.error('Error al actualizar "me gusta":', error);
      setRecipe((prev) => ({ ...prev, ...previous }));
    } finally {
      setIsLiking(false);
    }
  };

  const submitReview = async () => {
    if (!isAuthenticated) {
      Alert.alert('Inicia sesión', 'Necesitas iniciar sesión para escribir una reseña.');
      return;
    }
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      const response = await authFetch(`/api/recetas/${recipeId}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario: reviewText.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecipe((prev) => ({ ...prev, resenas: [data.resena, ...(prev.resenas || [])] }));
        setReviewText('');
      } else {
        Alert.alert('No se pudo publicar', data.error || 'Ocurrió un error al publicar tu reseña.');
      }
    } catch (error) {
      console.error('Error al publicar reseña:', error);
      Alert.alert('Sin conexión', 'No se pudo publicar tu reseña.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#839958] justify-center items-center">
        <ActivityIndicator size="large" color="#0A3323" />
        <Text className="text-[#0A3323] font-bold mt-4">Preparando cocina...</Text>
      </SafeAreaView>
    );
  }

  if (!recipe || recipe.error) {
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

            {/* BOTONES DERECHOS */}
            <View className="flex-row items-center">
              {recipe.es_dueno && (
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(true)} // Abre el modal visual
                  className="w-10 h-10 bg-[#FEE2E2]/90 rounded-full items-center justify-center mr-3 border border-[#CC3333]/20"
                >
                  <Text className="text-[#CC3333] text-lg">🗑️</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={toggleLike}
                disabled={isLiking}
                className="w-10 h-10 bg-[#F7F4D5]/90 rounded-full items-center justify-center mr-3 flex-row"
              >
                <Text className="text-black text-xl">{recipe.le_gusta ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleSaved}
                disabled={isSaving}
                className="w-10 h-10 bg-[#F7F4D5]/90 rounded-full items-center justify-center"
              >
                <Text className="text-black text-xl">{recipe.esta_guardada ? '🔖' : '📑'}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

        {/* CONTENEDOR PRINCIPAL */}
        <View className="flex-1 bg-[#F7F4D5] -mt-8 rounded-t-3xl px-6 pt-8 pb-10 shadow-lg">

          <Text className="text-black text-3xl font-bold mb-2 leading-tight">{recipe.title}</Text>
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-[#0A3323] text-base font-bold">por {recipe.chef}</Text>
            <Text className="text-[#0A3323] text-base font-bold">{recipe.le_gusta ? '❤️' : '🤍'} {recipe.likes_count} Me gusta</Text>
          </View>

          {/* ESTADÍSTICAS RÁPIDAS */}
          <View className="flex-row flex-wrap mb-6 py-4 border-y border-[#839958]/30">
            <View className="items-center w-1/2 mb-4">
              <Text className="text-[#839958] text-sm font-bold mb-1">⏱ Tiempo</Text>
              <Text className="text-black text-base font-bold">{recipe.total_time_minutes} min</Text>
            </View>
            <View className="items-center w-1/2 mb-4">
              <Text className="text-[#839958] text-sm font-bold mb-1">🍽 Porciones</Text>
              <Text className="text-black text-base font-bold">{recipe.servings} pers.</Text>
            </View>
            <View className="items-center w-1/2">
              <Text className="text-[#839958] text-sm font-bold mb-1">🏷 Categoría</Text>
              <Text className="text-black text-base font-bold">{recipe.category}</Text>
            </View>
            <View className="items-center w-1/2">
              <Text className="text-[#839958] text-sm font-bold mb-1">📊 Dificultad</Text>
              <Text className="text-black text-base font-bold">{recipe.difficulty}</Text>
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

            <TouchableOpacity
              onPress={() => setActiveTab('Reseñas')}
              className={`flex-1 items-center py-3 rounded-lg ${activeTab === 'Reseñas' ? 'bg-[#0A3323]' : 'bg-transparent'}`}
            >
              <Text className={`text-sm font-bold ${activeTab === 'Reseñas' ? 'text-[#F7F4D5]' : 'text-black'}`}>Reseñas ({recipe.resenas?.length || 0})</Text>
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

              {/* CONSEJO DEL CHEF */}
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

          {/* VISTA 3: RESEÑAS */}
          {activeTab === 'Reseñas' && (
            <View className="mb-8">
              {isAuthenticated ? (
                <View className="mb-6">
                  <TextInput
                    placeholder="Cuéntale a la comunidad qué te pareció esta receta..."
                    placeholderTextColor="#839958"
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="bg-[#EAECE3] text-black text-base rounded-xl px-4 py-3 min-h-[80px] mb-3"
                  />
                  <TouchableOpacity
                    onPress={submitReview}
                    disabled={isSubmittingReview || !reviewText.trim()}
                    className="bg-[#0A3323] rounded-xl py-3 items-center"
                    style={{ opacity: isSubmittingReview || !reviewText.trim() ? 0.6 : 1 }}
                  >
                    <Text className="text-[#F7F4D5] font-bold">
                      {isSubmittingReview ? 'Publicando...' : 'Publicar reseña'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text className="text-black text-center mb-6">Inicia sesión para escribir una reseña.</Text>
              )}

              {recipe.resenas && recipe.resenas.length > 0 ? (
                recipe.resenas.map((resena) => (
                  <View key={resena.id} className="mb-5 pb-5 border-b border-[#D9D9D9]">
                    <View className="flex-row items-center mb-2">
                      <View className="w-9 h-9 rounded-full bg-[#839958] items-center justify-center mr-3">
                        <Text className="text-[#F7F4D5] font-bold">{resena.author?.charAt(0) || '?'}</Text>
                      </View>
                      <View>
                        <Text className="text-black font-bold">{resena.author}</Text>
                        <Text className="text-[#839958] text-xs">
                          {new Date(resena.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[#444444] text-base leading-relaxed">{resena.comment_text}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-black text-center mt-4">Aún no hay reseñas. ¡Sé el primero en escribir una!</Text>
              )}
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
        visible={isDeleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="w-full bg-[#2E5834] rounded-[24px] p-8 items-center shadow-2xl">

            <Text className="text-[#0A3323] text-xl font-bold mb-4">Ártemis</Text>

            <View className="w-20 h-20 bg-[#FFAEAE] rounded-full items-center justify-center mb-6">
              <Text className="text-[#CC3333] text-4xl font-bold">!</Text>
            </View>

            <Text className="text-[#0A3323] text-2xl font-bold mb-2 text-center">
              Eliminar Receta
            </Text>
            <Text className="text-[#F7F4D5] text-sm text-center mb-6 px-2">
              ¿Estás seguro de que deseas eliminar esta receta? Esta acción es permanente y se borrará de toda la plataforma.
            </Text>

            <TouchableOpacity
              onPress={confirmDelete}
              className="w-full min-h-[56px] bg-[#CC3333] rounded-xl items-center justify-center mb-4"
            >
              <Text className="text-white text-base font-bold">Sí, eliminar receta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              className="w-full min-h-[56px] bg-[#839958] border border-[#F7F4D5]/30 rounded-xl items-center justify-center"
            >
              <Text className="text-[#F7F4D5] text-base font-bold">Cancelar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}
