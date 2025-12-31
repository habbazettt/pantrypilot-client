import { api } from "@/lib/api";
import type {
    GenerateRecipeDto,
    GenerateRecipeResponseDto,
    RecipeResponseDto,
    AlternativesQueryDto,
    AlternativesResponse,
    RecipeSearchParams,
    RecipeSearchResponse
} from "@/types/recipe";
import type { AggregatedFeedbackDto, CreateFeedbackDto } from "@/types/feedback";

// --- Recipe Generation & Standard Operations ---

export const generateRecipes = async (dto: GenerateRecipeDto): Promise<GenerateRecipeResponseDto> => {
    const response = await api.post<GenerateRecipeResponseDto>("/recipes/generate", dto);
    return response.data;
};

export const getCuisines = async (): Promise<string[]> => {
    const response = await api.get<string[]>("/recipes/cuisines");
    return response.data;
};

export const getRecipeById = async (id: string): Promise<RecipeResponseDto> => {
    const response = await api.get<RecipeResponseDto>(`/recipes/${id}`);
    return response.data;
};

export const getAllRecipes = async (): Promise<RecipeResponseDto[]> => {
    const response = await api.get<RecipeResponseDto[]>("/recipes");
    return response.data;
};

// --- Saved Recipes / Bookmarking ---

export const saveRecipe = async (recipeId: string): Promise<RecipeResponseDto> => {
    const response = await api.post<RecipeResponseDto>("/recipes/save", { recipeId });
    return response.data;
};

export const unsaveRecipe = async (recipeId: string): Promise<void> => {
    await api.delete(`/recipes/saved/${recipeId}`);
};

export const getSavedRecipes = async (): Promise<RecipeResponseDto[]> => {
    const response = await api.get<RecipeResponseDto[]>("/recipes/saved");
    return response.data;
};

// --- Discovery & Alternatives ---

export const getSimilarRecipes = async (id: string): Promise<RecipeResponseDto[]> => {
    const response = await api.get<RecipeResponseDto[]>(`/recipes/${id}/similar`);
    return response.data;
};

export const getAlternatives = async (params: AlternativesQueryDto): Promise<AlternativesResponse[]> => {
    const response = await api.get<AlternativesResponse[]>("/recipes/alternatives", { params });
    return response.data;
};

// --- Feedback ---

export const submitFeedback = async (id: string, dto: CreateFeedbackDto): Promise<void> => {
    await api.post(`/recipes/${id}/feedback`, dto);
}

export const getFeedback = async (id: string): Promise<AggregatedFeedbackDto> => {
    const response = await api.get<AggregatedFeedbackDto>(`/recipes/${id}/feedback`);
    return response.data;
}

// --- Search ---

export const searchRecipes = async (params: RecipeSearchParams): Promise<RecipeSearchResponse> => {
    // Filter out undefined/null/empty values
    const cleanParams: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "" && value !== "any") {
            cleanParams[key] = value;
        }
    });

    const response = await api.get<RecipeSearchResponse>("/recipes/search", { params: cleanParams });
    return response.data;
};

// --- Social Sharing ---

export interface ShareRecipeResponse {
    shareId: string;
    shareUrl: string;
    ogImageUrl: string;
    createdAt: string;
}

export const generateShareLink = async (id: string): Promise<ShareRecipeResponse> => {
    const response = await api.get<ShareRecipeResponse>(`/recipes/${id}/share`);
    return response.data;
};

export const getSharedRecipe = async (shareId: string): Promise<RecipeResponseDto> => {
    const response = await api.get<RecipeResponseDto>(`/recipes/shared/${shareId}`);
    return response.data;
};
