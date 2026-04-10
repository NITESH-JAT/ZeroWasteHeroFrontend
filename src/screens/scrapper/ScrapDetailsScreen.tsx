//src/screens/details/ScrapDetailsScreen.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { RootStackParamList } from "../../navigation/types";
import { scrapService } from "../../services/scrapService";

type Props = NativeStackScreenProps<RootStackParamList, "ScrapDetails">;

export function ScrapDetailsScreen({ route, navigation }: Props) {
  const { listing } = route.params;

  // Bidding State (Same logic as the Feed screen)
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposedTime, setProposedTime] = useState("");
  const [isBidding, setIsBidding] = useState(false);

  const handleSubmitBid = async () => {
    if (!bidAmount || !proposedTime) {
      Alert.alert("Missing Info", "Please provide a bid amount and pickup time.");
      return;
    }

    setIsBidding(true);
    try {
      await scrapService.submitBid(listing.id, Number(bidAmount), proposedTime);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Bid Placed! 🚀", "The citizen will be notified of your offer.");
      setShowBidModal(false);
      navigation.goBack(); // Go back to the feed after bidding!
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Big Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: listing.imageUrl }} style={styles.heroImage} />
          <Pressable 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0F172A" />
          </Pressable>
        </View>

        {/* Content Card that overlaps the image */}
        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>OPEN</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#14B8A6" />
            <Text style={styles.metaText}>{listing.city}</Text>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="account" size={18} color="#14B8A6" />
            <Text style={styles.metaText}>Posted by {listing.citizenFirstName} {listing.citizenLastName}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {listing.description || "No additional details provided by the seller."}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button at the bottom */}
      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [styles.bidBtn, pressed && { transform: [{ scale: 0.98 }] }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowBidModal(true);
          }}
        >
          <Text style={styles.bidBtnText}>Make an Offer</Text>
        </Pressable>
      </View>

      {/* BIDDING BOTTOM SHEET MODAL */}
      <Modal visible={showBidModal} transparent animationType="slide" onRequestClose={() => setShowBidModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowBidModal(false)} />
          
          <View style={styles.sheetContent}>
            <View style={styles.dragIndicator} />
            <Text style={styles.sheetTitle}>Offer on {listing.title}</Text>
            
            <Text style={styles.label}>Your Bid Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />

            <Text style={styles.label}>Proposed Pickup Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tomorrow at 4:00 PM"
              value={proposedTime}
              onChangeText={setProposedTime}
            />

            <Pressable 
              style={({ pressed }) => [styles.submitBidBtn, isBidding && { opacity: 0.7 }]}
              onPress={handleSubmitBid}
              disabled={isBidding}
            >
              {isBidding ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBidBtnText}>Send Offer</Text>}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  imageContainer: { width: "100%", height: 350, position: "relative" },
  heroImage: { width: "100%", height: "100%" },
  backBtn: { position: "absolute", top: 50, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  contentCard: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, padding: 24, minHeight: 500 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "800", color: "#0F172A", flex: 1, marginRight: 16, lineHeight: 32 },
  badge: { backgroundColor: "#ECFDF5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: "#10B981", fontSize: 13, fontWeight: "800" },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 8 },
  metaText: { fontSize: 15, color: "#475569", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 12 },
  description: { fontSize: 16, color: "#475569", lineHeight: 24 },
  footer: { padding: 20, paddingBottom: Platform.OS === "ios" ? 40 : 20, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  bidBtn: { backgroundColor: "#14B8A6", height: 60, borderRadius: 16, justifyContent: "center", alignItems: "center", shadowColor: "#14B8A6", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  bidBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  
  /* Modal Styles */
  modalOverlay: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.4)" },
  sheetContent: { backgroundColor: "#FFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24 },
  dragIndicator: { width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "700", color: "#334155", marginBottom: 8 },
  input: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, padding: 16, fontSize: 16, color: "#0F172A", marginBottom: 20 },
  submitBidBtn: { backgroundColor: "#14B8A6", height: 56, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 10 },
  submitBidBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});