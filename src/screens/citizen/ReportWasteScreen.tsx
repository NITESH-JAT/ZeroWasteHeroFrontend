import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location"; // <-- NEW IMPORT!
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { reportService } from "../../services/reportService";

type Props = NativeStackScreenProps<RootStackParamList, "ReportWaste">;

const CATEGORIES = ["Plastic", "Organic", "Hazardous", "E-Waste", "Mixed Dump"];

export function ReportWasteScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Mixed Dump");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW LOCATION STATE ---
  const [locationCoords, setLocationCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  // Ask for permission and get GPS on mount!
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need location access to pin the waste report exactly where you are standing.");
        setIsLocating(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced, // Balanced is faster, High is more precise
        });
        setLocationCoords(location.coords);
      } catch (error) {
        Alert.alert("GPS Error", "Could not fetch your location. Make sure your GPS is turned on.");
      } finally {
        setIsLocating(false);
      }
    })();
  }, []);

  const pickImage = async () => {
    Alert.alert(
      "Upload Evidence",
      "Choose a photo source",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert("Permission needed", "Please grant camera access to take a photo.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.8, // Good quality, but slightly compressed to save server space
            });
            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              quality: 0.8,
            });
            if (!result.canceled) {
              setImageUri(result.assets[0].uri);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert("Photo Required", "Please add a photo of the waste.");
      return;
    }

    if (!locationCoords) {
      Alert.alert("Location Missing", "We are still trying to find your location, or permission was denied.");
      return;
    }

    setIsLoading(true);
    try {
      // Sending REAL device coordinates to your Railway backend!
      await reportService.submitReport(
        selectedCategory,
        description,
        locationCoords.latitude,
        locationCoords.longitude,
        imageUri
      );
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Report Submitted! 🌍", "Thank you! A Champion will verify this shortly to award your Green Points.", [
        { text: "Done", onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenSafeArea style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Report Waste</Text>
        <View style={styles.placeholderBtn} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionTitle}>1. Capture the Evidence</Text>
          <Pressable style={styles.imagePlaceholder} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadCta}>
                <View style={styles.iconCircle}>
                  <MaterialCommunityIcons name="camera-plus" size={32} color="#00D65B" />
                </View>
                <Text style={styles.uploadText}>Tap to add photo</Text>
                <Text style={styles.uploadSubtext}>Clear photos help Champions verify faster</Text>
              </View>
            )}
          </Pressable>

          <Text style={styles.sectionTitle}>2. Type of Waste</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
              >
                <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>3. Additional Details (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="E.g. It's overflowing near the bus stop..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          {/* REAL LIVE LOCATION BOX */}
          <View style={styles.locationBox}>
            <View style={styles.locationIconBox}>
              <MaterialCommunityIcons name={isLocating ? "radar" : "crosshairs-gps"} size={20} color={isLocating ? "#F59E0B" : "#0EA5E9"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationTitle}>
                {isLocating ? "Acquiring GPS..." : locationCoords ? "Location Pinned" : "Location Failed"}
              </Text>
              <Text style={styles.locationSubtitle}>
                {isLocating 
                  ? "Please wait" 
                  : locationCoords 
                    ? `${locationCoords.latitude.toFixed(4)}, ${locationCoords.longitude.toFixed(4)}` 
                    : "Tap to retry"}
              </Text>
            </View>
            {isLocating ? (
              <ActivityIndicator color="#F59E0B" size="small" />
            ) : locationCoords ? (
              <MaterialCommunityIcons name="check-circle" size={20} color="#00D65B" />
            ) : (
              <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.submitBtn, 
            (isLoading || isLocating || !locationCoords) && { opacity: 0.5 }, 
            pressed && { transform: [{ scale: 0.98 }] }
          ]} 
          onPress={handleSubmit}
          disabled={isLoading || isLocating || !locationCoords}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Report</Text>
              <MaterialCommunityIcons name="send" size={20} color="#FFF" />
            </>
          )}
        </Pressable>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" },
  placeholderBtn: { width: 40 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 12, marginTop: 24 },
  imagePlaceholder: { width: "100%", height: 220, backgroundColor: "#F8FAFC", borderRadius: 24, borderWidth: 2, borderColor: "#E2E8F0", borderStyle: "dashed", justifyContent: "center", alignItems: "center", overflow: "hidden" },
  previewImage: { width: "100%", height: "100%" },
  uploadCta: { alignItems: "center", padding: 20 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#F0FDF4", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  uploadText: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  uploadSubtext: { fontSize: 13, color: "#64748B", textAlign: "center" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0" },
  categoryPillActive: { backgroundColor: "#00D65B", borderColor: "#00D65B", shadowColor: "#00D65B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  categoryText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  categoryTextActive: { color: "#FFF" },
  textArea: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 16, padding: 16, fontSize: 16, color: "#0F172A", minHeight: 120, textAlignVertical: "top" },
  locationBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0F9FF", padding: 16, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: "#E0F2FE" },
  locationIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", marginRight: 12 },
  locationTitle: { fontSize: 15, fontWeight: "700", color: "#0369A1" },
  locationSubtitle: { fontSize: 13, color: "#0284C7", marginTop: 2 },
  footer: { padding: 20, paddingBottom: Platform.OS === "ios" ? 40 : 20, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#F8FAFC" },
  submitBtn: { backgroundColor: "#0F172A", height: 60, borderRadius: 20, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 6 },
  submitBtnText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});