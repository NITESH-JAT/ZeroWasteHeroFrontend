import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { appPages, type AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { ReportWasteScreen } from "./ReportWasteScreen";
import { CreateCampaignScreen } from "./CreateCampaignScreen";
import { CloseTaskScreen } from "./CloseTaskScreen";
import { VerifyQueueScreen } from "./VerifyQueueScreen";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Page">;

function navigateToAction(
  navigation: RootNavigation,
  action?: { label: string; pageId?: AppPageId; tab?: "Home" | "Explore" | "Action" | "Rewards" | "Profile" }
) {
  if (!action) {
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  if (action.pageId) {
    navigation.push("Page", { pageId: action.pageId });
    return;
  }

  if (action.tab) {
    navigation.navigate("MainTabs", { screen: action.tab });
  }
}

export function DetailScreen({ route }: DetailScreenProps) {
  const navigation = useNavigation<RootNavigation>();

  if (route.params.pageId === "reportWaste") {
    return <ReportWasteScreen />;
  }

  const page = appPages[route.params.pageId];

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerLabel}>Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroCard, { borderColor: `${page.accent}33` }]}>
            <View style={[styles.heroGlow, { backgroundColor: `${page.accent}18` }]} />
            <View style={[styles.heroIconWrap, { backgroundColor: `${page.accent}18` }]}>
              <MaterialCommunityIcons name={page.icon as any} size={32} color={page.accent} />
            </View>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.subtitle}>{page.subtitle}</Text>

            <View style={styles.statsRow}>
              {page.stats.map((stat) => (
                <View key={stat.label} style={styles.statPill}>
                  <Text style={[styles.statValue, { color: page.accent }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {page.sections.map((section) => (
            <View key={section.title} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item) => (
                <View key={item} style={styles.sectionRow}>
                  <View style={[styles.sectionDot, { backgroundColor: page.accent }]} />
                  <Text style={styles.sectionItem}>{item}</Text>
                </View>
              ))}
            </View>
          ))}

          {(page.primaryAction || page.secondaryAction) && (
            <View style={styles.actionGroup}>
              {page.primaryAction && (
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryAction,
                    { backgroundColor: page.accent },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => navigateToAction(navigation, page.primaryAction)}
                >
                  <Text style={styles.primaryActionText}>{page.primaryAction.label}</Text>
                </Pressable>
              )}
              {page.secondaryAction && (
                <Pressable
                  style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
                  onPress={() => navigateToAction(navigation, page.secondaryAction)}
                >
                  <Text style={styles.secondaryActionText}>{page.secondaryAction.label}</Text>
                </Pressable>
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC" },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerLabel: { fontSize: 14, fontWeight: "700", color: "#64748B" },
  headerSpacer: { width: 42, height: 42 },
  scrollContent: { padding: 24 },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
  },
  heroGlow: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
    marginBottom: 20,
  },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statPill: {
    minWidth: 96,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statValue: { fontSize: 18, fontWeight: "800", marginBottom: 2 },
  statLabel: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 12 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 10,
  },
  sectionItem: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
    fontWeight: "500",
  },
  actionGroup: { gap: 12, marginTop: 8 },
  primaryAction: { paddingVertical: 16, borderRadius: 18, alignItems: "center" },
  primaryActionText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  secondaryAction: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  secondaryActionText: { color: "#0F172A", fontSize: 15, fontWeight: "700" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});





