import { apiClient } from "../api/client";

export const reportService = {
  /**
   * CITIZEN: Submit a new waste report
   */
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
      
      // Sending coordinates as strings so they safely pass through form-data
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      // Format the image for upload
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
};