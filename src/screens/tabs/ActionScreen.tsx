//src/screens/tabs/ActionScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

const { width } = Dimensions.get("window");

// --- REUSABLE TACTILE CARDS ---

const PrimaryActionCard = ({ title, subtitle, icon, accent, onPress }: any) => (
  <Pressable 
    style={({ pressed }) => [
      styles.primaryCard, 
      { backgroundColor: accent },
      pressed && { transform: [{ scale: 0.97 }] }
    ]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (onPress) onPress();
    }}
  >
    <View style={styles.primaryIconBox}>
      <MaterialCommunityIcons name={icon} size={48} color="#FFFFFF" />
    </View>
    <View style={styles.primaryTextWrap}>
      <Text style={styles.primaryTitle}>{title}</Text>
      <Text style={styles.primarySubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.primaryArrowBox}>
      <MaterialCommunityIcons name="arrow-right" size={24} color={accent} />
    </View>
  </Pressable>
);

const SecondaryActionCard = ({ title, icon, color, onPress }: any) => (
  <Pressable 
    style={({ pressed }) => [
      styles.secondaryCard,
      pressed && { transform: [{ scale: 0.97 }], backgroundColor: "#F8FAFC" }
    ]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onPress) onPress();
    }}
  >
    <View style={[styles.secondaryIconBox, { backgroundColor: `${color}15` }]}>
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <Text style={styles.secondaryTitle}>{title}</Text>
  </Pressable>
);

// --- ROLE-SPECIFIC ACTION LAYOUTS ---

const CitizenActions = ({ openPage, navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Report Waste" 
      subtitle="Snap a photo & geo-tag to earn points" 
      icon="camera" 
      accent="#00D65B" 
      onPress={() => navigation.navigate("ReportWaste")}
    />
    <PrimaryActionCard 
      title="Sell Scrap" 
      subtitle="List recyclables on the marketplace" 
      icon="recycle" 
      accent="#14B8A6" 
      onPress={() => navigation.navigate("PostScrap")}
    />
    <View style={styles.secondaryGrid}>
      {/* FIXED: Pointing to the real History screen tabs */}
      <SecondaryActionCard 
        title="My Reports" 
        icon="file-document-outline" 
        color="#00D65B" 
        onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'reports' })} 
      />
      <SecondaryActionCard 
        title="My Listings" 
        icon="storefront-outline" 
        color="#14B8A6" 
        onPress={() => navigation.navigate("CitizenHistory", { initialTab: 'listings' })} 
      />
    </View>
  </View>
);

const NgoActions = ({ openPage }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Create Campaign" 
      subtitle="Launch a new clean-up drive" 
      icon="calendar-plus" 
      accent="#0EA5E9" 
      onPress={() => openPage("createCampaign")}
    />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="Manage Drives" icon="clipboard-edit" color="#0EA5E9" onPress={() => openPage("createCampaign")} />
      <SecondaryActionCard title="Scan QR Proof" icon="qrcode-scan" color="#0F172A" onPress={() => openPage("volunteerSubmissions")} />
    </View>
  </View>
);

const WorkerActions = ({ openPage, navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Close Active Task" 
      subtitle="Upload after-cleaning proof photo" 
      icon="camera-burst" 
      accent="#F59E0B" 
      onPress={() => navigation.navigate("WorkerTask")} // Direct stack navigation
    />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="Report Issue" icon="alert-octagon" color="#F43F5E" onPress={() => openPage("reportIssue")} />
      <SecondaryActionCard title="View Route" icon="map-marker-path" color="#0F172A" onPress={() => openPage("viewRoute")} />
    </View>
  </View>
);

const ChampionActions = ({ openPage, navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Verify Reports" 
      subtitle="Review pending citizen uploads" 
      icon="check-decagram" 
      accent="#8B5CF6" 
      onPress={() => navigation.navigate("VerifyReports")} // Direct stack navigation
    />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="Flagged Items" icon="flag" color="#F43F5E" onPress={() => openPage("flaggedItems")} />
      <SecondaryActionCard title="Community Map" icon="map-search" color="#0F172A" onPress={() => openPage("communityMap")} />
    </View>
  </View>
);

const AuthorityActions = ({ openPage }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Issue Penalty" 
      subtitle="Log a violation or fine a defaulter" 
      icon="gavel" 
      accent="#F43F5E" 
      onPress={() => openPage("issuePenalty")}
    />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="NGO Approvals" icon="file-document-check" color="#0EA5E9" onPress={() => openPage("ngoApprovals")} />
      <SecondaryActionCard title="Broadcast Alert" icon="bullhorn" color="#0F172A" onPress={() => openPage("broadcastAlert")} />
    </View>
  </View>
);

// --- NEW SCRAPPER ACTIONS ---
const ScrapperActions = ({ navigation }: any) => (
  <View style={styles.actionLayout}>
    <PrimaryActionCard 
      title="Marketplace Feed" 
      subtitle="Browse and bid on local citizen scrap" 
      icon="storefront-outline" 
      accent="#14B8A6" 
      onPress={() => navigation.navigate("Explore")} // Assuming "Explore" acts as their Marketplace tab
    />
    <View style={styles.secondaryGrid}>
      <SecondaryActionCard title="My Bids" icon="hand-coin-outline" color="#14B8A6" onPress={() => console.log("Navigate to active bids")} />
      <SecondaryActionCard title="Set Reminder" icon="bell-ring-outline" color="#0F172A" onPress={() => console.log("Navigate to schedule")} />
    </View>
  </View>
);


// --- MAIN SCREEN COMPONENT ---
export function ActionScreen() {
  const activeRole = useAppStore((state) => state.activeRole);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openPage = (pageId: AppPageId) => navigation.navigate("Page", { pageId });

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Soft Background Accents */}
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Action Center</Text>
          <Text style={styles.subtitle}>Select an action to continue.</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!activeRole ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-question-outline" size={56} color="#CBD5E1" />
              <Text style={styles.emptyText}>Select a persona to view actions.</Text>
            </View>
          ) : (
            <View style={styles.content}>
              {activeRole === "citizen" && <CitizenActions openPage={openPage} navigation={navigation} />}
              {activeRole === "ngo" && <NgoActions openPage={openPage} navigation={navigation} />}
              {activeRole === "worker" && <WorkerActions openPage={openPage} navigation={navigation} />}
              {activeRole === "champion" && <ChampionActions openPage={openPage} navigation={navigation} />}
              {activeRole === "authority" && <AuthorityActions openPage={openPage} navigation={navigation} />}
              {activeRole === "scrapper" && <ScrapperActions navigation={navigation} />}
            </View>
          )}
          
          {/* Spacer to clear the tall floating navigation bar */}
          <View style={{ height: 140 }} />
        </ScrollView>

      </View>
    </ScreenSafeArea>
  );
}

// --- STYLES (Unchanged) ---
const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC" },
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
});