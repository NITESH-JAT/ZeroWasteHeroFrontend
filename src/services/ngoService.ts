import { apiClient } from "../api/client";

export const ngoService = {
  getStats: async () => {
    try {
      const response = await apiClient.get("/ngo/stats");
      return response.data.data;
    } catch (error) {
      console.error("NGO Stats Error:", error);
      return { activeCampaigns: 0, totalVolunteers: 0, budget: 0, wasteCollected: "0 kg" };
    }
  },
  
  getMyCampaigns: async () => {
    try {
      const response = await apiClient.get("/ngo/campaigns");
      return response.data.data;
    } catch (error) {
      console.error("NGO Campaigns Error:", error);
      return [];
    }
  }
};