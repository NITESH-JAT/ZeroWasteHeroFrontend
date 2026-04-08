import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyReports">;

// Temporary mock data so you can see the UI before connecting the backend
const MOCK_REPORTS = [
  {
    id: "1",
    category: "Mixed Dump",
    description: "Overflowing bin spreading into the street.",
    location: "22.3072, 73.1812",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=600&auto=format&fit=crop",
    citizenName: "Rahul D.",
    timeAgo: "10 mins ago"
  }
];

export function VerifyReportsScreen({ navigation }: Props) {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProcessingId(id);
    
    // Simulate API Call
    setTimeout(() => {
      setReports((prev) => prev.filter((r) => r.id !== id));
      setProcessingId(null);
      Haptics.notificationAsync(
        action === "approve" ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
      );
    }, 800);
  };

  const renderReport = ({ item }: { item: typeof MOCK_REPORTS[0] }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
          <Text style={styles.timeText}>{item.timeAgo}</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>
        
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>{item.location}</Text>
        </View>

        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="account-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>Reported by {item.citizenName}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable 
            style={[styles.actionBtn, styles.rejectBtn, processingId === item.id && { opacity: 0.5 }]}
            onPress={() => handleAction(item.id, "reject")}
            disabled={processingId !== null}
          >
            <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>

          <Pressable 
            style={[styles.actionBtn, styles.approveBtn, processingId === item.id && { opacity: 0.5 }]}
            onPress={() => handleAction(item.id, "approve")}
            disabled={processingId !== null}
          >
            {processingId === item.id ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-decagram" size={20} color="#FFF" />
                <Text style={styles.approveText}>Verify & Assign</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenSafeArea style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>Verification Queue</Text>
        <View style={{ width: 40 }} />
      </View>

      {reports.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="check-all" size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySub}>There are no pending reports in your area.</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderReport}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  listContent: { padding: 20, paddingBottom: 40, gap: 20 },
  card: { backgroundColor: "#FFF", borderRadius: 24, overflow: "hidden", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4, borderWidth: 1, borderColor: "#E2E8F0" },
  cardImage: { width: "100%", height: 200, backgroundColor: "#F1F5F9" },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  categoryBadge: { backgroundColor: "#F0FDF4", color: "#00D65B", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, fontSize: 13, fontWeight: "800" },
  timeText: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  description: { fontSize: 16, color: "#0F172A", fontWeight: "600", marginBottom: 16, lineHeight: 22 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  metaText: { fontSize: 14, color: "#64748B", fontWeight: "500" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  actionBtn: { flex: 1, height: 50, borderRadius: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  rejectBtn: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA" },
  rejectText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
  approveBtn: { backgroundColor: "#8B5CF6", shadowColor: "#8B5CF6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  approveText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginTop: 16 },
  emptySub: { fontSize: 15, color: "#64748B", textAlign: "center", marginTop: 8 },
});