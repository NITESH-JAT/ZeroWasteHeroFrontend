import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import type { RootStackParamList } from "../../navigation/types";
import { useAppStore } from "../../store/useAppStore";

const { width } = Dimensions.get("window");

const CITIZEN_TABS = ["Campaigns", "Map View", "Leaderboard"];
const NGO_TABS = ["Community Feed", "Partner NGOs", "Analytics"];
const WORKER_TABS = ["Task List", "Assigned Work", "Task Status"];
const CHAMPION_TABS = ["Queue", "Approved", "Escalations"];

const CAMPAIGNS = [
  {
    id: "1",
    title: "City Beach Cleanup Drive",
    ngo: "EarthWarriors Foundation",
    date: "Sat, 24 Oct • 08:00 AM",
    distance: "2.5 km away",
    points: 500,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fca73?auto=format&fit=crop&q=80&w=800",
    tags: ["High Priority", "Plastic Waste"],
  },
  {
    id: "2",
    title: "Sector 4 Park Restoration",
    ngo: "GreenFuture India",
    date: "Sun, 25 Oct • 09:00 AM",
    distance: "5.0 km away",
    points: 300,
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    tags: ["Community", "Planting"],
  },
];

function CampaignCard({ campaign, onOpen }: any) {
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [styles.campaignCard, pressed && !isButtonPressed && styles.cardPressed]}
      onPress={onOpen}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: campaign.image }} style={styles.cardImage} />
        <View style={styles.cardOverlay} />

        <View style={styles.badgeTopLeft}>
          <MaterialCommunityIcons name="map-marker-distance" size={14} color="#0F172A" />
          <Text style={styles.badgeTextDark}>{campaign.distance}</Text>
        </View>
        <View style={styles.badgeTopRight}>
          <MaterialCommunityIcons name="star-shooting" size={14} color="#FFFFFF" />
          <Text style={styles.badgeTextLight}>{campaign.points} Pts</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.tagsRow}>
          {campaign.tags.map((tag: string) => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.campaignTitle}>{campaign.title}</Text>

        <View style={styles.ngoRow}>
          <MaterialCommunityIcons name="shield-check" size={16} color="#00E676" />
          <Text style={styles.ngoName}>{campaign.ngo}</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <Feather name="calendar" size={16} color="#64748B" />
            <Text style={styles.dateText}>{campaign.date}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.joinBtn, pressed && styles.joinBtnPressed]}
            onPressIn={() => setIsButtonPressed(true)}
            onPressOut={() => setIsButtonPressed(false)}
            onPress={(event) => {
              event.stopPropagation();
              onOpen();
            }}
          >
            <Text style={styles.joinBtnText}>View Details</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export function ExploreScreen() {
  const activeRole = useAppStore((state) => state.activeRole);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenSafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Explore</Text>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Feather name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find campaigns, NGOs, or areas..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable
              style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
              onPress={() => navigation.navigate("Page", { pageId: "filterCampaigns" })}
            >
              <Feather name="sliders" size={20} color="#0F172A" />
            </Pressable>
          </View>

          <View style={styles.tabContainer}>
            {(activeRole === "ngo" ? NGO_TABS : activeRole === "worker" ? WORKER_TABS : activeRole === "champion" ? CHAMPION_TABS : CITIZEN_TABS).map((tab, index) => {
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
          {activeRole === "ngo" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Community Feed</Text>
                    <Text style={styles.sectionSubtitle}>Campaign updates and volunteer activity</Text>
                  </View>

                  <CampaignCard
                    campaign={CAMPAIGNS[0]}
                    onOpen={() => navigation.navigate("Page", { pageId: "ngoCommunityFeed" })}
                  />

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "volunteerDiscovery" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="account-search-outline" size={28} color="#00D65B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Volunteer Discovery</Text>
                      <Text style={styles.tipSubtitle}>Find repeat volunteers, new supporters, and high-impact contributors.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Partner NGOs</Text>
                    <Text style={styles.sectionSubtitle}>Collaboration and partnership opportunities</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "partnerNgos" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="handshake-outline" size={28} color="#0EA5E9" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Partner NGO Network</Text>
                      <Text style={styles.tipSubtitle}>Review aligned organizations, active MOUs, and joint-drive opportunities.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 2 && (
                <Pressable
                  style={({ pressed }) => [styles.leaderboardPlaceholder, pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] }]}
                  onPress={() => navigation.navigate("Page", { pageId: "pastCampaignAnalytics" })}
                >
                  <MaterialCommunityIcons name="chart-line" size={64} color="#8B5CF6" />
                  <Text style={styles.mapTitle}>Past Campaign Analytics</Text>
                  <Text style={styles.mapSubtitle}>Turnout, impact, and campaign performance analytics for your NGO.</Text>
                </Pressable>
              )}
            </>
          ) : activeRole === "worker" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Task List</Text>
                    <Text style={styles.sectionSubtitle}>Assigned work items for this shift</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "taskList" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="format-list-checks" size={28} color="#F59E0B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Today's Task List</Text>
                      <Text style={styles.tipSubtitle}>Review assigned tasks, SLAs, and the next work item to close.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "closeActiveTask" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="camera-burst" size={28} color="#F59E0B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Quick Close Task / Upload Proof</Text>
                      <Text style={styles.tipSubtitle}>Select a task, capture before and after proof, and submit for closure.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Area-wise Assigned Work</Text>
                    <Text style={styles.sectionSubtitle}>Grouped by zones and stops</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "areaAssignedWork" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="map-marker-path" size={28} color="#0EA5E9" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Assigned Work by Area</Text>
                      <Text style={styles.tipSubtitle}>See route clusters, assigned stops, and zone-level work balance.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 2 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Closed and Pending Tasks</Text>
                    <Text style={styles.sectionSubtitle}>Track what is done and what still needs closure</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "closedTasks" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="check-decagram-outline" size={28} color="#00D65B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Closed Tasks</Text>
                      <Text style={styles.tipSubtitle}>Review tasks already completed and sent for final or verified closure.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "pendingTasks" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="progress-clock" size={28} color="#F43F5E" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Pending Tasks</Text>
                      <Text style={styles.tipSubtitle}>See tasks awaiting proof upload, completion, or final review.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}
            </>
          ) : activeRole === "champion" ? (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Verification Queue</Text>
                    <Text style={styles.sectionSubtitle}>Open reports waiting for moderation</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "verifyReports" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="check-decagram-outline" size={28} color="#8B5CF6" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Open Verification Queue</Text>
                      <Text style={styles.tipSubtitle}>View proof, check image and location, then approve, reject, clarify, or escalate.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 1 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Approved and Rejected Reports</Text>
                    <Text style={styles.sectionSubtitle}>Review recent moderation outcomes</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "recentApprovedReports" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="check-circle-outline" size={28} color="#00D65B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Recent Approved Reports</Text>
                      <Text style={styles.tipSubtitle}>See which reports were approved and forwarded after moderation.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "rejectedReports" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="close-octagon-outline" size={28} color="#F43F5E" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Rejected Reports</Text>
                      <Text style={styles.tipSubtitle}>Review duplicate, low-quality, or mismatched reports that were rejected.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 2 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Community Escalations</Text>
                    <Text style={styles.sectionSubtitle}>Cases needing deeper review or authority support</Text>
                  </View>

                  <Pressable style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]} onPress={() => navigation.navigate("Page", { pageId: "communityEscalations" })}>
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="alert-octagon-outline" size={28} color="#F43F5E" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Community Escalations</Text>
                      <Text style={styles.tipSubtitle}>Track flagged cases, unresolved disputes, and unsafe report evidence.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <>
              {activeTab === 0 && (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nearby Drives</Text>
                    <Text style={styles.sectionSubtitle}>Based on your location</Text>
                  </View>

                  {CAMPAIGNS.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onOpen={() =>
                        navigation.navigate("Page", {
                          pageId: campaign.id === "1" ? "campaignBeachCleanup" : "campaignParkRestoration",
                        })
                      }
                    />
                  ))}

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Learning / Eco Tips</Text>
                    <Text style={styles.sectionSubtitle}>Short guidance for better reporting</Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [styles.tipCard, pressed && styles.cardPressed]}
                    onPress={() => navigation.navigate("Page", { pageId: "ecoTips" })}
                  >
                    <View style={styles.tipIconWrap}>
                      <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#00D65B" />
                    </View>
                    <View style={styles.tipTextWrap}>
                      <Text style={styles.tipTitle}>Eco Tip of the Day</Text>
                      <Text style={styles.tipSubtitle}>Use landmark notes and daylight photos to speed up verification.</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
                  </Pressable>
                </View>
              )}

              {activeTab === 1 && (
                <View style={styles.mapPlaceholder}>
                  <MaterialCommunityIcons name="map-search-outline" size={64} color="#CBD5E1" />
                  <Text style={styles.mapTitle}>Interactive Map View</Text>
                  <Text style={styles.mapSubtitle}>Requires react-native-maps integration.</Text>
                  <Pressable
                    style={({ pressed }) => [styles.mapActionBtn, pressed && { opacity: 0.8 }]}
                    onPress={() => navigation.navigate("Page", { pageId: "liveMapAccess" })}
                  >
                    <Text style={styles.mapActionText}>Enable Location Services</Text>
                  </Pressable>
                </View>
              )}

              {activeTab === 2 && (
                <Pressable
                  style={({ pressed }) => [styles.leaderboardPlaceholder, pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] }]}
                  onPress={() => navigation.navigate("Page", { pageId: "cityLeaderboard" })}
                >
                  <MaterialCommunityIcons name="trophy-award" size={64} color="#F59E0B" />
                  <Text style={styles.mapTitle}>City Leaderboards</Text>
                  <Text style={styles.mapSubtitle}>See who's leading the GreenPoints charts in your ward.</Text>
                </Pressable>
              )}
            </>
          )}          <View style={{ height: 120 }} />
        </ScrollView>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 12 : 24,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 4,
    borderRadius: 14,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
  },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: "#E2E8F0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
  },
  badgeTopLeft: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  badgeTextDark: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0F172A",
  },
  badgeTopRight: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00E676",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
    shadowColor: "#00D65B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  badgeTextLight: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardBody: {
    padding: 20,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tagPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  ngoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  ngoName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  dateText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  joinBtn: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  joinBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  joinBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  mapPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  leaderboardPlaceholder: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 16,
    marginBottom: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  tipIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  tipTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  tipSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },
  mapActionBtn: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  mapActionText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});






