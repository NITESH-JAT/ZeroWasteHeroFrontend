import { apiClient } from "../api/client";

export const authorityService = {
  getStats: async () => {
    try {
      const response = await apiClient.get("/authority/stats");
      return response.data.data;
    } catch (error) {
      return { totalReports: 0, resolvedReports: 0, cleanRate: "0%", activeNgos: 0 };
    }
  },
  getNgos: async () => {
    try {
      const response = await apiClient.get("/authority/ngos");
      return response.data.data;
    } catch (error) {
      return [];
    }
  },
  getPenalties: async () => {
    try {
      const response = await apiClient.get("/authority/penalties");
      return response.data.data;
    } catch (error) {
      return [];
    }
  },
  getUsers: async () => {
    try {
      const response = await apiClient.get("/authority/users");
      return response.data.data;
    } catch (error) {
      return [];
    }
  },
  issuePenalty: async (userId: string, amount: number, reason: string) => {
    try {
      const response = await apiClient.post("/authority/penalties", { userId, amount, reason });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to issue penalty");
    }
  }
};