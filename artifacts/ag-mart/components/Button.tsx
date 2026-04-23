import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle, TextStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.96, { damping: 10, stiffness: 100 });
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBackgroundColor = () => {
    if (variant === "primary") return colors.primary;
    if (variant === "secondary") return colors.secondary;
    if (variant === "outline" || variant === "ghost") return "transparent";
    return colors.primary;
  };

  const getTextColor = () => {
    if (variant === "primary") return colors.primaryForeground;
    if (variant === "secondary") return colors.secondaryForeground;
    if (variant === "outline" || variant === "ghost") return colors.primary;
    return colors.primaryForeground;
  };

  const getBorderColor = () => {
    if (variant === "outline") return colors.primary;
    return "transparent";
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === "outline" ? 1 : 0,
            opacity: disabled ? 0.5 : 1,
            height: size === "sm" ? 36 : size === "lg" ? 56 : 48,
            paddingHorizontal: size === "sm" ? 16 : size === "lg" ? 32 : 24,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.text,
                { color: getTextColor(), fontSize: size === "sm" ? 14 : size === "lg" ? 18 : 16 },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
  },
});
