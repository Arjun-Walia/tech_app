import { StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  // Dark theme palette
  primary: '#6366F1',        // Modern indigo
  primaryDark: '#4F46E5',    // Darker indigo
  secondary: '#8B5CF6',      // Purple accent
  accent: '#F59E0B',         // Vibrant orange for highlights
  success: '#10B981',        // Green for progress
  warning: '#F59E0B',        // Orange for warnings
  error: '#EF4444',          // Red for errors
  
  // Dark backgrounds
  background: '#0F0F23',     // Deep dark blue
  backgroundAlt: '#1A1B3A',  // Slightly lighter dark
  surface: '#252547',        // Card/surface color
  surfaceAlt: '#2D2E5F',     // Alternative surface
  
  // Text colors
  text: '#FFFFFF',           // Primary white text
  textSecondary: '#A1A1AA',  // Secondary gray text
  textMuted: '#71717A',      // Muted text
  textAccent: '#6366F1',     // Accent text
  
  // Border and dividers
  border: '#374151',         // Subtle border
  borderLight: '#4B5563',    // Lighter border
  divider: '#374151',        // Divider color
  
  // Overlays and shadows
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  
  // Gradients
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',
  
  // Status colors
  online: '#10B981',
  offline: '#6B7280',
  
  // Interactive states
  pressed: 'rgba(99, 102, 241, 0.1)',
  hover: 'rgba(99, 102, 241, 0.05)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...shadows.medium,
  },
  primaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    minHeight: 52,
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    ...shadows.medium,
  },
  accentText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  ghostText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    minHeight: 40,
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  
  // Typography
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textSecondary: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  textMuted: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  textCenter: {
    textAlign: 'center',
  },
  textAccent: {
    color: colors.textAccent,
  },
  
  // Cards and surfaces
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    width: '100%',
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSmall: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    width: '100%',
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardInteractive: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    width: '100%',
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    backgroundColor: colors.surfaceAlt,
    transform: [{ scale: 0.98 }],
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  flex1: {
    flex: 1,
  },
  
  // Spacing
  mb8: { marginBottom: spacing.sm },
  mb16: { marginBottom: spacing.md },
  mb24: { marginBottom: spacing.lg },
  mt8: { marginTop: spacing.sm },
  mt16: { marginTop: spacing.md },
  mt24: { marginTop: spacing.lg },
  mx16: { marginHorizontal: spacing.md },
  my16: { marginVertical: spacing.md },
  p16: { padding: spacing.md },
  px16: { paddingHorizontal: spacing.md },
  py16: { paddingVertical: spacing.md },
  
  // Progress and indicators
  progressContainer: {
    backgroundColor: colors.border,
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  progressBarGradient: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  
  // Icons
  icon: {
    width: 24,
    height: 24,
    marginRight: spacing.sm,
  },
  iconLarge: {
    width: 48,
    height: 48,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  
  // Forms
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    color: colors.text,
    minHeight: 52,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  inputError: {
    borderColor: colors.error,
  },
  
  // Buttons
  buttonContainer: {
    width: '100%',
    marginTop: spacing.lg,
  },
  buttonSpacing: {
    marginBottom: spacing.md,
  },
  
  // ScrollView
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  
  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  
  // Status indicators
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Animation containers
  fadeIn: {
    opacity: 1,
  },
  slideUp: {
    transform: [{ translateY: 0 }],
  },
  scaleIn: {
    transform: [{ scale: 1 }],
  },
});

// Animation presets
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { opacity: 0, translateY: 50 },
    to: { opacity: 1, translateY: 0 },
  },
  slideDown: {
    from: { opacity: 0, translateY: -50 },
    to: { opacity: 1, translateY: 0 },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
  },
  bounceIn: {
    from: { opacity: 0, scale: 0.3 },
    to: { opacity: 1, scale: 1 },
  },
};

export const timings = {
  fast: 200,
  normal: 300,
  slow: 500,
};