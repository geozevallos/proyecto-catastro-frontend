export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
  expiresIn: number;
}
