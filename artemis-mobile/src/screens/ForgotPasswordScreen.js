import React, { useState } from "react";
import { View, ScrollView, Text, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../config/api";

// Flujo en dos pasos: 1) pedir un código de 6 dígitos por correo,
// 2) escribir ese código + la contraseña nueva. Se puede entrar aquí sin
// sesión (desde Login) o ya logueado (desde Ajustes de Cuenta, con el correo
// precargado).
export default function ForgotPasswordScreen({ navigation, route }) {
  const prefilledEmail = route?.params?.email || '';
  const [step, setStep] = useState('request'); // 'request' | 'confirm' | 'success'
  const [email, setEmail] = useState(prefilledEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestCode = async () => {
    setErrorMessage('');
    if (!email.trim()) {
      setErrorMessage('Escribe tu correo electrónico.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/olvide-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo procesar la solicitud.');
      }
      setStep('confirm');
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReset = async () => {
    setErrorMessage('');
    if (!code.trim() || !password) {
      setErrorMessage('Escribe el código y tu nueva contraseña.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/restablecer-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo restablecer tu contraseña.');
      }
      setStep('success');
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#839958]">
      <StatusBar barStyle="light-content" backgroundColor="#839958" />

      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Text className="text-[#F7F4D5] text-2xl font-bold">←</Text>
        </TouchableOpacity>
        <Text className="text-[#F7F4D5] text-xl font-bold flex-1 text-center mr-10">
          Recuperar Contraseña
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} keyboardShouldPersistTaps="handled">

        {step === 'success' ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-20 h-20 bg-[#F7F4D5]/20 rounded-full items-center justify-center mb-6">
              <Text className="text-[#F7F4D5] text-4xl font-bold">✓</Text>
            </View>
            <Text className="text-[#F7F4D5] text-2xl font-bold mb-2 text-center">¡Contraseña actualizada!</Text>
            <Text className="text-[#F7F4D5] text-base text-center mb-8">Ya puedes iniciar sesión con tu nueva contraseña.</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] w-full"
            >
              <Text className="text-[#F7F4D5] text-lg font-bold">Ir a Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        ) : step === 'confirm' ? (
          <View>
            <Text className="text-[#F7F4D5] text-base leading-relaxed mb-6">
              Te enviamos un código de 6 dígitos a {email}. Escríbelo junto con tu nueva contraseña.
            </Text>

            {errorMessage !== '' && (
              <Text className="text-[#FFB4B4] text-sm font-bold mb-4 ml-1">{errorMessage}</Text>
            )}

            <View className="mb-5">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">Código de 6 dígitos</Text>
              <TextInput
                className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
                placeholder="123456"
                placeholderTextColor="#D9D9D980"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-5">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">Nueva contraseña</Text>
              <TextInput
                className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-8">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">Confirmar contraseña</Text>
              <TextInput
                className="text-[#F7F4D5] text-base border border-[#D9D9D9] rounded-2xl px-4 min-h-[56px]"
                placeholder="••••••••"
                placeholderTextColor="#D9D9D980"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!isSubmitting}
              />
            </View>

            <TouchableOpacity
              onPress={handleConfirmReset}
              disabled={isSubmitting}
              className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] mb-4 flex-row"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? <ActivityIndicator color="#F7F4D5" /> : (
                <Text className="text-[#F7F4D5] text-lg font-bold">Actualizar Contraseña</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setStep('request')} className="self-center py-2 min-h-[48px] justify-center">
              <Text className="text-[#0A3323] text-base font-bold">¿No te llegó? Solicitar otro código</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text className="text-[#F7F4D5] text-base leading-relaxed mb-6">
              Escribe tu correo y te mandaremos un código para crear una nueva contraseña.
            </Text>

            {errorMessage !== '' && (
              <Text className="text-[#FFB4B4] text-sm font-bold mb-4 ml-1">{errorMessage}</Text>
            )}

            <View className="mb-8">
              <Text className="text-[#F7F4D5] text-base font-medium mb-2 ml-1">Correo Electrónico</Text>
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

            <TouchableOpacity
              onPress={handleRequestCode}
              disabled={isSubmitting}
              className="bg-[#0A3323] rounded-2xl items-center justify-center min-h-[56px] flex-row"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? <ActivityIndicator color="#F7F4D5" /> : (
                <Text className="text-[#F7F4D5] text-lg font-bold">Enviar Código</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
