//src/components/ui/PrimaryCard.tsx
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { appTheme } from "../../theme";

export function PrimaryCard({ children }: PropsWithChildren) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.colors.surface,
    borderRadius: appTheme.radius.lg,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: appTheme.spacing.lg,
    marginBottom: appTheme.spacing.md,
  },
});
