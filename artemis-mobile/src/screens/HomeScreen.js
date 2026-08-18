import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, RefreshControl, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

export default function HomeScreen({ navigation }) {
  const { isAuthenticated, authFetch } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Todo');

  // Categorías sincronizadas con tu Base de Datos
  const categories = ['Todo', 'Comidas y Platillos', 'Dietas', 'Populares', 'Desayuno', 'Cena'];

  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await authFetch('/api/notificaciones');
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notificaciones || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  }, [isAuthenticated, authFetch]);

  const openNotifications = async () => {
    setShowNotifModal(true);
    if (unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      try {
        await authFetch('/api/notificaciones/leidas', { method: 'POST' });
      } catch (error) {
        console.error('Error al marcar notificaciones como leídas:', error);
      }
    }
  };

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
      fetchNotifications();
    }, [fetchRecipes, fetchNotifications])
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
          <View className="flex-row items-center">
            {isAuthenticated && (
              <TouchableOpacity
                className="min-h-[48px] min-w-[48px] items-center justify-center relative"
                onPress={openNotifications}
              >
                <Text className="text-2xl">🔔</Text>
                {unreadCount > 0 && (
                  <View className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-[#839958]" />
                )}
              </TouchableOpacity>
            )}
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

      {/* ==========================================
          MODAL DE NOTIFICACIONES
          ========================================== */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showNotifModal}
        onRequestClose={() => setShowNotifModal(false)}
      >
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-[#F7F4D5] rounded-t-[28px] p-6 max-h-[75%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-[#0A3323] text-xl font-bold">Notificaciones</Text>
              <TouchableOpacity onPress={() => setShowNotifModal(false)} className="w-9 h-9 items-center justify-center">
                <Text className="text-[#0A3323] text-xl font-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <View
                    key={notif.id}
                    className={`p-4 rounded-2xl mb-3 ${notif.is_read ? 'bg-white/60' : 'bg-white'}`}
                  >
                    <View className="flex-row items-start justify-between mb-1">
                      <Text className="text-black font-bold flex-1 pr-2">{notif.title}</Text>
                      <Text className="text-[#839958] text-xs">{timeAgo(notif.created_at)}</Text>
                    </View>
                    <Text className="text-[#444444] text-sm leading-relaxed">{notif.message}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-[#0A3323] text-center py-10">
                  Aún no tienes notificaciones. Aquí verás tus medallas y los "Me gusta" en tus recetas.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}