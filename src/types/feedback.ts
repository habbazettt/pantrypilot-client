export interface FeedbackResponse {
    id: string;
    recipeId: string;
    type: 'rating' | 'correction' | 'comment';
    rating?: number;
    comment?: string;
    createdAt: string;
}

export interface AggregatedFeedbackDto {
    averageRating: number;
    totalRatings: number;
    ratingDistribution: Record<number, number>;
    recentComments: FeedbackResponse[];
}

export interface CreateFeedbackDto {
    type: 'rating' | 'correction' | 'comment';
    rating?: number;
    comment?: string;
    corrections?: any[];
}
