/**
 * Loading skeleton for async data
 */
import React, { useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { colors, spacing } from "@/constants/theme";

interface SkeletonLineProps {
  width?: string | number;
  height?: number;
  style?: object;
}

export function SkeletonLine({ width = "100%", height = 16, style }: SkeletonLineProps) {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        { width, height, opacity },
        style,
      ]}
    />
  );
}

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonLine width={80} height={32} style={styles.clock} />
      <View style={styles.list}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <SkeletonLine key={i} height={24} style={styles.listItem} />
        ))}
      </View>
    </View>
  );
}

export function StatsSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonLine width={120} height={24} style={styles.clock} />
      <SkeletonLine width="90%" height={120} style={styles.chart} />
      <View style={styles.list}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLine key={i} height={20} style={styles.listItem} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonLine: {
    backgroundColor: colors.gray,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  clock: {
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  listItem: {
    marginBottom: spacing.sm,
  },
  chart: {
    marginVertical: spacing.lg,
    borderRadius: 4,
  },
});
