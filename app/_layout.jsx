import { Stack } from 'expo-router';
import { ThemeProvider } from 'themeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="dish/[id]" />
    </Stack>
    </ThemeProvider>
  );
}
