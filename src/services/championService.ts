import { apiClient } from "../api/client";

export const championService = {
  // 1. Get Champion Stats for Home Screen
  getStats: async () => {
    try {
      const response = await apiClient.get("/champion/stats");
      return response.data.data;
    } catch (error) {
      console.log("Stats error:", error);
      return { pendingCount: 0, urgentCount: 0, accuracy: "98%" };
    }
  },

  // 2. Get Pending Reports (Queue)
  getPendingReports: async () => {
    try {
      const response = await apiClient.get("/champion/reports/pending");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch queue");
    }
  },

  // 3. Get Approved/Assigned Reports (To track work status)
// 3. Get Approved/Assigned Reports (To track work status)
  getApprovedReports: async () => {
    try {
      const response = await apiClient.get("/champion/reports/approved");
      return response.data.data;
    } catch (error: any) {
      // NOW WE CAN SEE THE ERROR IN THE TERMINAL!
      console.log("Assigned Reports Error:", error.response?.data || error.message);
      return [];
    }
  },

  // 4. Get list of Green Soldiers (Workers) for Assignment
  getWorkers: async () => {
    try {
      const response = await apiClient.get("/champion/workers");
      return response.data.data;
    } catch (error: any) {
      throw new Error("Failed to fetch workers");
    }
  },

  // 5. Verify & Assign Task to Worker
  verifyAndAssign: async (reportId: number | string, workerId: string) => {
    try {
      const response = await apiClient.post(`/champion/reports/${reportId}/assign`, { workerId });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to assign task");
    }
  },

  // 6. Get Hotspot Areas for Action Center
  getHotspots: async () => {
    try {
      const response = await apiClient.get("/champion/reports/hotspots");
      return response.data.data;
    } catch (error) {
      return { topArea: "Loading...", reportCount: 0 };
    }
  }
};