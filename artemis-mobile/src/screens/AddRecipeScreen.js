import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, TextInput, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRecipeScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  
  // NUEVO: Lista de categorías oficiales como en la Web
  const [category, setCategory] = useState('Comidas y Platillos');
  const categoriesList = ['Comidas y Platillos', 'Dietas', 'Populares', 'Desayuno', 'Comida', 'Cena'];
  
  const [chefTips, setChefTips] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index));
  const updateIngredient = (text, index, field) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = text;
    setIngredients(newIngredients);
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));
  const updateStep = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />
      
      <View className="flex-row items-center px-6 py-4 border-b border-[#F7F4D5]/20">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Text className="text-black text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-black text-xl font-bold flex-1 text-center mr-10">Agregar Receta</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity className="bg-[#F7F4D5]/80 border-2 border-dashed border-[#0A3323]/30 rounded-2xl py-12 items-center mb-8">
          <Text className="text-[#0A3323] text-4xl mb-2">📷</Text>
          <Text className="text-[#0A3323] text-base font-bold">Agregar Foto de Portada</Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-black text-base font-bold mb-2">Título de la Receta</Text>
          <TextInput
            placeholder="Ej. Ensalada de Pollo"
            placeholderTextColor="#839958"
            value={title}
            onChangeText={setTitle}
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3"
          />
        </View>

        <View className="mb-6">
          <Text className="text-black text-base font-bold mb-2">Descripción</Text>
          <TextInput
            placeholder="Un platillo fresco..."
            placeholderTextColor="#839958"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[80px]"
          />
        </View>

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
                placeholder="60"
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

        {/* NUEVO: SELECTOR DE CATEGORÍAS TIPO CHIPS */}
        <View className="mb-8">
          <Text className="text-black text-base font-bold mb-3">Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
            {categoriesList.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                className={`py-3 px-5 rounded-full mx-1 border border-[#0A3323]/20 ${
                  category === cat ? 'bg-[#0A3323]' : 'bg-[#F7F4D5]'
                }`}
              >
                <Text className={`font-bold text-sm ${category === cat ? 'text-[#F7F4D5]' : 'text-[#0A3323]'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">Ingredientes</Text>
            <TouchableOpacity onPress={addIngredient}>
              <Text className="text-[#F7F4D5] text-sm font-bold">+ Añadir Ingrediente</Text>
            </TouchableOpacity>
          </View>
          
          {ingredients.map((ing, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <TextInput
                placeholder="Ej. Lechuga"
                placeholderTextColor="#839958"
                value={ing.name}
                onChangeText={(text) => updateIngredient(text, index, 'name')}
                className="flex-1 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 mr-2"
              />
              <TextInput
                placeholder="Ej. 4 hojas"
                placeholderTextColor="#839958"
                value={ing.quantity}
                onChangeText={(text) => updateIngredient(text, index, 'quantity')}
                className="w-28 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 text-center mr-2"
              />
              <TouchableOpacity 
                onPress={() => removeIngredient(index)}
                className="w-12 h-12 bg-[#FEE2E2] rounded-xl items-center justify-center border border-[#CC3333]/20"
              >
                <Text className="text-[#CC3333] text-lg">🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-black text-xl font-bold">Instrucciones</Text>
            <TouchableOpacity onPress={addStep}>
              <Text className="text-[#F7F4D5] text-sm font-bold">+ Añadir Paso</Text>
            </TouchableOpacity>
          </View>
          
          {steps.map((step, index) => (
            <View key={index} className="flex-row mb-4">
              <View className="w-8 h-8 bg-[#0A3323] rounded-full items-center justify-center mr-3 mt-1">
                <Text className="text-[#F7F4D5] font-bold">{index + 1}</Text>
              </View>
              <View className="flex-1 flex-row">
                <TextInput
                  placeholder="Describe el paso a paso..."
                  placeholderTextColor="#839958"
                  value={step}
                  onChangeText={(text) => updateStep(text, index)}
                  multiline
                  className="flex-1 bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[60px]"
                />
                <TouchableOpacity 
                  onPress={() => removeStep(index)}
                  className="w-12 h-12 bg-[#FEE2E2] rounded-xl items-center justify-center ml-2 mt-1 border border-[#CC3333]/20"
                >
                  <Text className="text-[#CC3333] text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View className="mb-10 bg-[#EAECE3] p-5 rounded-2xl border border-[#839958]/20">
          <View className="flex-row items-center mb-3">
            <Text className="text-xl mr-2">💡</Text>
            <Text className="text-[#0A3323] text-base font-bold">Consejos del Chef (Opcional)</Text>
          </View>
          <TextInput
            placeholder="Añade un tip o secreto para esta receta..."
            placeholderTextColor="#839958"
            value={chefTips}
            onChangeText={setChefTips}
            multiline
            className="bg-[#F7F4D5] text-black text-base rounded-xl px-4 py-3 min-h-[80px]"
          />
        </View>

        <TouchableOpacity 
          className="bg-[#0A3323] rounded-xl py-4 items-center mb-8"
          onPress={async () => {
            try {
              const nuevaReceta = {
                titulo: title,
                descripcion: description,
                porciones: servings,
                tiempo: prepTime,
                categoria: category || 'Comidas y Platillos',
                chef_tips: chefTips,
                ingredientes: ingredients.filter(i => i.name.trim() !== ''),
                pasos: steps.filter(s => s.trim() !== '')
              };

              const response = await fetch('http://10.40.92.65:3000/api/recetas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaReceta)
              });

              if (response.ok) {
                alert('¡Receta publicada con éxito!');
                // ¡CORRECCIÓN AQUÍ! Cambiamos 'Inicio' por 'Main'
                navigation.navigate('Main'); 
              } else {
                alert('Error al publicar la receta.');
              }
            } catch (error) {
              console.error(error);
              alert('Error de conexión con el servidor.');
            }
          }}
        >
          <Text className="text-[#F7F4D5] text-lg font-bold">Publicar Receta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}