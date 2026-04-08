//src/components/ui/ScreenSafeArea.tsx
import { PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { appTheme } from "../../theme";

type Props = PropsWithChildren<{
  edges?: readonly Edge[];
  style?: ViewStyle;
}>;

/** Reserves space for the status bar (notch / dynamic island) so UI does not sit under system chrome. */
export function ScreenSafeArea({
  children,
  edges = ["top"],
  style,
}: Props) {
  return (
    <SafeAreaView style={[styles.root, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: appTheme.colors.background,
  },
});
