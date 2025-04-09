
export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
