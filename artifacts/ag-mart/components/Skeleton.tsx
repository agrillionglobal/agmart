import { useEffect } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

export function Skeleton({ style }: { style?: ViewStyle }) {
  const colors = useColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.muted, borderRadius: 8 },
        style,
        animatedStyle,
      ]}
    />
  );
}
