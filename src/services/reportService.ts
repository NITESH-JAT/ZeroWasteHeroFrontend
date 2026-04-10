import { apiClient } from "../api/client";

export const reportService = {
  submitReport: async (
    category: string,
    description: string,
    latitude: number,
    longitude: number,
    imageUri: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("description", description);
      
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      const filename = imageUri.split('/').pop() || 'report.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      formData.append("image", { uri: imageUri, name: filename, type } as any);

      const response = await apiClient.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to submit report");
    }
  },

  // --- NEW: Fetch ONLY the logged-in Citizen's reports ---
  getMyReports: async () => {
    try {
      const response = await apiClient.get("/reports/my-reports");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch your reports");
    }
  },
};