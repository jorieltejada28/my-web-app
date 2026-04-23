export interface User {
  id: string; // Changed to string based on your JSON "usr_1"
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[]; // This was the missing link
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    }
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}