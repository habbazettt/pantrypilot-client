import { api } from "@/lib/api";
import type { LoginDto, RegisterDto, LoginResponse, User } from "@/types/auth";

export const login = async (dto: LoginDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", dto);
    return response.data;
};

export const register = async (dto: RegisterDto): Promise<User> => {
    const response = await api.post<User>("/auth/register", dto);
    return response.data;
};

export const getProfile = async (): Promise<User> => {
    const response = await api.get<User>("/auth/profile");
    return response.data;
};
