import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { ScreenSafeArea } from "../../components/ui/ScreenSafeArea";
import { RootStackParamList } from "../../navigation/types";
import { scrapService } from "../../services/scrapService";

type Props = NativeStackScreenProps<RootStackParamList, "ScrapperBids">;

export function ScrapperBidsScreen({ navigation }: Props) {
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMyBids = async () => {
    try {
      const data = await scrapService.getMyBids();
      setBids(data);
    } catch (error: any) {
      console.log("Error fetching bids:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyBids();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchMyBids();
  };

  // Dynamic styles for the status badge
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED": return { color: "#10B981", bg: "#ECFDF5", icon: "check-decagram" };
      case "REJECTED": return { color: "#EF4444", bg: "#FEF2F2", icon: "close-octagon" };
      default: return { color: "#F59E0B", bg: "#FFFBEB", icon: "clock-outline" }; // PENDING
    }
  };

  const renderBid = ({ item }: any) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.listingImage }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>{item.listingTitle}</Text>
            <View style={[styles.badge, { backgroundColor: statusConfig.bg }]}>
              <MaterialCommunityIcons name={statusConfig.icon as any} size={14} color={statusConfig.color} style={{ marginRight: 4 }} />
              <Text style={[styles.badgeText, { color: statusConfig.color }]}>{item.status}</Text>
            </View>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Your Offer:</Text>
            <Text style={styles.amountText}>₹{item.amount}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Pickup:</Text>
            <Text style={styles.timeText}>{item.proposedTime}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenSafeArea style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
        </Pressable>
        <Text style={styles.headerTitle}>My Bids</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#14B8A6" />
        </View>
      ) : bids.length === 0 ? (
        <View style={styles.centerBox}>
          <MaterialCommunityIcons name="hand-coin-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Bids Yet</Text>
          <Text style={styles.emptySubtitle}>Head to the Marketplace to find scrap and place your first offer.</Text>
          <Pressable style={styles.exploreBtn} onPress={() => navigation.navigate("Explore" as any)}>
            <Text style={styles.exploreBtnText}>Browse Marketplace</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={bids}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderBid}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#14B8A6" />}
        />
      )}
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F8FAFC", justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  listContent: { padding: 20, gap: 16, paddingBottom: 100 },
  card: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 20, padding: 12, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#0F172A", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  cardImage: { width: 80, height: 80, borderRadius: 14, backgroundColor: "#F1F5F9", marginRight: 16 },
  cardContent: { flex: 1, justifyContent: "center" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "800", color: "#0F172A", flex: 1, marginRight: 8 },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  metaLabel: { fontSize: 13, color: "#64748B", width: 70, fontWeight: "500" },
  amountText: { fontSize: 15, fontWeight: "800", color: "#14B8A6" },
  timeText: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: "#64748B", textAlign: "center", lineHeight: 22, marginBottom: 24 },
  exploreBtn: { backgroundColor: "#14B8A6", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  exploreBtnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});