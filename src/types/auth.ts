export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface RegisterDto {
    email: string;
    password: string;
    name?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export interface UpdateProfileDto {
    name?: string;
    currentPassword?: string;
    newPassword?: string;
}
