import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, spacing, timings } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

interface AssessmentData {
  interests: string[];
  careerGoal: string;
  timeCommitment: string;
  learningStyle: string;
  experience: string;
}

interface Question {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple';
  options: { id: string; label: string; description?: string; icon?: string }[];
}

const questions: Question[] = [
  {
    id: 'interests',
    title: 'What interests you most?',
    description: 'Select all areas that spark your curiosity',
    type: 'multiple',
    options: [
      { id: 'frontend', label: 'Frontend Development', description: 'User interfaces & experiences', icon: 'phone-portrait-outline' },
      { id: 'backend', label: 'Backend Development', description: 'Server-side logic & databases', icon: 'server-outline' },
      { id: 'fullstack', label: 'Full-Stack Development', description: 'Both frontend & backend', icon: 'layers-outline' },
      { id: 'mobile', label: 'Mobile Development', description: 'iOS & Android apps', icon: 'phone-portrait-outline' },
    ],
  },
  {
    id: 'careerGoal',
    title: 'What\'s your career goal?',
    description: 'Choose your primary objective',
    type: 'single',
    options: [
      { id: 'career-change', label: 'Career Change', description: 'Switch to tech from another field', icon: 'swap-horizontal-outline' },
      { id: 'skill-upgrade', label: 'Skill Upgrade', description: 'Enhance existing tech skills', icon: 'trending-up-outline' },
      { id: 'first-job', label: 'First Tech Job', description: 'Land your first role in tech', icon: 'briefcase-outline' },
      { id: 'freelance', label: 'Freelancing', description: 'Work as an independent developer', icon: 'person-outline' },
    ],
  },
  {
    id: 'timeCommitment',
    title: 'How much time can you dedicate?',
    description: 'Be realistic about your availability',
    type: 'single',
    options: [
      { id: '1-2', label: '1-2 hours/day', description: 'Part-time learning', icon: 'time-outline' },
      { id: '3-4', label: '3-4 hours/day', description: 'Serious commitment', icon: 'time-outline' },
      { id: '5+', label: '5+ hours/day', description: 'Full-time dedication', icon: 'time-outline' },
      { id: 'weekend', label: 'Weekends only', description: 'Weekend warrior', icon: 'calendar-outline' },
    ],
  },
  {
    id: 'learningStyle',
    title: 'How do you learn best?',
    description: 'Choose your preferred learning method',
    type: 'single',
    options: [
      { id: 'video', label: 'Video Tutorials', description: 'Visual and auditory learning', icon: 'play-circle-outline' },
      { id: 'reading', label: 'Reading & Documentation', description: 'Text-based learning', icon: 'book-outline' },
      { id: 'hands-on', label: 'Hands-on Projects', description: 'Learning by building', icon: 'construct-outline' },
      { id: 'mixed', label: 'Mixed Approach', description: 'Combination of methods', icon: 'shuffle-outline' },
    ],
  },
];

export default function AssessmentScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(false);

  const question = questions[currentQuestion];
  const totalQuestions = questions.length;

  const handleAnswer = (questionId: string, answerId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    if (question.type === 'multiple') {
      const currentAnswers = (answers[questionId] as string[]) || [];
      const newAnswers = currentAnswers.includes(answerId)
        ? currentAnswers.filter(id => id !== answerId)
        : [...currentAnswers, answerId];
      setAnswers(prev => ({ ...prev, [questionId]: newAnswers }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    }
  };

  const handleNext = () => {
    if (!isQuestionAnswered()) return;

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.back();
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    console.log('Assessment complete:', answers);
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      router.push('/roadmap');
    }, 2000);
  };

  const isQuestionAnswered = () => {
    const answer = answers[question.id];
    if (question.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return typeof answer === 'string' && answer.length > 0;
  };

  const isSelected = (optionId: string) => {
    const answer = answers[question.id];
    if (question.type === 'multiple') {
      return Array.isArray(answer) && answer.includes(optionId);
    }
    return answer === optionId;
  };

  return (
    <View style={commonStyles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundAlt]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={commonStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={timings.normal}
            style={{ marginBottom: spacing.xl }}
          >
            <View style={commonStyles.rowBetween}>
              <Text style={commonStyles.textSecondary}>
                Question {currentQuestion + 1} of {totalQuestions}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
              </Text>
            </View>
            <View style={commonStyles.progressContainer}>
              <Animatable.View
                style={[
                  commonStyles.progressBar,
                  { width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }
                ]}
                animation="slideInLeft"
                duration={timings.normal}
              />
            </View>
          </Animatable.View>

          {/* Question */}
          <Animatable.View
            animation="slideInRight"
            duration={timings.normal}
            style={[commonStyles.card, { marginBottom: spacing.xl }]}
          >
            <View key={question.id} style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Icon
                name="help-circle-outline"
                size={32}
                color={colors.primary}
                background={true}
                backgroundColor={colors.surface}
                animated={true}
                animation="bounceIn"
              />
              <Text style={[commonStyles.heading, { textAlign: 'center', marginTop: spacing.md }]}>
                {question.title}
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                {question.description}
              </Text>
            </View>

            {/* Options */}
            <View>
              {question.options.map((option, index) => (
                <Animatable.View
                  key={option.id}
                  animation="fadeInUp"
                  delay={index * 100}
                  duration={timings.normal}
                >
                  <Button
                    onPress={() => handleAnswer(question.id, option.id)}
                    variant={isSelected(option.id) ? 'primary' : 'secondary'}
                    style={{ marginBottom: spacing.md }}
                  >
                    <View style={commonStyles.rowBetween}>
                      <View style={commonStyles.row}>
                        {option.icon && (
                          <Icon
                            name={option.icon as any}
                            size={20}
                            color={isSelected(option.id) ? colors.text : colors.primary}
                            style={{ marginRight: spacing.sm }}
                          />
                        )}
                        <View>
                          <Text style={[
                            commonStyles.text,
                            { 
                              color: isSelected(option.id) ? colors.text : colors.primary,
                              fontWeight: '600',
                              marginBottom: option.description ? spacing.xs : 0,
                            }
                          ]}>
                            {option.label}
                          </Text>
                          {option.description && (
                            <Text style={[
                              commonStyles.textSecondary,
                              { 
                                color: isSelected(option.id) ? colors.textSecondary : colors.textMuted,
                                fontSize: 12,
                                marginBottom: 0,
                              }
                            ]}>
                              {option.description}
                            </Text>
                          )}
                        </View>
                      </View>
                      {isSelected(option.id) && (
                        <Icon
                          name="checkmark-circle"
                          size={20}
                          color={colors.text}
                          animated={true}
                          animation="bounceIn"
                        />
                      )}
                    </View>
                  </Button>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>

          {/* Navigation */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={200}
            style={commonStyles.buttonContainer}
          >
            <View style={commonStyles.buttonSpacing}>
              <Button
                text={currentQuestion === totalQuestions - 1 ? 'Generate My Roadmap' : 'Next Question'}
                onPress={handleNext}
                disabled={!isQuestionAnswered()}
                loading={loading}
                variant="primary"
                icon={!loading ? <Icon name="arrow-forward" size={20} color={colors.text} /> : undefined}
              />
            </View>
            
            <Button
              text={currentQuestion === 0 ? 'Back to Setup' : 'Previous Question'}
              onPress={handleBack}
              variant="ghost"
              disabled={loading}
              icon={<Icon name="arrow-back" size={18} color={colors.textSecondary} />}
            />
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}