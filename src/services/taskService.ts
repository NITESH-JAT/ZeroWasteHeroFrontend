import { apiClient } from "../api/client";

export const taskService = {
  getMyTasks: async () => {
    try {
      const response = await apiClient.get("/tasks/my-tasks");
      return response.data.data;
    } catch (error) {
      console.log("Error fetching worker tasks:", error);
      return [];
    }
  },

  completeTask: async (taskId: string, imageUri: string) => {
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'proof.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      // Match the 'proofImage' field name expected by your backend upload.single('proofImage')
      formData.append("proofImage", { uri: imageUri, name: filename, type } as any);

      const response = await apiClient.patch(`/tasks/${taskId}/complete`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to submit proof");
    }
  }
};