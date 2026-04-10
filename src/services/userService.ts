import { apiClient } from "../api/client";

export const userService = {
  getLeaderboard: async () => {
    try {
      const response = await apiClient.get("/users/leaderboard");
      return response.data.data;
    } catch (error) {
      console.log("Leaderboard fetch error:", error);
      return [];
    }
  },
  getMyStats: async () => {
    try {
      const response = await apiClient.get("/users/me/stats");
      return response.data.data;
    } catch (error) {
      console.log("Stats fetch error:", error);
      return { verifiedReports: 0, campaignsJoined: 0 };
    }
  }
};