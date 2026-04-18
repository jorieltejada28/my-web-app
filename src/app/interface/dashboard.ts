export interface RegistrationTrend {
  month: string;
  count: number;
}

export interface CountryStat {
  country: string;
  count: number;
}

export interface UserStats {
  [key: string]: any;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    admin: number;
    moderator: number;
    user: number;
  };
  usersByStatus: {
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
  };
  registrationTrend: RegistrationTrend[];
  topCountries: CountryStat[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
    generatedAt: string;
  };
}