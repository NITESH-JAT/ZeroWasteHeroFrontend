import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { taskService } from "../../services/taskService";

type Props = NativeStackScreenProps<RootStackParamList, "WorkerTask">;

export function WorkerTaskScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getMyTasks();
      // Only show tasks that need proof!
      setTasks(data.filter((t: any) => t.status === 'ASSIGNED'));
    } catch (error) {
      Alert.alert("Error", "Failed to fetch tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadProof = async (taskId: string) => {
    Alert.alert("Upload Proof", "Capture a photo of the cleaned area.", [
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert("Permission needed", "Please grant camera access.");
          
          const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
          if (!result.canceled) submitProof(taskId, result.assets[0].uri);
        }
      },
      {
        text: "Choose from Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
          if (!result.canceled) submitProof(taskId, result.assets[0].uri);
        }
      },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const submitProof = async (taskId: string, imageUri: string) => {
    setIsSubmitting(taskId);
    try {
      await taskService.completeTask(taskId, imageUri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Task Completed! 🌍", "Proof uploaded. A Champion will verify it shortly.");
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <ScreenSafeArea style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Close Task</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerBox}><ActivityIndicator size="large" color="#F59E0B" /></View>
      ) : tasks.length === 0 ? (
        <View style={styles.centerBox}>
          <MaterialCommunityIcons name="check-all" size={60} color="#10B981" />
          <Text style={styles.emptyText}>You have no open tasks.</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20, gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.reportImageUrl }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.title}>Assigned Cleanup</Text>
                <Text style={styles.description}>{item.description || "Clear waste from this location."}</Text>
                
                <Pressable 
                  style={[styles.uploadBtn, isSubmitting === item.id && { opacity: 0.7 }]} 
                  onPress={() => handleUploadProof(item.id)}
                  disabled={isSubmitting === item.id}
                >
                  {isSubmitting === item.id ? <ActivityIndicator color="#FFF" /> : (
                    <>
                      <MaterialCommunityIcons name="camera-plus" size={20} color="#FFF" />
                      <Text style={styles.uploadBtnText}>Upload After Photo</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#64748B", fontSize: 16, marginTop: 16, fontWeight: "600" },
  card: { backgroundColor: "#FFF", borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "#E2E8F0" },
  cardImage: { width: "100%", height: 160, backgroundColor: "#F1F5F9" },
  cardContent: { padding: 16 },
  title: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  description: { fontSize: 14, color: "#64748B", marginBottom: 16 },
  uploadBtn: { backgroundColor: "#F59E0B", flexDirection: "row", height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center", gap: 8 },
  uploadBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});