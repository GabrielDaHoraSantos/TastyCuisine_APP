import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Definindo os tipos para o TypeScript
interface LGContainerProps {
  children: React.ReactNode; // Isso resolve o erro do 'any'
  liquidColor?: string;
  fillLevel?: number;
}

// O 'children' aqui representa tudo o que você colocar dentro da tag <LGContainer>
export default function LGContainer({ children, liquidColor = '#E74C3C', fillLevel = 0.45 }) {
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [waveAnim]);

  const translateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.glassCard}>
        <View style={[styles.liquidContainer, { height: `${fillLevel * 100}%` }]}>
          <Animated.View style={[styles.waveWrapper, { transform: [{ translateX }] }]}>
            <Svg height="60" width={width * 2} viewBox={`0 0 ${width * 2} 60`}>
              <Path d={`M 0 30 Q ${width / 2} 0 ${width} 30 T ${width * 2} 30 V 60 H 0 Z`} fill={liquidColor} opacity={0.4} />
            </Svg>
          </Animated.View>
          <View style={[styles.liquidBase, { backgroundColor: liquidColor, opacity: 0.4 }]} />
        </View>

        {/* AQUI É ONDE O CHILDREN APARECE */}
        <View style={styles.content}>
          {children}
        </View>

        <View style={styles.glassBorder} />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#121212' },
  glassCard: { width: '100%', maxWidth: 400, minHeight: 550, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  liquidContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden' },
  waveWrapper: { position: 'absolute', top: -30, width: width * 2 },
  liquidBase: { flex: 1, marginTop: 25 },
  content: { flex: 1, padding: 30, justifyContent: 'center', zIndex: 10 },
  glassBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 40, borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.1)', pointerEvents: 'none' },
});
