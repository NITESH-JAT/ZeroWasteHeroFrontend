//src/screens/details/CloseTaskScreen.tsx
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { RootStackParamList } from "../../navigation/types";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const taskOptions = [
  "Clear Sector 4 Park",
  "Market Road Overflow Response",
  "Zone B Bin Emptying",
  "Lakeside Secondary Sweep",
] as const;

export function CloseTaskScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [selectedTask, setSelectedTask] = useState<(typeof taskOptions)[number]>(taskOptions[0]);
  const [beforeUri, setBeforeUri] = useState<string | null>(null);
  const [afterUri, setAfterUri] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [markedCompleted, setMarkedCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openCameraFor = async (target: "before" | "after") => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      if (target === "before") {
        setBeforeUri(result.assets[0].uri);
      } else {
        setAfterUri(result.assets[0].uri);
      }
      setIsSubmitted(false);
    }
  };

  const submitClosure = async () => {
    if (!beforeUri || !afterUri || !markedCompleted) {
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerLabel}>Close Task</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <Text style={styles.title}>Quick Close Task / Upload Proof</Text>
            <Text style={styles.subtitle}>Select the assigned task, capture before and after evidence, add notes, and submit it for final closure.</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressPill}><Text style={styles.progressText}>Task</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Before</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>After</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Submit</Text></View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Task</Text>
            <View style={styles.chipWrap}>
              {taskOptions.map((task) => {
                const selected = selectedTask === task;
                return (
                  <Pressable
                    key={task}
                    style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && { opacity: 0.9 }]}
                    onPress={() => setSelectedTask(task)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{task}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Upload Before Photo</Text>
            {beforeUri ? (
              <Image source={{ uri: beforeUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.emptyPreview}>
                <MaterialCommunityIcons name="camera-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyPreviewTitle}>Capture Before State</Text>
                <Text style={styles.emptyPreviewText}>Take a quick image showing the task area before cleanup begins.</Text>
              </View>
            )}
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={() => openCameraFor("before")}>
              <Text style={styles.secondaryButtonText}>{beforeUri ? "Retake Before Photo" : "Open Camera for Before Photo"}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Upload After Photo</Text>
            {afterUri ? (
              <Image source={{ uri: afterUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.emptyPreview}>
                <MaterialCommunityIcons name="camera-plus-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyPreviewTitle}>Capture After State</Text>
                <Text style={styles.emptyPreviewText}>Take a proof image after the waste has been cleared from the area.</Text>
              </View>
            )}
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={() => openCameraFor("after")}>
              <Text style={styles.secondaryButtonText}>{afterUri ? "Retake After Photo" : "Open Camera for After Photo"}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add Notes</Text>
            <TextInput
              style={styles.descriptionInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Example: Cleared plastic and mixed waste from park edge. One blocked bin reported separately."
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mark Completed</Text>
            <Pressable
              style={({ pressed }) => [styles.statusCard, markedCompleted && styles.statusCardSelected, pressed && { opacity: 0.95 }]}
              onPress={() => setMarkedCompleted((value) => !value)}
            >
              <View style={styles.statusTextWrap}>
                <Text style={styles.statusTitle}>Task Completed</Text>
                <Text style={styles.statusSubtitle}>Confirm that cleanup work is finished and ready for final closure review.</Text>
              </View>
              <MaterialCommunityIcons name={markedCompleted ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} size={24} color={markedCompleted ? "#F59E0B" : "#94A3B8"} />
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              (!beforeUri || !afterUri || !markedCompleted || isSubmitting) && styles.submitButtonDisabled,
              pressed && beforeUri && afterUri && markedCompleted && !isSubmitting && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            ]}
            disabled={!beforeUri || !afterUri || !markedCompleted || isSubmitting}
            onPress={submitClosure}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? "Submitting..." : "Submit for Final Closure"}</Text>
          </Pressable>

          {isSubmitted && (
            <View style={styles.successCard}>
              <MaterialCommunityIcons name="progress-clock" size={28} color="#0EA5E9" />
              <View style={styles.successTextWrap}>
                <Text style={styles.successTitle}>Submitted for Final Closure</Text>
                <Text style={styles.successText}>The proof package for {selectedTask} is now pending final verification from the operations side.</Text>
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
  safeArea: { backgroundColor: "#FFF7ED" },
  container: { flex: 1, backgroundColor: "#FFF7ED" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#FED7AA", justifyContent: "center", alignItems: "center" },
  headerLabel: { fontSize: 15, fontWeight: "800", color: "#C2410C" },
  headerSpacer: { width: 42, height: 42 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  heroCard: { backgroundColor: "#0B1120", borderRadius: 30, padding: 24, overflow: "hidden", marginBottom: 20 },
  heroGlow: { position: "absolute", top: -40, right: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: "#F59E0B", opacity: 0.2 },
  title: { fontSize: 31, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.8, marginBottom: 8 },
  subtitle: { color: "#FDE68A", fontSize: 15, lineHeight: 22, marginBottom: 20 },
  progressRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressPill: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  progressText: { color: "#FDE68A", fontSize: 12, fontWeight: "700" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 26, padding: 20, borderWidth: 1, borderColor: "#FED7AA", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 14 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#FFFFFF" },
  chipSelected: { backgroundColor: "#F59E0B", borderColor: "#F59E0B" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#334155" },
  chipTextSelected: { color: "#FFFFFF" },
  previewImage: { width: "100%", height: 220, borderRadius: 20, backgroundColor: "#E2E8F0", marginBottom: 14 },
  emptyPreview: { height: 200, borderRadius: 20, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#FDBA74", backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center", paddingHorizontal: 24, marginBottom: 14 },
  emptyPreviewTitle: { marginTop: 12, fontSize: 16, fontWeight: "800", color: "#C2410C" },
  emptyPreviewText: { marginTop: 6, fontSize: 13, lineHeight: 19, color: "#64748B", textAlign: "center" },
  secondaryButton: { backgroundColor: "#FFF7ED", borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  secondaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  secondaryButtonText: { color: "#C2410C", fontSize: 14, fontWeight: "800" },
  descriptionInput: { minHeight: 110, borderRadius: 18, borderWidth: 1, borderColor: "#FED7AA", backgroundColor: "#F8FAFC", paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: "#0F172A", textAlignVertical: "top" },
  statusCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 18, padding: 16, backgroundColor: "#F8FAFC" },
  statusCardSelected: { borderColor: "#F59E0B", backgroundColor: "#FFF7ED" },
  statusTextWrap: { flex: 1, marginRight: 12 },
  statusTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  statusSubtitle: { fontSize: 13, color: "#64748B", lineHeight: 18 },
  submitButton: { backgroundColor: "#F59E0B", borderRadius: 20, paddingVertical: 18, alignItems: "center", marginBottom: 16, shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.24, shadowRadius: 18, elevation: 6 },
  submitButtonDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  successCard: { backgroundColor: "#EFF6FF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#BFDBFE", flexDirection: "row", alignItems: "center", gap: 12 },
  successTextWrap: { flex: 1 },
  successTitle: { fontSize: 15, fontWeight: "800", color: "#1D4ED8", marginBottom: 4 },
  successText: { fontSize: 13, lineHeight: 19, color: "#475569" },
});

