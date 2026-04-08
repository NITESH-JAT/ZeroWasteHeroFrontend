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
}

export interface ScrapBid {
  id: number;
  listingId: number;
  scrapperId: string;
  amount: string | number; // Decimal comes back as string from some SQL drivers
  proposedTime: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  scrapperFirstName?: string;
  scrapperLastName?: string;
}

export const scrapService = {
  /**
   * CITIZEN: Create a new scrap listing
   */
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

  /**
   * SCRAPPER: Fetch the open marketplace feed for a specific city
   */
  getFeed: async (city: string): Promise<ScrapListing[]> => {
    try {
      const response = await apiClient.get(`/scrap/feed?city=${encodeURIComponent(city)}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch feed");
    }
  },

  /**
   * SCRAPPER: Place a bid on a listing
   */
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

  /**
   * CITIZEN: Get all bids for a specific listing
   */
  getBidsForListing: async (listingId: number): Promise<ScrapBid[]> => {
    try {
      const response = await apiClient.get(`/scrap/listings/${listingId}/bids`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch bids");
    }
  },

  /**
   * CITIZEN: Accept a winning bid
   */
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
};