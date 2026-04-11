//src/screens/tabs/ExploreScreen.tsx
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { useAppStore } from "../../store/useAppStore";
import { campaignService } from "../../services/campaignService";
import { userService } from "../../services/userService";
import { championService } from "../../services/championService";

const { width } = Dimensions.get("window");

// Role-Specific Tabs
const CITIZEN_TABS = ["Campaigns", "Leaderboard"]; 
const NGO_TABS = ["Community Feed", "Partner NGOs", "Analytics"];
const WORKER_TABS = ["Pending Work", "Completed"];
const CHAMPION_TABS = ["Queue", "Assigned"];
const SCRAPPER_TABS = ["Market Feed", "Pricing Guide"];
const AUTHORITY_TABS = ["City Overview", "NGO Directory", "Penalties"];

export function ExploreScreen() {
const rawRole = useAppStore((state) => state.activeRole);
const activeRole = (rawRole || "").toLowerCase();
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignedReports, setAssignedReports] = useState<any[]>([]);
  const [workerTasks, setWorkerTasks] = useState<any[]>([]);
  const [ngos, setNgos] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  
  // States for Citizen Live Data
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Fetching location...");
  
  const navigation = useNavigation<any>();

  // Determine which tabs to show based on the logged-in role
const currentTabs = activeRole === "ngo" ? NGO_TABS :
                      activeRole === "worker" ? WORKER_TABS :
                      activeRole === "champion" ? CHAMPION_TABS :
                      activeRole === "scrapper" ? SCRAPPER_TABS : 
                      activeRole === "authority" ? AUTHORITY_TABS :
                      CITIZEN_TABS;

  // Only fetch Citizen data if the user is actually a Citizen!
useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // --- CITIZEN LOGIC ---
      if (activeRole === "citizen") {
        if (activeTab === 0) {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              setLocationStatus("Location denied. Showing recent campaigns.");
              const data = await campaignService.getCampaigns(); 
              setCampaigns(data);
            } else {
              const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
              const data = await campaignService.getCampaigns(location.coords.latitude, location.coords.longitude);
              setCampaigns(data);
              setLocationStatus("Showing campaigns near you");
            }
          } catch (error) {
            setLocationStatus("GPS error. Showing recent campaigns.");
            const data = await campaignService.getCampaigns();
            setCampaigns(data);
          }
        } else if (activeTab === 1) {
          const data = await userService.getLeaderboard();
          setLeaderboard(data);
        }
      } 
      // --- CHAMPION LOGIC ---
      else if (activeRole === "champion") {
        // Tab 0 is just a static button to open the Verification Queue, so we only fetch data for Tab 1
        if (activeTab === 1) {
          try {
            // Make sure championService is imported at the top of your file!
            const data = await championService.getApprovedReports();
            setAssignedReports(data);
          } catch (error) {
            console.error("Failed to fetch assigned reports", error);
            setAssignedReports([]);
          }
        }
      }
      else if (activeRole === "worker") {
        import("../../services/taskService").then(async (m) => {
          const data = await m.taskService.getMyTasks();
          setWorkerTasks(data);
          setIsLoading(false);
        });
      }

      else if (activeRole === "authority") {
        import("../../services/authorityService").then(async (m) => {
          if (activeTab === 1) {
            const data = await m.authorityService.getNgos();
            setNgos(data);
          } else if (activeTab === 2) {
            const data = await m.authorityService.getPenalties();
            setPenalties(data);
          }
          setIsLoading(false);
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, [activeTab, activeRole]);

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>{activeRole === "scrapper" ? "Marketplace" : "Explore"}</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          <View style={styles.tabContainer}>
            {currentTabs.map((tab, index) => {
              const isActive = activeTab === index;
              return (
                <Pressable key={tab} style={[styles.tabButton, isActive && styles.tabButtonActive]} onPress={() => setActiveTab(index)}>
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* --- SCRAPPER VIEW --- */}
          {activeRole === "scrapper" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Marketplace Feed</Text>
                    <Text style={styles.sectionSubtitle}>Browse available waste near you</Text>
                  </View>
                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("ScrapFeed")}>
                    <View style={[styles.tipIconWrap, { backgroundColor: '#CCFBF1' }]}>
                      <MaterialCommunityIcons name="storefront-outline" size={28} color="#0F766E" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Open Marketplace Feed</Text>
                      <Text style={styles.tipSubtitle}>Click here to view all active citizen scrap listings and place bids.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}
              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Scrap Pricing Guide</Text>
                    <Text style={styles.sectionSubtitle}>Average market rates for materials</Text>
                  </View>
                  
                  {/* REAL PRICING LIST */}
                  {[
                    { mat: "Cardboard", price: "₹10 - ₹12 / kg", icon: "package-variant", color: "#D97706" },
                    { mat: "Mixed Plastic", price: "₹15 - ₹18 / kg", icon: "bottle-soda", color: "#0EA5E9" },
                    { mat: "Iron / Steel", price: "₹25 - ₹30 / kg", icon: "gold", color: "#64748B" },
                    { mat: "Copper wire", price: "₹400 - ₹450 / kg", icon: "pipe", color: "#F59E0B" },
                    { mat: "E-Waste", price: "Varies by item", icon: "laptop", color: "#8B5CF6" },
                  ].map((item, idx) => (
                    <View key={idx} style={[styles.leaderboardRow, { padding: 16 }]}>
                      <View style={[styles.rankCircle, { backgroundColor: `${item.color}15` }]}>
                        <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.lbName}>{item.mat}</Text>
                      </View>
                      <Text style={[styles.lbPoints, { color: item.color }]}>{item.price}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>

          /* --- NGO VIEW --- */
          ) : activeRole === "ngo" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Community Feed</Text>
                    <Text style={styles.sectionSubtitle}>Campaign updates and volunteer activity</Text>
                  </View>
                  <Text style={{color: "#64748B", textAlign: "center", marginTop: 20}}>NGO features coming soon.</Text>
                </View>
              )}
            </>

/* --- WORKER VIEW --- */
          ) : activeRole === "worker" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Pending Work</Text>
                    <Text style={styles.sectionSubtitle}>Tasks assigned to you by Champions</Text>
                  </View>
                  {isLoading ? <ActivityIndicator color="#F59E0B" /> : workerTasks.filter(t => t.status === 'ASSIGNED').length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 20 }}>You have no pending tasks.</Text>
                  ) : (
                    workerTasks.filter(t => t.status === 'ASSIGNED').map(task => (
                      <View key={task.id} style={styles.campaignCard}>
                        <Image source={{ uri: task.reportImageUrl }} style={styles.cardImage} />
                        <View style={styles.cardBody}>
                          <Text style={styles.campaignTitle}>Assigned Cleanup</Text>
                          <Text style={{ color: "#64748B", marginBottom: 12 }}>{task.description || "Clear the designated area."}</Text>
                          <Pressable style={[styles.joinBtn, { backgroundColor: '#F59E0B' }]} onPress={() => navigation.navigate("WorkerTask")}>
                            <Text style={styles.joinBtnText}>Upload Proof & Close Task</Text>
                          </Pressable>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Completed Work</Text>
                    <Text style={styles.sectionSubtitle}>Awaiting Champion verification</Text>
                  </View>
                  {isLoading ? <ActivityIndicator color="#F59E0B" /> : workerTasks.filter(t => t.status === 'COMPLETED' || t.status === 'VERIFIED').length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 20 }}>No completed tasks yet.</Text>
                  ) : (
                    workerTasks.filter(t => t.status === 'COMPLETED' || t.status === 'VERIFIED').map(task => (
                      <View key={task.id} style={[styles.leaderboardRow, { padding: 16 }]}>
                        <View style={[styles.rankCircle, { backgroundColor: task.status === 'VERIFIED' ? "#ECFDF5" : "#FEF3C7" }]}>
                          <MaterialCommunityIcons name={task.status === 'VERIFIED' ? "check-decagram" : "progress-clock"} size={20} color={task.status === 'VERIFIED' ? "#10B981" : "#F59E0B"} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.lbName}>Cleanup Task</Text>
                          <Text style={{ fontSize: 13, color: "#64748B" }}>Status: {task.status}</Text>
                        </View>
                        <Text style={[styles.lbPoints, { color: "#F59E0B" }]}>+{task.rewardPoints} Pts</Text>
                      </View>
                    ))
                  )}
                </View>
              )}
            </>


/* --- CHAMPION VIEW --- */
          ) : activeRole === "champion" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Verification Queue</Text>
                    <Text style={styles.sectionSubtitle}>Open reports waiting for moderation</Text>
                  </View>
                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("VerifyReports")}>
                    <View style={[styles.tipIconWrap, { backgroundColor: '#EDE9FE' }]}>
                      <MaterialCommunityIcons name="check-decagram-outline" size={28} color="#8B5CF6" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Open Verification Queue</Text>
                      <Text style={styles.tipSubtitle}>View proof, check image and location, then assign to Green Soldiers.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}
              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Assigned Tasks</Text>
                    <Text style={styles.sectionSubtitle}>Track worker progress</Text>
                  </View>
                  
                  {isLoading ? (
                    <ActivityIndicator color="#8B5CF6" style={{ marginTop: 40 }} />
                  ) : assignedReports.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 20 }}>No tasks currently assigned.</Text>
                  ) : (
                    assignedReports.map((report) => (
                      <View key={report.id} style={styles.campaignCard}>
                        <Image source={{ uri: report.imageUrl }} style={styles.cardImage} />
                        <View style={styles.cardBody}>
                          <Text style={styles.campaignTitle}>{report.category}</Text>
                          <Text style={{ color: "#64748B", marginBottom: 12 }}>{report.description}</Text>
                          
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F1F5F9", paddingTop: 12 }}>
                            <Text style={{ color: "#64748B", fontSize: 13 }}>
                              Assigned to: <Text style={{ fontWeight: "700", color: "#0F172A" }}>{report.workerFirstName || "Unknown"}</Text>
                            </Text>
                            <View style={{ backgroundColor: report.taskStatus === 'COMPLETED' ? '#ECFDF5' : '#FFFBEB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                              <Text style={{ color: report.taskStatus === 'COMPLETED' ? '#10B981' : '#F59E0B', fontWeight: "700", fontSize: 12 }}>
                                {report.taskStatus || 'ASSIGNED'}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}
            </>


          /* --- AUTHORITY VIEW --- */
          ) : activeRole === "authority" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>City Overview</Text>
                    <Text style={styles.sectionSubtitle}>Macro-level municipal view</Text>
                  </View>
                  {/* Keep it simple: direct them to the other tabs */}
                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => setActiveTab(1)}>
                    <View style={[styles.tipIconWrap, { backgroundColor: '#E0F2FE' }]}><MaterialCommunityIcons name="domain" size={28} color="#0284C7" /></View>
                    <View style={styles.tipTextWrap}><Text style={styles.tipTitle}>View NGO Directory</Text><Text style={styles.tipSubtitle}>Monitor officially registered NGO partners.</Text></View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Registered NGOs</Text>
                  </View>
                  {isLoading ? <ActivityIndicator color="#0EA5E9" /> : ngos.length === 0 ? <Text style={{ textAlign: 'center', color: '#64748B' }}>No NGOs found.</Text> : ngos.map((ngo) => (
                    <View key={ngo.id} style={[styles.leaderboardRow, { padding: 16 }]}>
                      <View style={[styles.rankCircle, { backgroundColor: "#E0F2FE" }]}><MaterialCommunityIcons name="domain" size={20} color="#0EA5E9" /></View>
                      <View style={{ flex: 1 }}><Text style={styles.lbName}>{ngo.firstName}</Text><Text style={{ fontSize: 13, color: "#64748B" }}>{ngo.email}</Text></View>
                    </View>
                  ))}
                </View>
              )}

              {activeTab === 2 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Issued Penalties</Text>
                  </View>
                  {isLoading ? <ActivityIndicator color="#F43F5E" /> : penalties.length === 0 ? <Text style={{ textAlign: 'center', color: '#64748B' }}>No penalties issued yet.</Text> : penalties.map((pen) => (
                    <View key={pen.id} style={[styles.leaderboardRow, { padding: 16 }]}>
                      <View style={[styles.rankCircle, { backgroundColor: "#FFE4E6" }]}><MaterialCommunityIcons name="gavel" size={20} color="#F43F5E" /></View>
                      <View style={{ flex: 1 }}><Text style={styles.lbName}>{pen.reason}</Text><Text style={{ fontSize: 13, color: "#64748B" }}>Issued to: {pen.firstName}</Text></View>
                      <Text style={[styles.lbPoints, { color: "#F43F5E" }]}>₹{pen.amount}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>

          /* --- CITIZEN VIEW (Default) --- */
          ) : (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nearby Drives</Text>
                    <Text style={styles.sectionSubtitle}>{locationStatus}</Text>
                  </View>

                  {isLoading ? (
                    <ActivityIndicator color="#00D65B" style={{ marginTop: 40 }} />
                  ) : campaigns.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 20 }}>No active campaigns found near you.</Text>
                  ) : (
                    campaigns.map((campaign) => (
                      <View key={campaign.id} style={styles.campaignCard}>
                        <Image source={{ uri: campaign.image }} style={styles.cardImage} />
                        <View style={styles.cardBody}>
                          <Text style={styles.campaignTitle}>{campaign.title}</Text>
                          <Text style={styles.dateText}>{campaign.date}</Text>
                          <Text style={styles.distanceText}>{campaign.distanceKm ? `${campaign.distanceKm} km away` : 'Location available'}</Text>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              )}

              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>City Champions</Text>
                    <Text style={styles.sectionSubtitle}>Top 100 Eco-Warriors</Text>
                  </View>
                  {isLoading ? (
                    <ActivityIndicator color="#F59E0B" style={{ marginTop: 40 }} />
                  ) : (
                    leaderboard.map((user, index) => {
                      const isTop3 = index < 3;
                      const rankColor = index === 0 ? "#F59E0B" : index === 1 ? "#94A3B8" : index === 2 ? "#D97706" : "#F8FAFC";
                      return (
                        <View key={user.id} style={[styles.leaderboardRow, isTop3 && styles.top3Row, isTop3 && { borderColor: rankColor }]}>
                          <View style={[styles.rankCircle, { backgroundColor: isTop3 ? rankColor : "#F1F5F9" }]}>
                            <Text style={[styles.rankText, isTop3 && { color: "#FFF" }]}>{index + 1}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.lbName}>{user.firstName} {user.lastName}</Text>
                          </View>
                          <Text style={styles.lbPoints}>{user.greenPoints} Pts</Text>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FAFC", flex: 1 },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  headerContainer: { paddingHorizontal: 24, paddingTop: Platform.OS === "ios" ? 12 : 24, paddingBottom: 16, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, zIndex: 10 },
  headerTitle: { fontSize: 34, fontWeight: "800", color: "#0F172A", letterSpacing: -1, marginBottom: 20 },
  searchRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  searchBar: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, paddingHorizontal: 16, height: 52, borderWidth: 1, borderColor: "#E2E8F0" },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "500", color: "#0F172A" },
  tabContainer: { flexDirection: "row", backgroundColor: "#F1F5F9", padding: 4, borderRadius: 14 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  tabButtonActive: { backgroundColor: "#FFFFFF", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: "700", color: "#64748B" },
  tabTextActive: { color: "#0F172A" },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 14, color: "#64748B", fontWeight: "500", marginTop: 2 },
  
  // Custom styles for this screen
  campaignCard: { backgroundColor: "#FFF", borderRadius: 24, overflow: "hidden", marginBottom: 20, borderWidth: 1, borderColor: "#E2E8F0" },
  cardImage: { width: "100%", height: 160, backgroundColor: "#E2E8F0" },
  cardBody: { padding: 20 },
  campaignTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", marginBottom: 8 },
  dateText: { fontSize: 14, color: "#64748B", marginBottom: 4 },
  distanceText: { fontSize: 14, fontWeight: "700", color: "#00D65B" },
  
  leaderboardRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0" },
  top3Row: { borderWidth: 2, shadowColor: "#F59E0B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  rankCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: "center", alignItems: "center", marginRight: 16 },
  rankText: { fontSize: 14, fontWeight: "800", color: "#0F172A" },
  lbName: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  lbPoints: { fontSize: 16, fontWeight: "800", color: "#00D65B" },

  tipCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 22, borderWidth: 1, borderColor: "#E2E8F0", padding: 18, marginBottom: 8, shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  tipIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#ECFDF5", justifyContent: "center", alignItems: "center", marginRight: 14 },
  tipTextWrap: { flex: 1, marginRight: 12 },
  tipTitle: { fontSize: 15, fontWeight: "800", color: "#0F172A", marginBottom: 4 },
  tipSubtitle: { fontSize: 13, lineHeight: 19, color: "#64748B" },
  cardPressed: { transform: [{ scale: 0.98 }] },
});