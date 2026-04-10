import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";
import { authorityService } from "../../services/authorityService";

const { width } = Dimensions.get("window");

// --- REUSABLE TACTILE CARDS ---
const PrimaryActionCard = ({ title, subtitle, icon, accent, onPress }: any) => (
  <Pressable 
    style={({ pressed }) => [styles.primaryCard, { backgroundColor: accent }, pressed && { transform: [{ scale: 0.97 }] }]}
    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); if (onPress) onPress(); }}
  >
    <View style={styles.primaryIconBox}><MaterialCommunityIcons name={icon} size={48} color="#FFFFFF" /></View>
    <View style={styles.primaryTextWrap}>
      <Text style={styles.primaryTitle}>{title}</Text>
      <Text style={styles.primarySubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.primaryArrowBox}><MaterialCommunityIcons name="arrow-right" size={24} color={accent} /></View>
  </Pressable>
);

const SecondaryActionCard = ({ title, icon, color, onPress }: any) => (
  <Pressable 
    style={({ pressed }) => [styles.secondaryCard, pressed && { transform: [{ scale: 0.97 }], backgroundColor: "#F8FAFC" }]}
    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); if (onPress) onPress(); }}
  >
    <View style={[styles.secondaryIconBox, { backgroundColor: `${color}15` }]}><MaterialCommunityIcons name={icon} size={28} color={color} /></View>
    <Text style={styles.secondaryTitle}>{title}</Text>
  </Pressable>
);

// --- ROLE-SPECIFIC ACTION LAYOUTS ---
const CitizenActions = ({ navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard title="Report Waste" subtitle="Snap a photo & geo-tag to earn points" icon="camera" accent="#00D65B" onPress={() => navigation.navigate("ReportWaste")} />
    <PrimaryActionCard title="Sell Scrap" subtitle="List recyclables on the marketplace" icon="recycle" accent="#14B8A6" onPress={() => navigation.navigate("PostScrap")} />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="My Reports" icon="file-document-outline" color="#00D65B" onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'reports' })} />
      <SecondaryActionCard title="My Listings" icon="storefront-outline" color="#14B8A6" onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'listings' })} />
    </View>
  </View>
);

const NgoActions = ({ openPage }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard title="Create Campaign" subtitle="Launch a new clean-up drive" icon="calendar-plus" accent="#0EA5E9" onPress={() => openPage("createCampaign")} />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="Manage Drives" icon="clipboard-edit" color="#0EA5E9" onPress={() => openPage("createCampaign")} />
      <SecondaryActionCard title="Scan QR Proof" icon="qrcode-scan" color="#0F172A" onPress={() => openPage("volunteerSubmissions")} />
    </View>
  </View>
);

const WorkerActions = ({ openPage, navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard title="Close Active Task" subtitle="Upload after-cleaning proof photo" icon="camera-burst" accent="#F59E0B" onPress={() => navigation.navigate("WorkerTask")} />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="Report Issue" icon="alert-octagon" color="#F43F5E" onPress={() => openPage("reportIssue")} />
      <SecondaryActionCard title="View Route" icon="map-marker-path" color="#0F172A" onPress={() => openPage("viewRoute")} />
    </View>
  </View>
);

const ChampionActions = ({ navigation }: any) => {
  const hotspots = [{ area: "Akota Gardens", count: 12 }, { area: "Fatehgunj Market", count: 8 }, { area: "Sayajigunj", count: 5 }, { area: "Alkapuri Sector 2", count: 4 }];
  return (
    <View style={styles.actionLayout}>
      <PrimaryActionCard title="Verify Reports" subtitle="Review pending citizen uploads" icon="check-decagram" accent="#8B5CF6" onPress={() => navigation.navigate("VerifyReports")} />
      <View style={styles.sectionHeader}><Text style={[styles.secondaryTitle, { textAlign: 'left', marginBottom: 8 }]}>Major Report Hotspots</Text></View>
      <View style={styles.hotspotGrid}>
        {hotspots.map((item, index) => (
          <View key={index} style={styles.hotspotCard}>
            <View style={styles.hotspotIconBox}><MaterialCommunityIcons name="fire-alert" size={20} color="#F43F5E" /></View>
            <View><Text style={styles.hotspotArea}>{item.area}</Text><Text style={styles.hotspotCount}>{item.count} reports</Text></View>
          </View>
        ))}
      </View>
    </View>
  );
};

const AuthorityActions = ({ navigation, onOpenPenalty }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard title="Issue Penalty" subtitle="Log a violation or fine a defaulter" icon="gavel" accent="#F43F5E" onPress={onOpenPenalty} />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="NGO Approvals" icon="file-document-check" color="#0EA5E9" onPress={() => navigation.navigate("Explore" as any)} />
      <SecondaryActionCard title="Broadcast Alert" icon="bullhorn" color="#0F172A" onPress={() => Alert.alert("Coming Soon", "Broadcast feature is under development.")} />
    </View>
  </View>
);

const ScrapperActions = ({ navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard title="Marketplace Feed" subtitle="Browse and bid on local citizen scrap" icon="storefront-outline" accent="#14B8A6" onPress={() => navigation.navigate("Explore")} />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="My Bids" icon="hand-coin-outline" color="#14B8A6" onPress={() => navigation.navigate("ScrapperBids" as any)} />
      <SecondaryActionCard title="Set Reminder" icon="bell-ring-outline" color="#0F172A" onPress={() => Alert.alert("Reminder Set! ⏰", "We will notify you 30 minutes before your next scheduled pickup.")} />
    </View>
  </View>
);

// --- MAIN SCREEN COMPONENT ---
export function ActionScreen() {
  // ✅ THE FIX: Force the role to lowercase immediately!
  const rawRole = useAppStore((state) => state.activeRole);
  const activeRole = (rawRole || "").toLowerCase();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Penalty Modal State
  const [showPenaltyModal, setShowPenaltyModal] = useState(false);
  const [cityUsers, setCityUsers] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [penaltyAmount, setPenaltyAmount] = useState("");
  const [penaltyReason, setPenaltyReason] = useState("");
  const [isIssuing, setIsIssuing] = useState(false);

  const openPage = (pageId: AppPageId) => navigation.navigate("Page", { pageId });

  // Open Modal and Fetch Users
  const handleOpenPenalty = async () => {
    setShowPenaltyModal(true);
    const users = await authorityService.getUsers();
    setCityUsers(users);
  };

  const handleIssuePenalty = async () => {
    if (!selectedUser || !penaltyAmount || !penaltyReason) {
      Alert.alert("Missing Info", "Please select a user and fill out all fields.");
      return;
    }
    setIsIssuing(true);
    try {
      await authorityService.issuePenalty(selectedUser.id, Number(penaltyAmount), penaltyReason);
      Alert.alert("Success", `Penalty issued to ${selectedUser.firstName}.`);
      setShowPenaltyModal(false);
      setSelectedUser(null); setPenaltyAmount(""); setPenaltyReason(""); setSearchUser("");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        <View style={styles.header}>
          <Text style={styles.title}>Action Center</Text>
          <Text style={styles.subtitle}>Select an action to continue.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!activeRole ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-question-outline" size={56} color="#CBD5E1" />
              <Text style={styles.emptyText}>Select a persona to view actions.</Text>
            </View>
          ) : (
            <View style={styles.content}>
              {activeRole === "citizen" && <CitizenActions navigation={navigation} />}
              {activeRole === "ngo" && <NgoActions openPage={openPage} />}
              {activeRole === "worker" && <WorkerActions openPage={openPage} navigation={navigation} />}
              {activeRole === "champion" && <ChampionActions navigation={navigation} />}
              {(activeRole === "authority" || activeRole === "admin") && <AuthorityActions navigation={navigation} onOpenPenalty={handleOpenPenalty} />}
              {activeRole === "scrapper" && <ScrapperActions navigation={navigation} />}
            </View>
          )}
          <View style={{ height: 140 }} />
        </ScrollView>
      </View>

      {/* AUTHORITY PENALTY MODAL WITH USER PICKER */}
      <Modal visible={showPenaltyModal} transparent animationType="slide" onRequestClose={() => setShowPenaltyModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowPenaltyModal(false)} />
          <View style={styles.sheetContent}>
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Issue Penalty</Text>
            
            {/* USER SELECTOR / SEARCH */}
            {selectedUser ? (
              <View style={styles.selectedUserBox}>
                <View>
                  <Text style={styles.selectedUserName}>{selectedUser.firstName} {selectedUser.lastName}</Text>
                  <Text style={styles.selectedUserRole}>{selectedUser.role}</Text>
                </View>
                <Pressable onPress={() => setSelectedUser(null)} style={styles.changeUserBtn}>
                  <Text style={styles.changeUserText}>Change</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <TextInput 
                  style={[styles.input, { marginBottom: 8 }]} 
                  placeholder="Search user by name..." 
                  value={searchUser} 
                  onChangeText={setSearchUser} 
                />
                <ScrollView style={{ maxHeight: 160, marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0" }} nestedScrollEnabled>
                  {cityUsers
                    .filter(u => `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchUser.toLowerCase()))
                    .map(u => (
                      <Pressable key={u.id} style={styles.userRow} onPress={() => setSelectedUser(u)}>
                        <View style={styles.userAvatar}><Text style={styles.userAvatarText}>{u.firstName[0]}</Text></View>
                        <View>
                          <Text style={styles.userName}>{u.firstName} {u.lastName}</Text>
                          <Text style={styles.userRole}>{u.role}</Text>
                        </View>
                      </Pressable>
                    ))}
                </ScrollView>
              </View>
            )}

            <TextInput style={styles.input} placeholder="Penalty Amount (₹)" keyboardType="numeric" value={penaltyAmount} onChangeText={setPenaltyAmount} />
            <TextInput style={styles.input} placeholder="Reason (e.g. Illegal Dumping)" value={penaltyReason} onChangeText={setPenaltyReason} />

            <Pressable style={[styles.submitBtn, isIssuing && { opacity: 0.7 }]} onPress={handleIssuePenalty} disabled={isIssuing}>
              {isIssuing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnText}>Submit Penalty</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenSafeArea>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC", flex: 1 },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  bgBlobGreen: { position: "absolute", top: "5%", left: -80, width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, backgroundColor: "#00D65B", opacity: 0.04 },
  bgBlobBlue: { position: "absolute", bottom: "20%", right: -100, width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, backgroundColor: "#0EA5E9", opacity: 0.04 },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === "ios" ? 12 : 24, paddingBottom: 16 },
  title: { fontSize: 34, fontWeight: "800", color: "#0F172A", letterSpacing: -1, marginBottom: 6 },
  subtitle: { fontSize: 15, fontWeight: "500", color: "#64748B" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  content: { flex: 1 },
  actionLayout: { gap: 16 },
  primaryCard: { borderRadius: 32, padding: 28, flexDirection: "column", justifyContent: "space-between", minHeight: 220, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  primaryIconBox: { width: 72, height: 72, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  primaryTextWrap: { marginBottom: 8 },
  primaryTitle: { fontSize: 28, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.5, marginBottom: 6 },
  primarySubtitle: { fontSize: 15, fontWeight: "500", color: "rgba(255,255,255,0.9)", lineHeight: 22, paddingRight: 40 },
  primaryArrowBox: { position: "absolute", bottom: 28, right: 28, width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  secondaryGrid: { flexDirection: "row", gap: 16 },
  secondaryCard: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 28, padding: 24, alignItems: "center", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  secondaryIconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  secondaryTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", textAlign: "center" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#94A3B8", marginTop: 16 },
  sectionHeader: { marginBottom: 16 },
  hotspotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  hotspotCard: { width: '48%', backgroundColor: '#FFF', padding: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  hotspotIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#FFF1F2', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  hotspotArea: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  hotspotCount: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 16, fontSize: 16, color: "#0F172A", marginBottom: 12 },
  submitBtn: { backgroundColor: "#F43F5E", height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  userRow: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9", backgroundColor: "#FFF" },
  userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E0F2FE", justifyContent: "center", alignItems: "center", marginRight: 12 },
  userAvatarText: { fontSize: 16, fontWeight: "800", color: "#0284C7" },
  userName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  userRole: { fontSize: 12, color: "#64748B", marginTop: 2, textTransform: "uppercase" },
  selectedUserBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F0FDF4", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "#86EFAC", marginBottom: 16 },
  selectedUserName: { fontSize: 16, fontWeight: "800", color: "#166534" },
  selectedUserRole: { fontSize: 12, color: "#15803D", marginTop: 4, textTransform: "uppercase" },
  changeUserBtn: { backgroundColor: "#DCFCE7", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  changeUserText: { fontSize: 13, fontWeight: "700", color: "#166534" },
});