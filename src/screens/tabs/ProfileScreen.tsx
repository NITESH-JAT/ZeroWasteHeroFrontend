import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { AppRole, roleLabels } from "../../constants/roles";
import type { AppPageId } from "../../navigation/pageRegistry";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

const { width } = Dimensions.get("window");

// --- ROLE CONFIGURATION ---
const roleConfig = {
  citizen: { accent: "#00D65B", name: "Aarav Sharma", email: "aarav.s@example.com" },
  ngo: { accent: "#0EA5E9", name: "EarthWarriors Org", email: "contact@earthwarriors.org" },
  worker: { accent: "#F59E0B", name: "Rajesh Kumar", email: "ID: WW-9902" },
  champion: { accent: "#8B5CF6", name: "Priya Patel", email: "priya.champion@zone4.com" },
  authority: { accent: "#F43F5E", name: "City Admin", email: "admin@ulb.gov" },
};

// --- REUSABLE MENU ITEM ---
const MenuItem = ({ icon, title, subtitle, color = "#0F172A", isDestructive = false, onPress }: any) => (
  <Pressable
    style={({ pressed }) => [
      styles.menuItem,
      pressed && { backgroundColor: "#F1F5F9" },
    ]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (onPress) onPress();
    }}
  >
    <View style={[styles.menuIconBox, { backgroundColor: isDestructive ? "#FFF1F2" : "#F8FAFC" }]}>
      <MaterialCommunityIcons name={icon} size={22} color={isDestructive ? "#F43F5E" : color} />
    </View>
    <View style={styles.menuTextContent}>
      <Text style={[styles.menuTitle, isDestructive && { color: "#F43F5E" }]}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={20} color={isDestructive ? "#FDA4AF" : "#CBD5E1"} />
  </Pressable>
);

const MenuSection = ({ title, children }: any) => (
  <View style={styles.menuSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.menuCard}>{children}</View>
  </View>
);

// --- MAIN PROFILE COMPONENT ---
export function ProfileScreen() {
  const activeRole = useAppStore((state) => state.activeRole);
  const resetSession = useAppStore((state) => state.resetSession);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openPage = (pageId: AppPageId) => navigation.navigate("Page", { pageId });

  if (!activeRole) {
    return (
      <ScreenSafeArea style={styles.safeArea}>
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="account-question-outline" size={56} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Persona Selected</Text>
        </View>
      </ScreenSafeArea>
    );
  }

  const config = roleConfig[activeRole];

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Soft Background Accents */}
        <View style={styles.bgBlobGreen} />
        <View style={styles.bgBlobBlue} />

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable 
            style={({ pressed }) => [styles.settingsBtn, pressed && { opacity: 0.7 }]}
            onPress={() => openPage("settingsOverview")}
          >
            <Feather name="settings" size={22} color="#0F172A" />
          </Pressable>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- PROFILE INFO CARD --- */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: "https://i.pravatar.cc/150?img=11" }} style={styles.avatarImage} />
              <View style={[styles.roleBadgeIcon, { backgroundColor: config.accent }]}>
                <MaterialCommunityIcons name="check-decagram" size={16} color="#FFFFFF" />
              </View>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{config.name}</Text>
              <Text style={styles.profileEmail}>{config.email}</Text>
              <View style={styles.rolePill}>
                <View style={[styles.rolePillDot, { backgroundColor: config.accent }]} />
                <Text style={styles.rolePillText}>{roleLabels[activeRole]}</Text>
              </View>
            </View>
          </View>

          <MenuSection title="Quick Links">
            <MenuItem icon="gift-outline" title="Rewards Wallet" subtitle="Open your points and redemption hub" color={config.accent} onPress={() => navigation.navigate("MainTabs", { screen: "Rewards" })} />
            <MenuItem icon={activeRole === "worker" ? "map-marker-path" : "map-marker-radius-outline"} title={activeRole === "worker" ? "Assigned Zone" : "Nearby Campaigns"} subtitle={activeRole === "worker" ? "Review your current area coverage and route zone" : "Browse drives and community events near you"} color={config.accent} onPress={() => openPage(activeRole === "worker" ? "assignedZone" : "nearbyCampaigns")} />
            <MenuItem icon="flash-outline" title="Action Center" subtitle="Jump into your main role actions" color={config.accent} onPress={() => navigation.navigate("MainTabs", { screen: "Action" })} />
          </MenuSection>

          {/* --- DYNAMIC ROLE MENUS --- */}
          
          {/* CITIZEN MENU */}
          {activeRole === "citizen" && (
            <>
              <MenuSection title="Activity & Impact">
                <MenuItem icon="history" title="Report History" subtitle="View your past waste reports" color={config.accent} onPress={() => openPage("reportHistory")} />
                <MenuItem icon="account-group-outline" title="Campaign Participation History" subtitle="See drives you joined and attendance status" color={config.accent} onPress={() => openPage("campaignParticipationHistory")} />
                <MenuItem icon="trophy-outline" title="Achievements" subtitle="Badges, milestones, and streak rewards" color={config.accent} onPress={() => openPage("badgesOverview")} />
                <MenuItem icon="school-outline" title="Training Modules" subtitle="Mandatory waste segregation learning" color={config.accent} onPress={() => openPage("trainingModules")} />
              </MenuSection>
            </>
          )}

          {/* NGO MENU */}
          {activeRole === "ngo" && (
            <>
              <MenuSection title="Organization">
                <MenuItem icon="shield-check-outline" title="Verification Status" subtitle="View official NGO documents" color={config.accent} onPress={() => openPage("verificationStatus")} />
                <MenuItem icon="file-download-outline" title="Impact Reports" subtitle="Download analytics for CSR/Donors" color={config.accent} onPress={() => openPage("impactReports")} />
              </MenuSection>
            </>
          )}

          {/* WORKER MENU */}
          {activeRole === "worker" && (
            <>
              <MenuSection title="Employment & Performance">
                <MenuItem icon="badge-account-horizontal-outline" title="Worker Info" subtitle="Employment identity and worker details" color={config.accent} onPress={() => openPage("workerInfo")} />
                <MenuItem icon="map-marker-path" title="Assigned Zone" subtitle="Review route coverage and assigned operational area" color={config.accent} onPress={() => openPage("assignedZone")} />
                <MenuItem icon="history" title="Task History" subtitle="See previously completed and verified work items" color={config.accent} onPress={() => openPage("taskHistory")} />
                <MenuItem icon="speedometer" title="Performance Metrics" subtitle="Track score, consistency, and completion quality" color={config.accent} onPress={() => openPage("performanceScore")} />
              </MenuSection>
            </>
          )}
          {/* CHAMPION MENU */}
          {activeRole === "champion" && (
            <>
              <MenuSection title="Moderation">
                <MenuItem icon="card-account-details-star-outline" title="Champion Credentials" subtitle="View municipal authority proof" color={config.accent} onPress={() => openPage("championCredentials")} />
                <MenuItem icon="format-list-bulleted" title="Audit Logs" subtitle="Transparency & moderation history" color={config.accent} onPress={() => openPage("auditLogs")} />
              </MenuSection>
            </>
          )}

          {/* AUTHORITY MENU */}
          {activeRole === "authority" && (
            <>
              <MenuSection title="Administration">
                <MenuItem icon="security" title="User Access Control" subtitle="Manage champion & NGO access" color={config.accent} onPress={() => openPage("userAccessControl")} />
                <MenuItem icon="chart-box-outline" title="City Reports" subtitle="Download full ecosystem analytics" color={config.accent} onPress={() => openPage("cityReports")} />
                <MenuItem icon="cogs" title="System Logs" subtitle="View platform-wide technical logs" color={config.accent} onPress={() => openPage("systemLogs")} />
              </MenuSection>
            </>
          )}

          {/* --- GENERAL SETTINGS --- */}
          <MenuSection title="Account Settings">
            <MenuItem icon="bell-outline" title="Notifications" onPress={() => openPage("notifications")} />
            <MenuItem icon="lock-outline" title="Privacy & Security" onPress={() => openPage("privacySecurity")} />
            <MenuItem icon="help-circle-outline" title="Help & Support" onPress={() => openPage("helpSupport")} />
          </MenuSection>

          {/* --- LOGOUT & SWITCH ROLE --- */}
          <View style={styles.actionSection}>
            <Pressable 
              style={({ pressed }) => [styles.switchBtn, pressed && { backgroundColor: "#F8FAFC", transform: [{ scale: 0.98 }] }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                resetSession();
              }}
            >
              <MaterialCommunityIcons name="account-switch" size={20} color="#0F172A" />
              <Text style={styles.switchBtnText}>Switch Persona</Text>
            </Pressable>

            <Pressable 
              style={({ pressed }) => [styles.logoutBtn, pressed && { backgroundColor: "#FFE4E6", transform: [{ scale: 0.98 }] }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            >
              <MaterialCommunityIcons name="logout" size={20} color="#F43F5E" />
              <Text style={styles.logoutBtnText}>Log Out</Text>
            </Pressable>
          </View>

          {/* Spacer for bottom nav */}
          <View style={{ height: 140 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 16,
  },
  /* --- BACKGROUND BLOBS --- */
  bgBlobGreen: {
    position: "absolute",
    top: "-5%",
    right: -50,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#00D65B",
    opacity: 0.04,
  },
  bgBlobBlue: {
    position: "absolute",
    top: "30%",
    left: -100,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: "#0EA5E9",
    opacity: 0.03,
  },
  /* --- HEADER --- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 12 : 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  /* --- PROFILE CARD --- */
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 20,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E2E8F0",
  },
  roleBadgeIcon: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginBottom: 10,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  rolePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  rolePillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
  },
  /* --- MENU SECTIONS --- */
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 12,
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContent: {
    flex: 1,
    paddingRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  /* --- ACTIONS --- */
  actionSection: {
    marginTop: 8,
    gap: 12,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  switchBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF1F2",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#F43F5E",
  },
});





