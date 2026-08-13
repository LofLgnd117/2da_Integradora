import React, { useState } from "react";
import { View, ScrollView, Text, Image, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const { register } = useAuth();

  // Estados para los campos del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados independientes para mostrar/ocultar las contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    setErrorMessage("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessage("Completa todos los campos para continuar.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password);
      // Al registrarse con éxito, App.js cambia automáticamente a la app principal.
    } catch (error) {
      setErrorMessage(error.message || "No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

        {/* ENCABEZADO */}
        <View className="px-8 pt-12 mb-10">
          <Text className="text-[#F7F4D5] text-3xl font-bold mb-2">
            Crear Cuenta
          </Text>
          <Text className="text-[#F7F4D5] text-base leading-relaxed">
            Únete a nuestra comunidad de chefs en casa.
          </Text>
        </View>

        {/* FORMULARIO */}
        <View className="px-8 w-full">

          {/* NOMBRE Y APELLIDOS */}
          <View className="flex-row mb-5">
            <View className="flex-1 mr-3">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
                Nombre
              </Text>
              <TextInput
                className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
                placeholder="Juan"
                placeholderTextColor="#D9D9D980"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!isSubmitting}
              />
            </View>
            <View className="flex-1">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
                Apellidos
              </Text>
              <TextInput
                className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
                placeholder="Pérez"
                placeholderTextColor="#D9D9D980"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* CORREO ELECTRÓNICO */}
          <View className="mb-5">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Correo Electrónico
            </Text>
            <TextInput
              className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
              placeholder="correo@ejemplo.com"
              placeholderTextColor="#D9D9D980"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSubmitting}
            />
          </View>

          {/* CONTRASEÑA */}
          <View className="mb-5">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Contraseña
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
              <TextInput
                className="flex-1 text-[#F7F4D5] text-base"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isSubmitting}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="min-h-[48px] min-w-[48px] items-center justify-center -mr-2"
              >
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/u4xqfhz4_expires_30_days.png" }}
                  resizeMode="contain"
                  className="w-5 h-5 opacity-80"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* CONFIRMAR CONTRASEÑA */}
          <View className="mb-6">
            <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">
              Confirmar Contraseña
            </Text>
            <View className="flex-row items-center border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]">
              <TextInput
                className="flex-1 text-[#F7F4D5] text-base"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isSubmitting}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="min-h-[48px] min-w-[48px] items-center justify-center -mr-2"
              >
                <Image
                  source={{ uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/3zdM7I85eL/n3o01xvx_expires_30_days.png" }}
                  resizeMode="contain"
                  className="w-5 h-5 opacity-80"
                />
              </TouchableOpacity>
            </View>
          </View>

          {errorMessage !== "" && (
            <Text className="text-[#FFB4B4] text-sm font-bold mb-4 ml-1">
              {errorMessage}
            </Text>
          )}

          {/* BOTÓN REGISTRARSE */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={isSubmitting}
            className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] mb-6 shadow-sm flex-row"
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#F7F4D5" />
            ) : (
              <Text className="text-[#F7F4D5] text-lg font-bold tracking-wide">
                Registrarse
              </Text>
            )}
          </TouchableOpacity>

          {/* ENLACE DE INICIAR SESIÓN */}
          <View className="flex-row justify-center items-center">
            <Text className="text-[#F7F4D5] text-base">
              ¿Ya tienes una cuenta?
            </Text>
            <TouchableOpacity
              className="min-h-[48px] justify-center px-2"
              // Regresa a la pantalla anterior (Login)
              onPress={() => navigation.goBack()}
            >
              <Text className="text-[#0A3323] text-base font-bold">
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
