import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { RootStackParamList } from "../../navigation/types";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const categories = ["Plastic", "Mixed Waste", "E-Waste", "Organic"];
const locationModes = [
  { id: "auto", label: "Auto Location", subtitle: "Use device GPS for tagging" },
  { id: "manual", label: "Manual Tag", subtitle: "Add landmark or area note yourself" },
] as const;

export function ReportWasteScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Plastic");
  const [locationMode, setLocationMode] = useState<(typeof locationModes)[number]["id"]>("auto");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const openCamera = async () => {
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
      setImageUri(result.assets[0].uri);
      setIsSubmitted(false);
    }
  };

  const submitReport = async () => {
    if (!imageUri) {
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
          <Text style={styles.headerLabel}>Manual Report</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <Text style={styles.title}>Launch Report Flow</Text>
            <Text style={styles.subtitle}>Capture the waste photo, tag it clearly, and submit it for pending verification.</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressPill}><Text style={styles.progressText}>Camera</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Category</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Location</Text></View>
              <View style={styles.progressPill}><Text style={styles.progressText}>Submit</Text></View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Waste Photo</Text>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.emptyPreview}>
                <MaterialCommunityIcons name="camera-plus-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyPreviewTitle}>Capture Waste Photo</Text>
                <Text style={styles.emptyPreviewText}>Use the floating camera button below to take the report image.</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Add Category</Text>
            <View style={styles.chipWrap}>
              {categories.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && { opacity: 0.9 }]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{category}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location Tag</Text>
            {locationModes.map((mode) => {
              const selected = locationMode === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  style={({ pressed }) => [styles.locationCard, selected && styles.locationCardSelected, pressed && { opacity: 0.95 }]}
                  onPress={() => setLocationMode(mode.id)}
                >
                  <View style={styles.locationTextWrap}>
                    <Text style={styles.locationTitle}>{mode.label}</Text>
                    <Text style={styles.locationSubtitle}>{mode.subtitle}</Text>
                  </View>
                  <MaterialCommunityIcons name={selected ? "radiobox-marked" : "radiobox-blank"} size={22} color={selected ? "#00D65B" : "#94A3B8"} />
                </Pressable>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Optional Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Example: Overflowing plastic waste near the market gate."
              placeholderTextColor="#94A3B8"
              multiline
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              (!imageUri || isSubmitting) && styles.submitButtonDisabled,
              pressed && imageUri && !isSubmitting && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            ]}
            disabled={!imageUri || isSubmitting}
            onPress={submitReport}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? "Submitting..." : "Submit Report"}</Text>
          </Pressable>

          {isSubmitted && (
            <View style={styles.successCard}>
              <MaterialCommunityIcons name="progress-clock" size={28} color="#0EA5E9" />
              <View style={styles.successTextWrap}>
                <Text style={styles.successTitle}>Confirmation Received</Text>
                <Text style={styles.successText}>Your report is now pending verification. We will notify you once it is reviewed.</Text>
              </View>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        <Pressable style={styles.fab} onPress={openCamera}>
          <MaterialCommunityIcons name="camera" size={28} color="#FFFFFF" />
          <Text style={styles.fabText}>Open Camera</Text>
        </Pressable>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#EEFDF3" },
  container: { flex: 1, backgroundColor: "#EEFDF3" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D1FAE5", justifyContent: "center", alignItems: "center" },
  headerLabel: { fontSize: 15, fontWeight: "800", color: "#166534" },
  headerSpacer: { width: 42, height: 42 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  heroCard: { backgroundColor: "#0B1120", borderRadius: 30, padding: 24, overflow: "hidden", marginBottom: 20 },
  heroGlow: { position: "absolute", top: -40, right: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: "#00D65B", opacity: 0.18 },
  title: { fontSize: 31, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.8, marginBottom: 8 },
  subtitle: { color: "#C7D2FE", fontSize: 15, lineHeight: 22, marginBottom: 20 },
  progressRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressPill: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  progressText: { color: "#D1FAE5", fontSize: 12, fontWeight: "700" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 26, padding: 20, borderWidth: 1, borderColor: "#D1FAE5", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 14 },
  previewImage: { width: "100%", height: 260, borderRadius: 20, backgroundColor: "#E2E8F0" },
  emptyPreview: { height: 220, borderRadius: 20, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#A7F3D0", backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
  emptyPreviewTitle: { marginTop: 12, fontSize: 16, fontWeight: "800", color: "#166534" },
  emptyPreviewText: { marginTop: 6, fontSize: 13, lineHeight: 19, color: "#64748B", textAlign: "center" },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#FFFFFF" },
  chipSelected: { backgroundColor: "#00D65B", borderColor: "#00D65B" },
  chipText: { fontSize: 13, fontWeight: "700", color: "#334155" },
  chipTextSelected: { color: "#FFFFFF" },
  locationCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 18, padding: 16, marginBottom: 10, backgroundColor: "#F8FAFC" },
  locationCardSelected: { borderColor: "#00D65B", backgroundColor: "#ECFDF5" },
  locationTextWrap: { flex: 1, marginRight: 12 },
  locationTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  locationSubtitle: { fontSize: 13, color: "#64748B", lineHeight: 18 },
  descriptionInput: { minHeight: 110, borderRadius: 18, borderWidth: 1, borderColor: "#DCFCE7", backgroundColor: "#F8FAFC", paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, color: "#0F172A", textAlignVertical: "top" },
  submitButton: { backgroundColor: "#00D65B", borderRadius: 20, paddingVertical: 18, alignItems: "center", marginBottom: 16, shadowColor: "#00D65B", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.24, shadowRadius: 18, elevation: 6 },
  submitButtonDisabled: { backgroundColor: "#94A3B8", shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  successCard: { backgroundColor: "#EFF6FF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#BFDBFE", flexDirection: "row", alignItems: "center", gap: 12 },
  successTextWrap: { flex: 1 },
  successTitle: { fontSize: 15, fontWeight: "800", color: "#1D4ED8", marginBottom: 4 },
  successText: { fontSize: 13, lineHeight: 19, color: "#475569" },
  fab: { position: "absolute", right: 24, bottom: 24, flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#0F172A", borderRadius: 999, paddingVertical: 16, paddingHorizontal: 18, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.22, shadowRadius: 18, elevation: 12 },
  fabText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
