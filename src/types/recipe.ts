export type RecipeDifficulty = "easy" | "medium" | "hard";

export interface RecipeResponseDto {
    id: string;
    title: string;
    description?: string;
    ingredients: string[];
    steps: string[];
    estimatedTime: number;
    difficulty: RecipeDifficulty;
    safetyNotes?: string[];
    tags?: string[];
    rating?: number;
    createdAt: string; // Date string
    reviewCount?: number;
    averageRating?: number;
    userRating?: number; // For current user context if available
    cuisine?: string;
}

export interface GenerateRecipeResponseDto {
    recipes: RecipeResponseDto[];
    cached: boolean;
    generatedAt: string;
    fingerprint?: string;
}

export interface GenerateRecipeDto {
    ingredients: string[];
    maxTime?: number;
    difficulty?: RecipeDifficulty | "any";
    allergies?: string[];
    preferences?: string[];
    cuisine?: string;
}

export interface SaveRecipeDto {
    recipeId: string;
    sessionId?: string;
}

export interface AlternativesQueryDto {
    ingredients: string; // comma separated
    allergies?: string;
    preferences?: string;
    limit?: string;
}

export interface AlternativesResponse {
    recipes: RecipeResponseDto[];
    matchScore: number;
}

export interface RecipeSearchParams {
    q?: string;
    difficulty?: RecipeDifficulty | "any";
    maxTime?: number;
    tags?: string;
    cuisine?: string;
    sortBy?: "createdAt" | "rating" | "estimatedTime";
    order?: "asc" | "desc";
    limit?: number;
    offset?: number;
}

export interface RecipeSearchResponse {
    data: RecipeResponseDto[];
    total: number;
    limit: number;
    offset: number;
}
