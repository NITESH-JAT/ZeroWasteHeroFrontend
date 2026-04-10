import { apiClient } from "../api/client";

export const campaignService = {
  getCampaigns: async (lat?: number, lng?: number) => {
    try {
      const query = (lat && lng) ? `?lat=${lat}&lng=${lng}` : "";
      const response = await apiClient.get(`/campaigns${query}`);
      return response.data.data; 
    } catch (error: any) {
      console.log("Campaign fetch error:", error);
      return []; 
    }
  }
};