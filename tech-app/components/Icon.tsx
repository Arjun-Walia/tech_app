import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, shadows } from '../styles/commonStyles';
import * as Animatable from 'react-native-animatable';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  style?: object;
  containerStyle?: object;
  animated?: boolean;
  animation?: string;
  background?: boolean;
  backgroundColor?: string;
}

export default function Icon({
  name,
  size = 24,
  color = colors.text,
  style,
  containerStyle,
  animated = false,
  animation = 'fadeIn',
  background = false,
  backgroundColor = colors.primary,
}: IconProps) {
  const iconElement = (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );

  const containerStyles = [
    background && {
      width: size + 16,
      height: size + 16,
      borderRadius: borderRadius.full,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.small,
    },
    containerStyle,
  ];

  if (animated) {
    return (
      <Animatable.View
        style={containerStyles}
        animation={animation}
        duration={300}
        useNativeDriver={true}
      >
        {iconElement}
      </Animatable.View>
    );
  }

  return (
    <View style={containerStyles}>
      {iconElement}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});