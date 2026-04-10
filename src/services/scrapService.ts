import { apiClient } from "../api/client";

export interface ScrapListing {
  id: number;
  citizenId: string;
  title: string;
  description: string;
  imageUrl: string;
  city: string;
  status: "OPEN" | "ACCEPTED" | "COMPLETED";
  createdAt: string;
  citizenFirstName?: string;
  citizenLastName?: string;
  bids?: ScrapBid[];
}

export interface ScrapBid {
  id: number;
  listingId: number;
  scrapperId: string;
  amount: string | number;
  proposedTime: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  scrapperFirstName?: string;
  scrapperLastName?: string;
}

export const scrapService = {
  createListing: async (title: string, description: string, city: string, imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("city", city);

      const filename = imageUri.split('/').pop() || 'scrap.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      formData.append("image", { uri: imageUri, name: filename, type } as any);

      const response = await apiClient.post("/scrap/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create listing");
    }
  },

    getFeed: async (city: string): Promise<ScrapListing[]> => {
    try {
      const response = await apiClient.get(`/scrap/feed?city=${encodeURIComponent(city)}`);

      const mappedData = response.data.data.map((item: any) => ({
        ...item,
        imageUrl: item.image_url || item.imageUrl, // <-- The Magic Line!
        citizenId: item.citizen_id || item.citizenId,
        createdAt: item.created_at || item.createdAt
      }));

      return mappedData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch feed");
    }
  },

  submitBid: async (listingId: number, amount: number, proposedTime: string): Promise<ScrapBid> => {
    try {
      const response = await apiClient.post(`/scrap/listings/${listingId}/bids`, {
        amount,
        proposedTime,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to submit bid");
    }
  },

  getBidsForListing: async (listingId: number): Promise<ScrapBid[]> => {
    try {
      const response = await apiClient.get(`/scrap/listings/${listingId}/bids`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch bids");
    }
  },

  acceptBid: async (bidId: number, listingId: number) => {
    try {
      const response = await apiClient.patch(`/scrap/bids/${bidId}/accept`, {
        listingId,
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to accept bid");
    }
  },

getMyListings: async (): Promise<ScrapListing[]> => {
    try {
      const response = await apiClient.get("/scrap/my-listings");

      const mappedData = response.data.data.map((item: any) => ({
        ...item,
        imageUrl: item.image_url || item.imageUrl,
        citizenId: item.citizen_id || item.citizenId,
        createdAt: item.created_at || item.createdAt
      }));

      return mappedData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch your listings");
    }
  },

  getMyBids: async () => {
    try {
      const response = await apiClient.get("/scrap/my-bids");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch your bids");
    }
  },
};