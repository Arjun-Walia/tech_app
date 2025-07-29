import React from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors, buttonStyles, timings } from '../styles/commonStyles';
import * as Animatable from 'react-native-animatable';

interface ButtonProps {
  text?: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  text,
  onPress,
  style,
  textStyle,
  disabled = false,
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const getButtonStyle = () => {
    let baseStyle = buttonStyles.primary;
    let baseTextStyle = buttonStyles.primaryText;

    switch (variant) {
      case 'secondary':
        baseStyle = buttonStyles.secondary;
        baseTextStyle = buttonStyles.secondaryText;
        break;
      case 'accent':
        baseStyle = buttonStyles.accent;
        baseTextStyle = buttonStyles.accentText;
        break;
      case 'ghost':
        baseStyle = buttonStyles.ghost;
        baseTextStyle = buttonStyles.ghostText;
        break;
    }

    if (size === 'small') {
      baseStyle = { ...baseStyle, ...buttonStyles.small };
      baseTextStyle = { ...baseTextStyle, ...buttonStyles.smallText };
    }

    return {
      buttonStyle: [
        baseStyle,
        !fullWidth && { alignSelf: 'center' },
        disabled && buttonStyles.disabled,
        style,
      ],
      textStyle: [baseTextStyle, textStyle],
    };
  };

  const { buttonStyle, textStyle: finalTextStyle } = getButtonStyle();

  const handlePress = () => {
    if (!disabled && !loading) {
      onPress();
    }
  };

  return (
    <Animatable.View
      animation="pulse"
      duration={timings.fast}
      useNativeDriver={true}
    >
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        activeOpacity={disabled || loading ? 1 : 0.8}
        disabled={disabled || loading}
      >
        <Animatable.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          animation={loading ? 'pulse' : undefined}
          iterationCount="infinite"
          duration={1000}
        >
          {icon && !loading && (
            <Animatable.View
              style={{ marginRight: text ? 8 : 0 }}
              animation="fadeIn"
              duration={timings.normal}
            >
              {icon}
            </Animatable.View>
          )}
          
          {loading && (
            <Animatable.View
              style={{ marginRight: text ? 8 : 0 }}
              animation="rotate"
              iterationCount="infinite"
              duration={1000}
            >
              <Text style={[finalTextStyle, { fontSize: 16 }]}>⟳</Text>
            </Animatable.View>
          )}

          {children || (
            <Text style={finalTextStyle}>
              {loading ? 'Loading...' : text}
            </Text>
          )}
        </Animatable.View>
      </TouchableOpacity>
    </Animatable.View>
  );
}