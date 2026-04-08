import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { useAppStore } from "../../store/useAppStore";
import { roleLabels } from "../../constants/roles";

export function ProfileScreen() {
  // Pull live data and the logout action straight from your store!
  const { userProfile, logoutUser } = useAppStore();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logoutUser }
    ]);
  };

  // Safe fallback just in case
  if (!userProfile) return null;

  // Get their initials for the avatar (e.g., Nitesh Jat -> NJ)
  const initials = `${userProfile.firstName?.[0] || ""}${userProfile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <ScreenSafeArea style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          
          <Text style={styles.nameText}>{userProfile.firstName} {userProfile.lastName}</Text>
          <Text style={styles.emailText}>{userProfile.email}</Text>
          
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#00D65B" />
            <Text style={styles.roleText}>{roleLabels[userProfile.role]}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="star-shooting" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>{userProfile.greenPoints}</Text>
            <Text style={styles.statLabel}>Green Points</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton}>
            <View style={styles.actionIconBg}><MaterialCommunityIcons name="cog" size={22} color="#64748B" /></View>
            <Text style={styles.actionText}>Account Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </Pressable>

          <Pressable style={styles.actionButton}>
            <View style={styles.actionIconBg}><MaterialCommunityIcons name="help-circle" size={22} color="#64748B" /></View>
            <Text style={styles.actionText}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </Pressable>

          {/* REAL LOGOUT BUTTON */}
          <Pressable 
            style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.7 }]} 
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { padding: 24, paddingBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: "#0F172A" },
  profileCard: { alignItems: "center", padding: 24, backgroundColor: "#FFF", marginHorizontal: 20, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 20 },
  avatarBox: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#FFF", letterSpacing: 1 },
  nameText: { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  emailText: { fontSize: 15, color: "#64748B", marginBottom: 16 },
  roleBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0FDF4", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  roleText: { color: "#00D65B", fontWeight: "700", fontSize: 13 },
  statsRow: { paddingHorizontal: 20, marginBottom: 24 },
  statBox: { backgroundColor: "#FFF", padding: 20, borderRadius: 24, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  statValue: { fontSize: 32, fontWeight: "800", color: "#0F172A", marginTop: 8 },
  statLabel: { fontSize: 14, color: "#64748B", fontWeight: "600", marginTop: 4 },
  actionsContainer: { paddingHorizontal: 20, gap: 12, paddingBottom: 100 },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 20 },
  actionIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#F1F5F9", justifyContent: "center", alignItems: "center", marginRight: 16 },
  actionText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#0F172A" },
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FEF2F2", padding: 16, borderRadius: 20, marginTop: 10, gap: 8 },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#EF4444" },
});