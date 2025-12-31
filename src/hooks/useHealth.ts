import { useQuery } from "@tanstack/react-query";
import { checkHealth } from "@/services/health";

export const useHealthCheck = () => {
    return useQuery({
        queryKey: ["health"],
        queryFn: checkHealth,
        retry: 1,
        refetchInterval: 30000,
    });
};
