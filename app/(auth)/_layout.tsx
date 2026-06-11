'use client';

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Telas Iniciais */}
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(onboarding)/preferences" />
          
          {/* O Stack chama o grupo (tabs), que tem sua própria barra inferior */}
          <Stack.Screen name="(tabs)" />
          
          {/* Tela de Detalhes do Prato (fora das abas) */}
          <Stack.Screen name="Sobpo/[id]" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
