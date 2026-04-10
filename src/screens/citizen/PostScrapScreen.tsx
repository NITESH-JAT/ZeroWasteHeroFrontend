import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
import { scrapService } from "../../services/scrapService";

type Props = NativeStackScreenProps<RootStackParamList, "PostScrap">;

export function PostScrapScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handlePost = async () => {
    if (!title || !city || !imageUri) {
      Alert.alert("Missing Info", "Please provide a title, city, and a photo of the scrap.");
      return;
    }

    setIsLoading(true);
    try {
      await scrapService.createListing(title, description, city, imageUri);
      Alert.alert("Success! 🎉", "Your scrap is now live in the marketplace.", [
        { text: "View Feed", onPress: () => navigation.navigate("MainTabs") }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenSafeArea style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Post Scrap</Text>
          <Text style={styles.headerSubtitle}>List your recyclables for local collectors.</Text>

          {/* Image Picker Section */}
          <Pressable style={styles.imagePlaceholder} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadCta}>
                <MaterialCommunityIcons name="camera-plus-outline" size={40} color="#64748B" />
                <Text style={styles.uploadText}>Add Scrap Photo</Text>
              </View>
            )}
          </Pressable>

          <View style={styles.form}>
            <Text style={styles.label}>What are you selling?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 15kg Old Newspapers"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>City / Neighborhood</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Vadodara"
              value={city}
              onChangeText={setCity}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add details about condition or pickup time..."
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <Pressable 
              style={[styles.submitBtn, isLoading && { opacity: 0.7 }]} 
              onPress={handlePost}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Post to Marketplace</Text>
                  <MaterialCommunityIcons name="check-decagram" size={20} color="#FFF" />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { padding: 24 },
  headerTitle: { fontSize: 28, fontWeight: "800", color: "#0F172A" },
  headerSubtitle: { fontSize: 15, color: "#64748B", marginTop: 4, marginBottom: 24 },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 24,
  },
  previewImage: { width: "100%", height: "100%" },
  uploadCta: { alignItems: "center" },
  uploadText: { marginTop: 8, color: "#64748B", fontWeight: "600" },
  form: { gap: 16 },
  label: { fontSize: 14, fontWeight: "700", color: "#334155", marginBottom: -8 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#0F172A",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  submitBtn: {
    backgroundColor: "#00D65B",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    shadowColor: "#00D65B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});