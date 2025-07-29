import React, { useState } from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, spacing, timings } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

interface FormData {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isFormValid()) return;
    
    setLoading(true);
    console.log('Login attempt:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
    router.push('/onboarding');
  };

  const handleBack = () => {
    console.log('Navigate back');
    router.back();
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email.length > 0 && formData.password.length > 0;
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
          contentContainerStyle={[commonStyles.content, { justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animatable.View
            animation="fadeInDown"
            duration={timings.normal}
            style={{ alignItems: 'center', marginBottom: spacing.xxl }}
          >
            <Animatable.View
              animation="bounceIn"
              duration={timings.slow}
              delay={200}
              style={[commonStyles.iconContainer, { marginBottom: spacing.lg }]}
            >
              <Icon
                name="log-in-outline"
                size={28}
                color={colors.text}
              />
            </Animatable.View>

            <Text style={[commonStyles.title, { marginBottom: spacing.sm }]}>
              Welcome Back
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center' }]}>
              Sign in to continue your learning journey
            </Text>
          </Animatable.View>

          {/* Form */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={400}
            style={commonStyles.card}
          >
            <View style={{ marginBottom: spacing.lg }}>
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

            <View style={{ marginBottom: spacing.xl }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: spacing.sm }]}>
                Password
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  focusedField === 'password' && commonStyles.inputFocused,
                ]}
                placeholder="Enter your password"
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

            <Button
              text="Sign In"
              onPress={handleLogin}
              disabled={!isFormValid()}
              loading={loading}
              variant="primary"
              icon={!loading ? <Icon name="arrow-forward" size={20} color={colors.text} /> : undefined}
            />
          </Animatable.View>

          {/* Footer */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={600}
            style={{ alignItems: 'center', marginTop: spacing.xl }}
          >
            <Text style={[commonStyles.textSecondary, { marginBottom: spacing.md }]}>
              Don&apos;t have an account?
            </Text>
            <Button
              text="Create Account"
              onPress={handleSignUp}
              variant="secondary"
              fullWidth={false}
            />
          </Animatable.View>

          {/* Back Button */}
          <Animatable.View
            animation="fadeIn"
            duration={timings.normal}
            delay={800}
            style={{ alignItems: 'center', marginTop: spacing.lg }}
          >
            <Button
              text="Back to Welcome"
              onPress={handleBack}
              variant="ghost"
              fullWidth={false}
              icon={<Icon name="arrow-back" size={18} color={colors.textSecondary} />}
            />
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}