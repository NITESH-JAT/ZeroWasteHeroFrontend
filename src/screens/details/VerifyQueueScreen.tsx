import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { RootStackParamList } from "../../navigation/types";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

type QueueItem = {
  id: string;
  title: string;
  proof: string;
  location: string;
};

const queueItems: QueueItem[] = [
  {
    id: "1",
    title: "Overflow bin near Market Road",
    proof: "2 images + GPS match",
    location: "Market Road, Ward 4",
  },
  {
    id: "2",
    title: "Illegal dumping beside lake road",
    proof: "1 image + landmark note",
    location: "Lake Road bend, Zone C",
  },
  {
    id: "3",
    title: "Mixed waste near Block C park gate",
    proof: "3 images + pin mismatch",
    location: "Block C Park",
  },
] as const;

const decisionOptions = [
  { id: "approve", label: "Approve", color: "#00D65B", icon: "check-decagram-outline" },
  { id: "reject", label: "Reject", color: "#F43F5E", icon: "close-octagon-outline" },
  { id: "clarify", label: "Request Clarification", color: "#0EA5E9", icon: "message-alert-outline" },
  { id: "escalate", label: "Escalate", color: "#8B5CF6", icon: "alert-octagon-outline" },
] as const;

export function VerifyQueueScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [selectedReport, setSelectedReport] = useState<QueueItem>(queueItems[0]);
  const [selectedDecision, setSelectedDecision] = useState<(typeof decisionOptions)[number]["id"] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedDecisionMeta = decisionOptions.find((option) => option.id === selectedDecision);

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerLabel}>Verification Queue</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <Text style={styles.title}>Open Verification Queue</Text>
            <Text style={styles.subtitle}>Review the report proof, check the image and location, then approve, reject, request clarification, or escalate.</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressPill}><Text style={styles.progressText}>Proof</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Location</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Decision</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Submit</Text></View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>View Report / Proof</Text>
            <View style={styles.optionWrap}>
              {queueItems.map((item) => {
                const selected = selectedReport.id === item.id;
                return (
                  <Pressable key={item.id} style={({ pressed }) => [styles.reportOption, selected && styles.reportOptionSelected, pressed && { opacity: 0.95 }]} onPress={() => { setSelectedReport(item); setIsSubmitted(false); }}>
                    <View style={styles.reportTextWrap}>
                      <Text style={styles.reportTitle}>{item.title}</Text>
                      <Text style={styles.reportMeta}>{item.proof}</Text>
                    </View>
                    <MaterialCommunityIcons name={selected ? "radiobox-marked" : "radiobox-blank"} size={22} color={selected ? "#8B5CF6" : "#94A3B8"} />
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Check Image + Location</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <MaterialCommunityIcons name="image-outline" size={20} color="#8B5CF6" />
                <Text style={styles.reviewText}>Proof bundle: {selectedReport.proof}</Text>
              </View>
              <View style={styles.reviewRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color="#8B5CF6" />
                <Text style={styles.reviewText}>Location tag: {selectedReport.location}</Text>
              </View>
              <View style={styles.reviewRow}>
                <MaterialCommunityIcons name="shield-check-outline" size={20} color="#8B5CF6" />
                <Text style={styles.reviewText}>Moderation checklist: image clarity, waste visibility, and location consistency.</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Decision</Text>
            <View style={styles.optionWrap}>
              {decisionOptions.map((option) => {
                const selected = selectedDecision === option.id;
                return (
                  <Pressable key={option.id} style={({ pressed }) => [styles.decisionCard, selected && { borderColor: option.color, backgroundColor: `${option.color}12` }, pressed && { opacity: 0.95 }]} onPress={() => { setSelectedDecision(option.id); setIsSubmitted(false); }}>
                    <View style={[styles.decisionIconWrap, { backgroundColor: `${option.color}18` }]}>
                      <MaterialCommunityIcons name={option.icon as any} size={22} color={option.color} />
                    </View>
                    <Text style={styles.decisionTitle}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.submitButton, !selectedDecision && styles.submitButtonDisabled, pressed && selectedDecision && { opacity: 0.92, transform: [{ scale: 0.98 }] }]}
            disabled={!selectedDecision}
            onPress={() => setIsSubmitted(true)}
          >
            <Text style={styles.submitButtonText}>Submit Moderation Decision</Text>
          </Pressable>

          {isSubmitted && selectedDecisionMeta && (
            <View style={styles.successCard}>
              <MaterialCommunityIcons name={selectedDecisionMeta.icon as any} size={28} color={selectedDecisionMeta.color} />
              <View style={styles.successTextWrap}>
                <Text style={styles.successTitle}>Decision Recorded</Text>
                <Text style={styles.successText}>{selectedDecisionMeta.label} has been recorded for {selectedReport.title}.</Text>
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F5F3FF" },
  container: { flex: 1, backgroundColor: "#F5F3FF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DDD6FE", justifyContent: "center", alignItems: "center" },
  headerLabel: { fontSize: 15, fontWeight: "800", color: "#6D28D9" },
  headerSpacer: { width: 42, height: 42 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  heroCard: { backgroundColor: "#0B1120", borderRadius: 30, padding: 24, overflow: "hidden", marginBottom: 20 },
  heroGlow: { position: "absolute", top: -40, right: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: "#8B5CF6", opacity: 0.2 },
  title: { fontSize: 31, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.8, marginBottom: 8 },
  subtitle: { color: "#DDD6FE", fontSize: 15, lineHeight: 22, marginBottom: 20 },
  progressRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressPill: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  progressText: { color: "#DDD6FE", fontSize: 12, fontWeight: "700" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 26, padding: 20, borderWidth: 1, borderColor: "#DDD6FE", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 14 },
  optionWrap: { gap: 12 },
  reportOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 18, padding: 16, backgroundColor: "#F8FAFC" },
  reportOptionSelected: { borderColor: "#8B5CF6", backgroundColor: "#F5F3FF" },
  reportTextWrap: { flex: 1, marginRight: 12 },
  reportTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  reportMeta: { fontSize: 13, color: "#64748B" },
  reviewCard: { borderRadius: 18, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", padding: 16, gap: 12 },
  reviewRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  reviewText: { flex: 1, fontSize: 13, lineHeight: 19, color: "#475569" },
  decisionCard: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 18, padding: 16, backgroundColor: "#F8FAFC" },
  decisionIconWrap: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 12 },
  decisionTitle: { fontSize: 14, fontWeight: "800", color: "#0F172A", flex: 1 },
  submitButton: { backgroundColor: "#8B5CF6", borderRadius: 20, paddingVertical: 18, alignItems: "center", marginBottom: 16, shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.24, shadowRadius: 18, elevation: 6 },
  submitButtonDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  successCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#DDD6FE", flexDirection: "row", alignItems: "center", gap: 12 },
  successTextWrap: { flex: 1 },
  successTitle: { fontSize: 15, fontWeight: "800", color: "#6D28D9", marginBottom: 4 },
  successText: { fontSize: 13, lineHeight: 19, color: "#475569" },
});

