import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, TextInput, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRecipeScreen({ navigation }) {
  // Estados para guardar la información del formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('Media'); // Estado para los botones de dificultad
  const [ingredient, setIngredient] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      {/* ENCABEZADO DE NAVEGACIÓN */}
      <View className="flex-row items-center px-6 py-4 border-b border-[#F7F4D5]/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Text className="text-black text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-black text-xl font-bold flex-1 text-center mr-10">
          Agregar Receta
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        {/* BOTÓN FOTO DE PORTADA */}
        <TouchableOpacity 
          className="bg-[#F7F4D5]/80 border-2 border-dashed border-[#0A3323]/30 rounded-2xl py-12 items-center mb-8"
        >
          <Text className="text-[#0A3323] text-4xl mb-2">📷</Text>
          <Text className="text-[#0A3323] text-base font-bold">Agregar Foto de Portada</Text>
        </TouchableOpacity>

        {/* TÍTULO */}
        <View className="mb-6">
          <Text className="text-black text-base font-bold mb-2">Título de la Receta</Text>
          <TextInput
            placeholder="Ej. Lasaña Clásica"
            placeholderTextColor="#839958"
            value={title}
            onChangeText={setTitle}
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
          />
        </View>

        {/* DESCRIPCIÓN */}
        <View className="mb-6">
          <Text className="text-black text-base font-bold mb-2">Descripción</Text>
          <TextInput
            placeholder="Describe tu platillo..."
            placeholderTextColor="#839958"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[100px]"
          />
        </View>

        {/* PORCIONES Y TIEMPO */}
        <View className="flex-row mb-6">
          <View className="flex-1 mr-4">
            <Text className="text-black text-base font-bold mb-2">Porciones</Text>
            <TextInput
              placeholder="Ej. 4"
              placeholderTextColor="#839958"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
            />
          </View>
          <View className="flex-1">
            <Text className="text-black text-base font-bold mb-2">Tiempo Prep.</Text>
            <View className="flex-row items-center bg-[#F7F4D5] rounded-xl px-4 py-3">
              <TextInput
                placeholder="30"
                placeholderTextColor="#839958"
                value={prepTime}
                onChangeText={setPrepTime}
                keyboardType="numeric"
                className="flex-1 text-black text-base p-0"
              />
              <Text className="text-[#0A3323] font-bold ml-2">min</Text>
            </View>
          </View>
        </View>

        {/* CATEGORÍA */}
        <View className="mb-6">
          <Text className="text-black text-base font-bold mb-2">Categoría</Text>
          <TouchableOpacity className="flex-row justify-between items-center bg-[#F7F4D5] rounded-xl px-4 py-4">
            <Text className="text-[#0A3323] text-base">Selecciona una categoría</Text>
            <Text className="text-[#0A3323] font-bold">⌄</Text>
          </TouchableOpacity>
        </View>

        {/* DIFICULTAD (Botones interactivos) */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-3">Dificultad</Text>
          <View className="flex-row justify-between">
            {['Fácil', 'Media', 'Difícil'].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setDifficulty(level)}
                className={`flex-1 items-center py-3 rounded-full mx-1 border border-[#0A3323]/20 ${
                  difficulty === level ? 'bg-[#0A3323]' : 'bg-[#F7F4D5]'
                }`}
              >
                <Text className={`font-bold text-base ${
                  difficulty === level ? 'text-[#F7F4D5]' : 'text-[#0A3323]'
                }`}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* INGREDIENTES */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">Ingredientes</Text>
            <TouchableOpacity>
              <Text className="text-[#F7F4D5] text-sm font-bold">+ Añadir Ingrediente</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center mb-2">
            <TextInput
              placeholder="Ej. Hojas de albahaca"
              placeholderTextColor="#839958"
              value={ingredient}
              onChangeText={setIngredient}
              className="flex-1 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 mr-2"
            />
            <TextInput
              placeholder="1 taza"
              placeholderTextColor="#839958"
              className="w-24 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 text-center mr-2"
            />
            <TouchableOpacity className="w-12 h-12 bg-[#FEE2E2] rounded-xl items-center justify-center">
              <Text className="text-[#CC3333] text-lg">🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* INSTRUCCIONES */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">Instrucciones</Text>
            <TouchableOpacity>
              <Text className="text-[#F7F4D5] text-sm font-bold">+ Añadir Paso</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row mb-4">
            <View className="w-8 h-8 bg-[#0A3323] rounded-full items-center justify-center mr-3 mt-1">
              <Text className="text-[#F7F4D5] font-bold">1</Text>
            </View>
            <TextInput
              placeholder="Lava y seca la albahaca antes de licuarla..."
              placeholderTextColor="#839958"
              multiline
              className="flex-1 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[80px]"
            />
          </View>
        </View>

        {/* BOTÓN PUBLICAR RECETA */}
        <TouchableOpacity 
          className="bg-[#0A3323] rounded-xl py-4 items-center mb-8"
          onPress={() => {
            alert('¡Receta publicada!');
            navigation.goBack();
          }}
        >
          <Text className="text-[#F7F4D5] text-lg font-bold">Publicar Receta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}