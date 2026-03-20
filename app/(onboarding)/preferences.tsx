import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions, FlatList, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { QUESTIONS, Question, Option } from '../../src/data/questions';
import LGContainer from '../../src/components/LGContainer';



const { width } = Dimensions.get('window');

export default function PreferencesScreen() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string[] }>({});
  const progressAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion: Question = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  useEffect(() => {
    const progress = (currentQuestionIndex + 1) / QUESTIONS.length;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const SINGLE_SELECTION_QUESTIONS = ["q3", "q4", "q6"]; // Nível de habilidade, Frequência, Tempo médio

  const toggleOption = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => {
      const currentSelections = prev[questionId] || [];

      if (currentSelections.includes(optionId)) {
        return { ...prev, [questionId]: currentSelections.filter(id => id !== optionId) };
      }

      if (SINGLE_SELECTION_QUESTIONS.includes(questionId)) {
        return { ...prev, [questionId]: [optionId] }; // Substitui a seleção anterior
      }

      return { ...prev, [questionId]: [...currentSelections, optionId] };
    });
  };

  // --- INSERIR LOGO ABAIXO DA FUNÇÃO ANTERIOR ---
  const MANDATORY_SELECTION_QUESTIONS = ["q2"]; // Apenas Restrição Alimentar é obrigatória

  const canAdvance = () => {
    if (MANDATORY_SELECTION_QUESTIONS.includes(currentQuestion.id)) {
      return (selectedAnswers[currentQuestion.id]?.length || 0) > 0;
    }
    return true; // Outras perguntas são opcionais
  };

  const handleNext = () => {
    if (!canAdvance()) return;

    if (isLastQuestion) {
      router.replace('/home');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }




    const toggleOption = (questionId: string, optionId: string) => {
      setSelectedAnswers(prev => {
        const currentSelections = prev[questionId] || [];
        if (currentSelections.includes(optionId)) {
          return { ...prev, [questionId]: currentSelections.filter(id => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...currentSelections, optionId] };
        }
      });
    };

    const handleNext = () => {
      if (isLastQuestion) {
        // Aqui você pode salvar as preferências do usuário
        console.log('Preferências Salvas:', selectedAnswers);
        router.replace('/home'); // Redireciona para a home após a última pergunta
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    };

    const handleBack = () => {
      if (!isFirstQuestion) {
        setCurrentQuestionIndex(prev => prev - 1);
      }
    };

    const renderOption = ({ item }: { item: Option }) => {
      const isSelected = selectedAnswers[currentQuestion.id]?.includes(item.id);
      return (
        <TouchableOpacity
          style={[
            styles.optionCard,
            isSelected && styles.optionCardSelected
          ]}
          onPress={() => toggleOption(currentQuestion.id, item.id)}
        >
          <Text style={[
            styles.optionText,
            isSelected && styles.optionTextSelected
          ]}>{item.text}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <LGContainer liquidColor="#FF6347" fillLevel={0.4}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]}
          />
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          <FlatList
            data={currentQuestion.options}
            keyExtractor={(item) => item.id}
            renderItem={renderOption}
            numColumns={2} // Para exibir em duas colunas como no Figma
            contentContainerStyle={styles.optionsList}
          />

          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={[styles.navButton, isFirstQuestion && styles.navButtonDisabled]}
              onPress={handleBack}
              disabled={isFirstQuestion}
            >
              <Text style={styles.navButtonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navButton, !canAdvance() && styles.navButtonDisabled]}
              onPress={handleNext}
              disabled={!canAdvance()}
            >
              <Text style={styles.navButtonText}>{isLastQuestion ? 'Finalizar' : 'Avançar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LGContainer>
    );
  }

  const styles = StyleSheet.create({
    progressBarContainer: {
      width: '85%',
      height: 12,
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 6,
      marginTop: 40,
      marginBottom: 30,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#FF6347',
      borderRadius: 6,
    },
    questionCard: {
      width: '110%',
      height: '80%',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 25,
      padding: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 12,
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
    },
    questionText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 25,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    optionsList: {
      justifyContent: 'space-around',
      width: '95%',
      paddingHorizontal: 5,
    },
    optionCard: {
      width: '46%', // Ajustado para melhor espaçamento em duas colunas
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 15,
      padding: 15,
      marginVertical: 10,
      marginHorizontal: '2%',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 90,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
    },
    optionCardSelected: {
      backgroundColor: '#FF6347',
      borderColor: '#FFD700',
      borderWidth: 2,
      shadowColor: '#FFD700',
      shadowOpacity: 0.6,
      shadowRadius: 8,
    },
    optionText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    optionTextSelected: {
      color: '#FFF',
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '95%',
      marginTop: 40,
    },
    navButton: {
      backgroundColor: '#FF6347',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 15,
      width: '45%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 10,
    },
    navButtonDisabled: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      shadowOpacity: 0,
      elevation: 0,
    },
    navButtonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });
  }