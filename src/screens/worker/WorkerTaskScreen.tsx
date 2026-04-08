import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "WorkerTask">;

export function WorkerTaskScreen({ navigation }: Props) {
  const [afterImageUri, setAfterImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAfterImageUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleResolve = async () => {
    if (!afterImageUri) {
      Alert.alert("Proof Required", "You must upload a photo showing the area is clean.");
      return;
    }

    setIsLoading(true);
    // Simulate API Upload
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Task Closed! 🏆", "Great job keeping the city clean.", [
        { text: "Back to Route", onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <ScreenSafeArea style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Active Task</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Task Details */}
        <View style={styles.taskCard}>
          <View style={styles.taskHeader}>
            <MaterialCommunityIcons name="alert-circle" size={20} color="#F59E0B" />
            <Text style={styles.taskTitle}>Clear Sector 4 Park</Text>
          </View>
          <Text style={styles.taskDesc}>Verified public complaint of mixed dump near the main entrance.</Text>
          <View style={styles.locationBadge}>
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color="#0284C7" />
            <Text style={styles.locationText}>Navigate to 22.3072, 73.1812</Text>
          </View>
        </View>

        {/* Proof Upload */}
        <Text style={styles.sectionTitle}>Upload Proof of Resolution</Text>
        <Pressable style={styles.uploadBox} onPress={pickImage}>
          {afterImageUri ? (
            <Image source={{ uri: afterImageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadCta}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="camera-outline" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.uploadText}>Take "After" Photo</Text>
              <Text style={styles.uploadSubtext}>Show that the area is completely cleared</Text>
            </View>
          )}
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.resolveBtn, 
            (!afterImageUri || isLoading) && { opacity: 0.5 },
            pressed && { transform: [{ scale: 0.98 }] }
          ]} 
          onPress={handleResolve}
          disabled={!afterImageUri || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="check-all" size={22} color="#FFF" />
              <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  content: { padding: 24 },
  taskCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 32 },
  taskHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  taskTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  taskDesc: { fontSize: 15, color: "#64748B", lineHeight: 22, marginBottom: 16 },
  locationBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#E0F2FE", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 6, alignSelf: "flex-start" },
  locationText: { color: "#0369A1", fontWeight: "700", fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 16 },
  uploadBox: { width: "100%", height: 250, backgroundColor: "#FFF", borderRadius: 24, borderWidth: 2, borderColor: "#E2E8F0", borderStyle: "dashed", justifyContent: "center", alignItems: "center", overflow: "hidden", marginBottom: 24 },
  previewImage: { width: "100%", height: "100%" },
  uploadCta: { alignItems: "center", padding: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FEF3C7", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  uploadText: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  uploadSubtext: { fontSize: 13, color: "#64748B", textAlign: "center" },
  resolveBtn: { backgroundColor: "#F59E0B", height: 60, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  resolveBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});