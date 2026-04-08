import { apiClient } from "../api/client";
import { useAppStore } from "../store/useAppStore";
import { AppRole, mapRoleToBackend } from "../constants/roles";

export const authService = {
  /**
   * Registers a new user and saves their session
   */
register: async (firstName: string, lastName: string, email: string, password: string, role: AppRole, govIdUri?: string) => {
    try {
      const backendRole = mapRoleToBackend(role);
      let response;

      // If it's a Scrapper, we MUST use FormData to send the image file
      if (role === "scrapper") {
        if (!govIdUri) throw new Error("Government ID is required for Scrap Collectors.");
        
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("role", backendRole);

        // Append the image file
        const filename = govIdUri.split('/').pop() || 'govid.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append("govId", { uri: govIdUri, name: filename, type } as any);

        response = await apiClient.post("/auth/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Normal JSON registration for everyone else
        response = await apiClient.post("/auth/register", {
          firstName,
          lastName,
          email,
          password,
          role: backendRole,
        });
      }

      const { user, token } = response.data.data;
      const mappedUser = { ...user, role: user.role.toLowerCase() as AppRole };

      const setAuthData = useAppStore.getState().setAuthData;
      await setAuthData(mappedUser, token);

      return mappedUser;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      throw new Error(message);
    }
  },

  /**
   * Logs in an existing user and saves their session
   */
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data.data;
      const mappedUser = { ...user, role: user.role.toLowerCase() as AppRole };

      const setAuthData = useAppStore.getState().setAuthData;
      await setAuthData(mappedUser, token);

      return mappedUser;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  },
};