export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  meta: {
    timestamp: string;
    requestId: string;
    generatedAt: string;
  };
}