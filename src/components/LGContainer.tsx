import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';

interface LGContainerProps {
  children: React.ReactNode;
  liquidColor?: string;
  fillLevel?: number;
}

const FOOD_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80';

export default function LGContainer({ children }: LGContainerProps) {
  return (
    <ImageBackground source={{ uri: FOOD_BG }} style={styles.bg} resizeMode="cover">
      <View style={styles.overlay} />
      <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
});
