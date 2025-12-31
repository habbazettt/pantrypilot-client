import { api } from "@/lib/api";
import type { CreateFeedbackDto, FeedbackResponse, AggregatedFeedbackDto } from "@/types/feedback";

export const submitFeedback = async (recipeId: string, dto: CreateFeedbackDto): Promise<FeedbackResponse> => {
    const response = await api.post<FeedbackResponse>(`/recipes/${recipeId}/feedback`, dto);
    return response.data;
};

export const getAggregatedFeedback = async (recipeId: string): Promise<AggregatedFeedbackDto> => {
    const response = await api.get<AggregatedFeedbackDto>(`/recipes/${recipeId}/feedback`);
    return response.data;
};
