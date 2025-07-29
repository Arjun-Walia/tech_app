import React, { useEffect } from 'react';
import { Text, View, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors, spacing, animations, timings } from '../styles/commonStyles';
import Icon from '../components/Icon';
import Button from '../components/Button';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  useEffect(() => {
    console.log('Welcome screen loaded');
  }, []);

  const handleGetStarted = () => {
    console.log('Get Started pressed');
    router.push('/onboarding');
  };

  const handleLogin = () => {
    console.log('Login pressed');
    router.push('/login');
  };

  return (
    <View style={commonStyles.container}>
      <LinearGradient
        colors={[colors.background, colors.backgroundAlt]}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={commonStyles.scrollView}
          contentContainerStyle={[
            commonStyles.centerContent,
            { minHeight: height - 100 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <Animatable.View
            animation="fadeInDown"
            duration={timings.slow}
            delay={200}
            style={{ alignItems: 'center', marginBottom: spacing.xxl }}
          >
            <Animatable.View
              animation="bounceIn"
              duration={timings.slow}
              delay={400}
              style={commonStyles.iconContainer}
            >
              <Icon
                name="rocket-outline"
                size={32}
                color={colors.text}
                animated={true}
                animation="pulse"
              />
            </Animatable.View>

            <Animatable.Text
              animation="fadeInUp"
              duration={timings.normal}
              delay={600}
              style={[
                commonStyles.title,
                {
                  fontSize: 36,
                  fontWeight: '800',
                  marginBottom: spacing.md,
                  textAlign: 'center',
                }
              ]}
            >
              TechPath
            </Animatable.Text>

            <Animatable.Text
              animation="fadeInUp"
              duration={timings.normal}
              delay={800}
              style={[
                commonStyles.textSecondary,
                {
                  fontSize: 18,
                  textAlign: 'center',
                  lineHeight: 26,
                  marginBottom: spacing.xl,
                  paddingHorizontal: spacing.lg,
                }
              ]}
            >
              Your personalized journey to a successful tech career starts here
            </Animatable.Text>
          </Animatable.View>

          {/* Features Section */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={1000}
            style={{ width: '100%', marginBottom: spacing.xxl }}
          >
            <FeatureCard
              icon="person-outline"
              title="Personalized Learning"
              description="Get a customized roadmap based on your goals and experience"
              delay={1200}
            />
            <FeatureCard
              icon="trending-up-outline"
              title="Track Progress"
              description="Monitor your learning journey with detailed progress tracking"
              delay={1400}
            />
            <FeatureCard
              icon="library-outline"
              title="Curated Resources"
              description="Access hand-picked learning materials and practice exercises"
              delay={1600}
            />
          </Animatable.View>

          {/* Action Buttons */}
          <Animatable.View
            animation="fadeInUp"
            duration={timings.normal}
            delay={1800}
            style={[commonStyles.buttonContainer, { width: '100%' }]}
          >
            <View style={commonStyles.buttonSpacing}>
              <Button
                text="Get Started"
                onPress={handleGetStarted}
                variant="primary"
                icon={<Icon name="arrow-forward" size={20} color={colors.text} />}
              />
            </View>
            
            <Button
              text="Already have an account? Sign In"
              onPress={handleLogin}
              variant="ghost"
            />
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

interface FeatureCardProps {
  icon: keyof typeof import('@expo/vector-icons/Ionicons').glyphMap;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <Animatable.View
      animation="slideInLeft"
      duration={timings.normal}
      delay={delay}
      style={[
        commonStyles.cardSmall,
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing.md,
        }
      ]}
    >
      <View style={{ marginRight: spacing.md }}>
        <Icon
          name={icon}
          size={24}
          color={colors.primary}
          background={true}
          backgroundColor={colors.surface}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[commonStyles.heading, { fontSize: 16, marginBottom: spacing.xs }]}>
          {title}
        </Text>
        <Text style={[commonStyles.textSecondary, { marginBottom: 0 }]}>
          {description}
        </Text>
      </View>
    </Animatable.View>
  );
}