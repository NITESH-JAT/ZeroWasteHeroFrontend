import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { useAppStore } from "../../store/useAppStore";
import { roleLabels } from "../../constants/roles";

export function ProfileScreen() {
  const { userProfile, logoutUser } = useAppStore();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logoutUser }
    ]);
  };

  if (!userProfile) return null;

  const initials = `${userProfile.firstName?.[0] || ""}${userProfile.lastName?.[0] || ""}`.toUpperCase();

  return (
    <ScreenSafeArea style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Sleek Header Context */}
        <View style={styles.headerContext}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        {/* Premium Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRing}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          
          <Text style={styles.nameText}>{userProfile.firstName} {userProfile.lastName}</Text>
          <Text style={styles.emailText}>{userProfile.email}</Text>
          
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#00D65B" />
            <Text style={styles.roleText}>{roleLabels[userProfile.role].toUpperCase()}</Text>
          </View>
        </View>

        {/* Highlighted Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <View style={styles.statIconWrap}>
              <MaterialCommunityIcons name="star-shooting" size={24} color="#F59E0B" />
            </View>
            <View style={styles.statTextWrap}>
              <Text style={styles.statValue}>{userProfile.greenPoints?.toLocaleString() || 0}</Text>
              <Text style={styles.statLabel}>Lifetime Green Points</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Pressable style={({ pressed }) => [styles.actionButton, pressed && { backgroundColor: "#F1F5F9" }]}>
            <View style={styles.actionIconBg}><MaterialCommunityIcons name="help-circle" size={22} color="#64748B" /></View>
            <Text style={styles.actionText}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.actionButton, pressed && { backgroundColor: "#F1F5F9" }]}>
            <View style={styles.actionIconBg}><MaterialCommunityIcons name="shield-lock-outline" size={22} color="#64748B" /></View>
            <Text style={styles.actionText}>Privacy Policy</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.7 }]} 
            onPress={handleLogout}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out Securely</Text>
          </Pressable>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerContext: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 34, fontWeight: "800", color: "#0F172A", letterSpacing: -1 },
  
  profileCard: { alignItems: "center", padding: 32, backgroundColor: "#FFF", marginHorizontal: 20, borderRadius: 32, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5, marginBottom: 24 },
  avatarRing: { padding: 4, borderRadius: 50, borderWidth: 2, borderColor: "#E2E8F0", marginBottom: 16 },
  avatarBox: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#0F172A", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#FFF", letterSpacing: 1 },
  nameText: { fontSize: 26, fontWeight: "800", color: "#0F172A", marginBottom: 4, letterSpacing: -0.5 },
  emailText: { fontSize: 15, color: "#64748B", marginBottom: 20 },
  roleBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, gap: 6 },
  roleText: { color: "#10B981", fontWeight: "800", fontSize: 12, letterSpacing: 1 },
  
  statsContainer: { paddingHorizontal: 20, marginBottom: 32 },
  statBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  statIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#FEF3C7", justifyContent: "center", alignItems: "center", marginRight: 16 },
  statTextWrap: { flex: 1 },
  statValue: { fontSize: 32, fontWeight: "800", color: "#0F172A", letterSpacing: -1 },
  statLabel: { fontSize: 14, color: "#64748B", fontWeight: "600", marginTop: 2 },
  
  actionsContainer: { paddingHorizontal: 20, gap: 12 },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 20, borderWidth: 1, borderColor: "#E2E8F0" },
  actionIconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center", marginRight: 16 },
  actionText: { flex: 1, fontSize: 16, fontWeight: "700", color: "#0F172A" },
  
  logoutButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FEF2F2", padding: 18, borderRadius: 20, marginTop: 12, gap: 8, borderWidth: 1, borderColor: "#FEE2E2" },
  logoutText: { fontSize: 16, fontWeight: "800", color: "#EF4444" },
});