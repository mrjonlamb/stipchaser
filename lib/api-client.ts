/**
 * API Client for StipChaser
 * Handles all API calls to the backend Lambda functions
 */

import { getAccessToken } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { params, ...fetchOptions } = options;

  let url = `${API_URL}${endpoint}`;

  // Add query parameters if provided
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get access token and add to headers
  const token = await getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle unauthorized responses
  if (response.status === 401) {
    // Redirect to login if unauthorized
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized - Please sign in");
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Deals API
export const dealsAPI = {
  list: (params?: { status?: string; customerId?: string }) =>
    fetchAPI("/deals", { params }),

  get: (id: string) => fetchAPI(`/deals/${id}`),

  create: (data: any) =>
    fetchAPI("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/deals/${id}`, {
      method: "DELETE",
    }),
};

// Documents API
export const documentsAPI = {
  list: (params?: { dealId?: string }) => fetchAPI("/documents", { params }),

  get: (id: string) => fetchAPI(`/documents/${id}`),

  initiateUpload: (data: {
    dealId: string;
    fileName: string;
    fileType: string;
    category?: string;
  }) =>
    fetchAPI("/documents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/documents/${id}`, {
      method: "DELETE",
    }),

  // Upload file directly to S3 using presigned URL
  uploadToS3: async (presignedUrl: string, file: File) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to S3");
    }

    return response;
  },
};

// Conversations API
export const conversationsAPI = {
  list: (params?: { dealId?: string }) =>
    fetchAPI("/conversations", { params }),

  create: (data: { dealId: string; participants: any[] }) =>
    fetchAPI("/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMessages: (conversationId: string) =>
    fetchAPI(`/conversations/${conversationId}/messages`),

  sendMessage: (
    conversationId: string,
    data: {
      content: string;
      senderId: string;
      senderName: string;
      senderRole?: string;
    }
  ) =>
    fetchAPI(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Users API
export const usersAPI = {
  list: (params?: { role?: string; status?: string }) =>
    fetchAPI("/users", { params }),

  invite: (data: {
    email: string;
    role: "DealerManager" | "DealerStaff" | "Consumer";
    firstName?: string;
    lastName?: string;
  }) =>
    fetchAPI("/users/invite", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { status?: string; role?: string }) =>
    fetchAPI(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/users/${id}`, {
      method: "DELETE",
    }),

  acceptInvitation: (data: { email: string; cognitoUserId: string }) =>
    fetchAPI("/users/accept-invitation", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export default {
  deals: dealsAPI,
  documents: documentsAPI,
  conversations: conversationsAPI,
  users: usersAPI,
};
