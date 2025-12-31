import { api } from "@/lib/api";

type HealthCheckResponse = {
    status: string;
    timestamp: string;
};

export const checkHealth = async (): Promise<HealthCheckResponse> => {
    const response = await api.get<HealthCheckResponse>("/health");
    return response.data;
};
