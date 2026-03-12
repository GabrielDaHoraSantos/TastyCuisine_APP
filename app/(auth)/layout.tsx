import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Rota Inicial (Splash) */}
          <Stack.Screen name="index" />
          
          {/* Grupo de Autenticação */}
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          
          {/* Grupo de Onboarding (Preferências) */}
          <Stack.Screen name="(onboarding)/preferences" />
          
          {/* Grupo Principal (Home - que criaremos a seguir) */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
