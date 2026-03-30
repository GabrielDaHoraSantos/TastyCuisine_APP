import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface LGContainerProps {
  children: React.ReactNode;
  liquidColor?: string;
  fillLevel?: number;
}

export default function LGContainer({ children, liquidColor = '#f5913fff', fillLevel = 0.6 }: LGContainerProps) {
  const waveAnim1 = useRef(new Animated.Value(7)).current;
  const waveAnim2 = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim1, {
        toValue: 1,
        duration: 3000, // Velocidade da primeira onda
        easing: Easing.inOut(Easing.quad), // Movimento mais suave
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(waveAnim2, {
        toValue: 1,
        duration: 4500, // Velocidade da segunda onda (mais lenta)
        easing: Easing.inOut(Easing.quad), // Movimento mais suave
        useNativeDriver: true,
      })
    ).start();
  }, [waveAnim1, waveAnim2]);

  const translateX1 = waveAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, 0],
  });

  const translateX2 = waveAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  // Ajuste a altura da onda para ser mais dinâmica
  const waveHeight = 30; // Altura base da onda

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.glassCard}>
        <View style={[styles.liquidContainer, { height: `${fillLevel * 100}%` }]}>
          {/* Primeira Onda */}
          <Animated.View style={[styles.waveWrapper, { transform: [{ translateX: translateX1 }] }]}>
            <Svg height={waveHeight * 2} width={width * 2} viewBox={`0 0 ${width * 2} ${waveHeight * 2}`}>
              <Path
                d={`M 0 ${waveHeight} Q ${width / 2} 0 ${width} ${waveHeight} T ${width * 2} ${waveHeight} V ${waveHeight * 2} H 0 Z`}
                fill={liquidColor}
                opacity={0.8} // Um pouco mais transparente para a primeira onda
                stroke="none"
              />
            </Svg>
          </Animated.View>

          {/* Segunda Onda (com offset e cor ligeiramente diferente) */}
          <Animated.View style={[styles.waveWrapper, { transform: [{ translateX: translateX2 }], top: -waveHeight / 2 }]}>
            <Svg height={waveHeight * 2} width={width * 2} viewBox={`0 0 ${width * 2} ${waveHeight * 2}`}>
              <Path
                d={`M 0 ${waveHeight} Q ${width / 4} ${waveHeight * 1.5} ${width / 2} ${waveHeight} T ${width * 2} ${waveHeight} V ${waveHeight * 2} H 0 Z`}
                fill={liquidColor}
                opacity={0.6} // Mais transparente para a segunda onda
                stroke="none"
              />
            </Svg>
          </Animated.View>

          <View style={[styles.liquidBase, { backgroundColor: liquidColor, opacity: 1 }]} />
        </View>

        <View style={styles.content}>
          {children}
        </View>

        <View style={styles.glassBorder} />
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'hsla(178, 28%, 80%, 0.61)'
  },
  glassCard: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'hsla(178, 84%, 51%, 1.00)'
  },
  liquidContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  },
  waveWrapper: {
    position: 'absolute',
    top: -30,
    width: width * 2
  },
  liquidBase: {
    flex: 1,
    marginTop: 25
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  glassBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 0, borderWidth: 0, pointerEvents: 'none' },
});

