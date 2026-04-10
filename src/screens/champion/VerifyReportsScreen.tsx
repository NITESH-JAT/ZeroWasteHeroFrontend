import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { championService } from "../../services/championService";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyReports">;

export function VerifyReportsScreen({ navigation }: Props) {
  const [reports, setReports] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Assignment Modal State
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    fetchQueueAndWorkers();
  }, []);

  const fetchQueueAndWorkers = async () => {
    setIsLoading(true);
    try {
      const [queueData, workerData] = await Promise.all([
        championService.getPendingReports(),
        championService.getWorkers()
      ]);
      setReports(queueData);
      setWorkers(workerData);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAssignModal = (reportId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedReportId(reportId);
  };

  const handleConfirmAssignment = async (workerId: string) => {
    if (!selectedReportId) return;
    setIsAssigning(true);
    try {
      await championService.verifyAndAssign(selectedReportId, workerId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Assigned! ✅", "Task has been routed to the Green Soldier.");
      
      // Remove from list
      setReports((prev) => prev.filter(r => r.id !== selectedReportId));
      setSelectedReportId(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const renderReport = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
          {/* Format Postgres Date string */}
          <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>

        <Text style={styles.description}>{item.description || "No description provided."}</Text>
        
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
          <Text style={styles.metaText}>{Number(item.latitude || 0).toFixed(4)}, {Number(item.longitude || 0).toFixed(4)}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => Alert.alert("Reject", "Feature coming soon.")}>
            <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
            <Text style={styles.rejectText}>Reject</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, styles.approveBtn]} onPress={() => handleOpenAssignModal(item.id)}>
            <MaterialCommunityIcons name="check-decagram" size={20} color="#FFF" />
            <Text style={styles.approveText}>Verify & Assign</Text>
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

      {isLoading ? (
        <ActivityIndicator color="#8B5CF6" size="large" style={{ marginTop: 40 }} />
      ) : reports.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="check-all" size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySub}>There are no pending reports right now.</Text>
        </View>
      ) : (
        <FlatList data={reports} keyExtractor={(item) => item.id.toString()} renderItem={renderReport} contentContainerStyle={styles.listContent} />
      )}

      {/* WORKER ASSIGNMENT MODAL */}
      <Modal visible={!!selectedReportId} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedReportId(null)} />
          <View style={styles.sheetContent}>
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Assign Green Soldier</Text>
            <Text style={styles.sheetSubtitle}>Select an available worker to clear this waste.</Text>

            {isAssigning ? (
              <ActivityIndicator color="#8B5CF6" size="large" style={{ marginVertical: 40 }} />
            ) : (
              <FlatList
                data={workers}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable style={styles.workerRow} onPress={() => handleConfirmAssignment(item.id)}>
                    <View style={styles.workerAvatar}>
                      <MaterialCommunityIcons name="account-hard-hat" size={24} color="#F59E0B" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.workerName}>{item.firstName} {item.lastName}</Text>
                      <Text style={styles.workerStatus}>Available Now</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
                  </Pressable>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  listContent: { padding: 20, paddingBottom: 100, gap: 20 },
  card: { backgroundColor: "#FFF", borderRadius: 24, overflow: "hidden", elevation: 4, borderWidth: 1, borderColor: "#E2E8F0" },
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
  approveBtn: { backgroundColor: "#8B5CF6" },
  approveText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginTop: 16 },
  emptySub: { fontSize: 15, color: "#64748B", textAlign: "center", marginTop: 8 },
  /* Modal Styles */
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: "80%" },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A" },
  sheetSubtitle: { fontSize: 14, color: "#64748B", marginBottom: 24, marginTop: 4 },
  workerRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  workerAvatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#FEF3C7", justifyContent: "center", alignItems: "center", marginRight: 16 },
  workerName: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  workerStatus: { fontSize: 13, color: "#10B981", fontWeight: "600" }
});