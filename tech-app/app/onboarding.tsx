import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, spacing, timings } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  stage: string;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stage: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const totalSteps = 3;

  const handleNext = () => {
    if (!isStepValid()) return;
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Onboarding complete:', formData);
      router.push('/assessment');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.length > 0;
      case 1:
        return formData.email.length > 0 && 
               formData.password.length >= 6 && 
               formData.password === formData.confirmPassword;
      case 2:
        return formData.stage.length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animatable.View
            animation="slideInRight"
            duration={timings.normal}
            style={commonStyles.card}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Icon
                name="person-add-outline"
                size={32}
                color={colors.primary}
                background={true}
                backgroundColor={colors.surface}
                animated={true}
                animation="bounceIn"
              />
              <Text style={[commonStyles.heading, { textAlign: 'center', marginTop: spacing.md }]}>
                Let&apos;s get to know you
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                Tell us your name to personalize your experience
              </Text>
            </View>

            <View>
              <Text style={[commonStyles.textSecondary, { marginBottom: spacing.sm }]}>
                Full Name
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  focusedField === 'name' && commonStyles.inputFocused,
                ]}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textMuted}
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </Animatable.View>
        );

      case 1:
        return (
          <Animatable.View
            animation="slideInRight"
            duration={timings.normal}
            style={commonStyles.card}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Icon
                name="mail-outline"
                size={32}
                color={colors.primary}
                background={true}
                backgroundColor={colors.surface}
                animated={true}
                animation="bounceIn"
              />
              <Text style={[commonStyles.heading, { textAlign: 'center', marginTop: spacing.md }]}>
                Create your account
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                Set up your login credentials
              </Text>
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: spacing.sm }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  focusedField === 'email' && commonStyles.inputFocused,
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={{ marginBottom: spacing.md }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: spacing.sm }]}>
                Password
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  focusedField === 'password' && commonStyles.inputFocused,
                ]}
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor={colors.textMuted}
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text style={[commonStyles.textSecondary, { marginBottom: spacing.sm }]}>
                Confirm Password
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  focusedField === 'confirmPassword' && commonStyles.inputFocused,
                  formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 && commonStyles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0 && (
                <Text style={[commonStyles.textSecondary, { color: colors.error, fontSize: 12 }]}>
                  Passwords do not match
                </Text>
              )}
            </View>
          </Animatable.View>
        );

      case 2:
        return (
          <Animatable.View
            animation="slideInRight"
            duration={timings.normal}
            style={commonStyles.card}
          >
            <View style={{ alignItems: 'center', marginBottom: spacing.xl }}>
              <Icon
                name="school-outline"
                size={32}
                color={colors.primary}
                background={true}
                backgroundColor={colors.surface}
                animated={true}
                animation="bounceIn"
              />
              <Text style={[commonStyles.heading, { textAlign: 'center', marginTop: spacing.md }]}>
                What&apos;s your current stage?
              </Text>
              <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
                This helps us customize your learning path
              </Text>
            </View>

            <View>
              {[
                { value: 'beginner', label: 'Complete Beginner', desc: 'New to tech and programming' },
                { value: 'intermediate', label: 'Some Experience', desc: 'Have some coding knowledge' },
                { value: 'job-seeker', label: 'Job Ready', desc: 'Looking for entry-level positions' },
              ].map((option, index) => (
                <Animatable.View
                  key={option.value}
                  animation="fadeInUp"
                  delay={index * 100}
                  duration={timings.normal}
                >
                  <Button
                    onPress={() => updateFormData('stage', option.value)}
                    variant={formData.stage === option.value ? 'primary' : 'secondary'}
                    style={{ marginBottom: spacing.md }}
                  >
                    <View style={{ alignItems: 'center' }}>
                      <Text style={[
                        commonStyles.text,
                        { 
                          color: formData.stage === option.value ? colors.text : colors.primary,
                          fontWeight: '600',
                          marginBottom: spacing.xs,
                        }
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={[
                        commonStyles.textSecondary,
                        { 
                          color: formData.stage === option.value ? colors.textSecondary : colors.textMuted,
                          fontSize: 12,
                          marginBottom: 0,
                        }
                      ]}>
                        {option.desc}
                      </Text>
                    </View>
                  </Button>
                </Animatable.View>
              ))}
            </View>
          </Animatable.View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.background, colors.backgroundAlt]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={commonStyles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Indicator */}
          <Animatable.View
            animation="fadeInDown"
            duration={timings.normal}
            style={{ marginBottom: spacing.xl }}
          >
            <View style={commonStyles.rowBetween}>
              <Text style={commonStyles.textSecondary}>
                Step {currentStep + 1} of {totalSteps}
              </Text>
              <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </Text>
            </View>
            <View style={commonStyles.progressContainer}>
              <Animatable.View
                style={[
                  commonStyles.progressBar,
                  { width: `${((currentStep + 1) / totalSteps) * 100}%` }
                ]}
                animation="slideInLeft"
                duration={timings.normal}
              />
            </View>
          </Animatable.View>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={200}
            style={commonStyles.buttonContainer}
          >
            <View style={commonStyles.buttonSpacing}>
              <Button
                text={currentStep === totalSteps - 1 ? 'Complete Setup' : 'Continue'}
                onPress={handleNext}
                disabled={!isStepValid()}
                variant="primary"
                icon={<Icon name="arrow-forward" size={20} color={colors.text} />}
              />
            </View>
            
            <Button
              text={currentStep === 0 ? 'Back to Welcome' : 'Previous'}
              onPress={handleBack}
              variant="ghost"
              icon={<Icon name="arrow-back" size={18} color={colors.textSecondary} />}
            />
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}