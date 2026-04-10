import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, Alert, Image, Modal, Platform } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { scrapService } from "../../services/scrapService";
import { reportService } from "../../services/reportService";

type Props = NativeStackScreenProps<RootStackParamList, "CitizenHistory">;

export function CitizenHistoryScreen({ navigation, route }: Props) {
  const [activeTab, setActiveTab] = useState<'reports' | 'listings'>(route.params?.initialTab || 'reports');
  
  const [reports, setReports] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'listings') {
        // Fetch only THIS user's scrap listings
        const data = await scrapService.getMyListings();
        setListings(data);
      } else {
        // Fetch only THIS user's waste reports
        const data = await reportService.getMyReports();
        setReports(data);
      }
    } catch (error) {
      console.log("Error fetching history", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderListing = ({ item }: any) => (
    <View style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: "#CCFBF1" }]}>
        <MaterialCommunityIcons name="recycle" size={24} color="#0F766E" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardSub}>{item.city} • {item.bids?.length || 0} Bids</Text>
      </View>
      
      {/* FIXED THE CRASH: Pass the actual item.id! */}
      <Pressable 
        style={[styles.actionBtn, (!item.bids || item.bids.length === 0) && { backgroundColor: "#E2E8F0" }]} 
        onPress={() => {
          if (item.bids && item.bids.length > 0) {
            navigation.navigate("ManageBids", { listingId: item.id, listingTitle: item.title });
          }
        }}
      >
        <Text style={[styles.actionBtnText, (!item.bids || item.bids.length === 0) && { color: "#64748B" }]}>
          {(item.bids && item.bids.length > 0) ? "View Bids" : "No Bids"}
        </Text>
      </Pressable>
    </View>
  );

const renderReport = ({ item }: any) => (
    <Pressable style={styles.card} onPress={() => setSelectedReport(item)}>
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons name={item.status === 'verified' ? "check-decagram" : "progress-clock"} size={24} color={item.status === 'verified' ? "#00D65B" : "#F59E0B"} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.category}</Text>
        <Text style={styles.cardSub}>Status: {item.status || "Pending"}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
    </Pressable>
  );

  return (
    <ScreenSafeArea style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>My Activity</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.tabContainer}>
        <Pressable style={[styles.tab, activeTab === 'reports' && styles.activeTab]} onPress={() => setActiveTab('reports')}>
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>Waste Reports</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'listings' && styles.activeTab]} onPress={() => setActiveTab('listings')}>
          <Text style={[styles.tabText, activeTab === 'listings' && styles.activeTabText]}>Scrap Listings</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#00D65B" />
      ) : (
        <FlatList
          data={activeTab === 'listings' ? listings : reports}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={activeTab === 'listings' ? renderListing : renderReport}
          contentContainerStyle={styles.content}
          ListEmptyComponent={<Text style={styles.emptyText}>No {activeTab} found yet.</Text>}
        />
      )}

      {/* NEW: REPORT DETAILS MODAL */}
      <Modal visible={!!selectedReport} transparent animationType="slide" onRequestClose={() => setSelectedReport(null)}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedReport(null)} />
          <View style={styles.sheetContent}>
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Report Details</Text>
            
            {selectedReport?.imageUrl && (
              <Image source={{ uri: selectedReport.imageUrl }} style={styles.detailImage} />
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category:</Text>
              <Text style={styles.detailValue}>{selectedReport?.category}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailValue, { color: selectedReport?.status === 'verified' ? '#00D65B' : '#F59E0B' }]}>
                {selectedReport?.status || 'Pending'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>
                {/* Wrap them in Number() to convert the Postgres strings safely! */}
                {Number(selectedReport?.latitude || 0).toFixed(4)}, {Number(selectedReport?.longitude || 0).toFixed(4)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Description:</Text>
              <Text style={styles.detailValue}>{selectedReport?.description || "No description provided."}</Text>
            </View>

            <Pressable style={styles.closeBtn} onPress={() => setSelectedReport(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  tabContainer: { flexDirection: "row", marginHorizontal: 20, backgroundColor: "#F1F5F9", padding: 4, borderRadius: 14, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 10 },
  activeTab: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { fontSize: 14, fontWeight: "700", color: "#64748B" },
  activeTabText: { color: "#0F172A" },
  content: { padding: 20, gap: 12 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0" },
  cardIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: "#FEF3C7", justifyContent: "center", alignItems: "center", marginRight: 16 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  cardSub: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  actionBtn: { backgroundColor: "#14B8A6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  actionBtnText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#64748B", fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  detailImage: { width: "100%", height: 200, borderRadius: 16, marginBottom: 20, backgroundColor: "#F1F5F9" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  detailLabel: { fontSize: 15, fontWeight: "600", color: "#64748B" },
  detailValue: { fontSize: 15, fontWeight: "800", color: "#0F172A", flex: 1, textAlign: "right" },
  closeBtn: { backgroundColor: "#0F172A", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginTop: 10 },
  closeBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});