import React, { useState } from "react";
import { View, ScrollView, Text, Image, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";

export default function AddRecipeScreen({ navigation }) {
  const { authFetch } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  // NUEVO: Lista de categorías oficiales como en la Web
  const [category, setCategory] = useState('Comidas y Platillos');
  const categoriesList = ['Comidas y Platillos', 'Dietas', 'Populares', 'Desayuno', 'Comida', 'Cena'];

  const [chefTips, setChefTips] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState(['']);
  const [isPublishing, setIsPublishing] = useState(false);

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

  const pickCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso necesario', 'Necesitamos acceso a tus fotos para elegir la portada de la receta.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setCoverImage(result.assets[0]);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Falta el título', 'Ponle un nombre a tu receta antes de publicarla.');
      return;
    }

    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append('titulo', title);
      formData.append('descripcion', description);
      formData.append('porciones', servings);
      formData.append('tiempo', prepTime);
      formData.append('categoria', category || 'Comidas y Platillos');
      formData.append('chef_tips', chefTips);
      formData.append('ingredientes', JSON.stringify(ingredients.filter(i => i.name.trim() !== '')));
      formData.append('pasos', JSON.stringify(steps.filter(s => s.trim() !== '')));

      if (coverImage) {
        const uriParts = coverImage.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        formData.append('imagen', {
          uri: coverImage.uri,
          name: `portada.${fileExtension}`,
          type: coverImage.mimeType || `image/${fileExtension}`,
        });
      }

      // No fijamos Content-Type a mano: fetch en RN necesita generar el
      // boundary del multipart automáticamente a partir del FormData.
      const response = await authFetch('/api/recetas', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('¡Listo!', '¡Receta publicada con éxito!');
        navigation.navigate('Main');
      } else {
        const data = await response.json().catch(() => ({}));
        Alert.alert('Error al publicar', data.error || 'No se pudo publicar la receta.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setIsPublishing(false);
    }
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

        <TouchableOpacity
          onPress={pickCoverImage}
          className="bg-[#F7F4D5]/80 border-2 border-dashed border-[#0A3323]/30 rounded-2xl py-12 items-center mb-8 overflow-hidden"
        >
          {coverImage ? (
            <Image source={{ uri: coverImage.uri }} className="w-full h-40 rounded-xl" resizeMode="cover" />
          ) : (
            <>
              <Text className="text-[#0A3323] text-4xl mb-2">📷</Text>
              <Text className="text-[#0A3323] text-base font-bold">Agregar Foto de Portada</Text>
            </>
          )}
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
          className="bg-[#0A3323] rounded-xl py-4 items-center mb-8 flex-row justify-center"
          style={{ opacity: isPublishing ? 0.7 : 1 }}
          disabled={isPublishing}
          onPress={handlePublish}
        >
          {isPublishing ? (
            <ActivityIndicator color="#F7F4D5" />
          ) : (
            <Text className="text-[#F7F4D5] text-lg font-bold">Publicar Receta</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
