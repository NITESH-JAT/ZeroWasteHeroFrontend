//src/screens/details/CreateCampaignScreen.tsx
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { RootStackParamList } from "../../navigation/types";

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function CreateCampaignScreen() {
  const navigation = useNavigation<RootNavigation>();
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("2026-04-12");
  const [time, setTime] = useState("08:00 AM");
  const [location, setLocation] = useState("");
  const [radius, setRadius] = useState("5 km");
  const [rewardPoints, setRewardPoints] = useState("500");
  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const pickBanner = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.85,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setBannerUri(result.assets[0].uri);
      setPublished(false);
    }
  };

  const publishCampaign = async () => {
    setIsPublishing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsPublishing(false);
    setPublished(true);
  };

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={20} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerLabel}>Create Campaign</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <Text style={styles.title}>Publish a New Clean-up Drive</Text>
            <Text style={styles.subtitle}>Set the campaign basics, reward structure, target area, and visual banner before publishing.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Campaign Basics</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" placeholderTextColor="#94A3B8" />
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Description" placeholderTextColor="#94A3B8" multiline />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Date / Time</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="Date" placeholderTextColor="#94A3B8" />
            <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="Time" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Location / Area</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Location" placeholderTextColor="#94A3B8" />
            <TextInput style={styles.input} value={radius} onChangeText={setRadius} placeholder="Radius / Area" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Reward Points</Text>
            <TextInput style={styles.input} value={rewardPoints} onChangeText={setRewardPoints} placeholder="Reward Points" placeholderTextColor="#94A3B8" />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Upload Banner</Text>
            {bannerUri ? (
              <Image source={{ uri: bannerUri }} style={styles.bannerImage} />
            ) : (
              <View style={styles.emptyBanner}>
                <MaterialCommunityIcons name="image-plus-outline" size={34} color="#94A3B8" />
                <Text style={styles.emptyBannerText}>No banner selected yet</Text>
              </View>
            )}
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={pickBanner}>
              <Text style={styles.secondaryButtonText}>Upload Banner</Text>
            </Pressable>
          </View>

          <Pressable style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]} onPress={publishCampaign}>
            <Text style={styles.publishButtonText}>{isPublishing ? "Publishing..." : "Publish Campaign"}</Text>
          </Pressable>

          {published && (
            <View style={styles.successCard}>
              <MaterialCommunityIcons name="check-decagram" size={28} color="#0EA5E9" />
              <View style={styles.successTextWrap}>
                <Text style={styles.successTitle}>Campaign Published</Text>
                <Text style={styles.successText}>Your campaign is now live and ready for volunteer discovery and community visibility.</Text>
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
  safeArea: { backgroundColor: "#EFF6FF" },
  container: { flex: 1, backgroundColor: "#EFF6FF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  backButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DBEAFE", justifyContent: "center", alignItems: "center" },
  headerLabel: { fontSize: 15, fontWeight: "800", color: "#1D4ED8" },
  headerSpacer: { width: 42, height: 42 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },
  heroCard: { backgroundColor: "#0B1120", borderRadius: 30, padding: 24, overflow: "hidden", marginBottom: 20 },
  heroGlow: { position: "absolute", top: -40, right: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: "#0EA5E9", opacity: 0.18 },
  title: { fontSize: 30, fontWeight: "800", color: "#FFFFFF", marginBottom: 8, letterSpacing: -0.8 },
  subtitle: { color: "#C7D2FE", fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 26, padding: 20, borderWidth: 1, borderColor: "#DBEAFE", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 14 },
  input: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, backgroundColor: "#F8FAFC", paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#0F172A", marginBottom: 12 },
  textArea: { minHeight: 110, textAlignVertical: "top" },
  bannerImage: { width: "100%", height: 190, borderRadius: 18, backgroundColor: "#E2E8F0", marginBottom: 14 },
  emptyBanner: { height: 160, borderRadius: 18, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#BFDBFE", backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center", marginBottom: 14 },
  emptyBannerText: { marginTop: 10, fontSize: 14, fontWeight: "700", color: "#64748B" },
  secondaryButton: { backgroundColor: "#EFF6FF", borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  secondaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  secondaryButtonText: { color: "#1D4ED8", fontSize: 14, fontWeight: "800" },
  publishButton: { backgroundColor: "#0EA5E9", borderRadius: 20, paddingVertical: 18, alignItems: "center", marginBottom: 16 },
  publishButtonPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  publishButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  successCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "#BFDBFE", flexDirection: "row", alignItems: "center", gap: 12 },
  successTextWrap: { flex: 1 },
  successTitle: { fontSize: 15, fontWeight: "800", color: "#1D4ED8", marginBottom: 4 },
  successText: { fontSize: 13, lineHeight: 19, color: "#475569" },
});
