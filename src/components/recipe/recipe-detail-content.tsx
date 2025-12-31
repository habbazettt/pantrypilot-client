import { Clock, ChefHat, AlertTriangle, Star, MessageSquare } from "lucide-react"
import type { RecipeResponseDto } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAggregatedFeedback } from "@/services/feedback"
import { FeedbackModal } from "@/components/feedback/feedback-modal"
import { RatingStars } from "@/components/ui/rating-stars"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecipeDetailContentProps {
    recipe: RecipeResponseDto
    headerAction?: React.ReactNode
    isDialog?: boolean
}

export function RecipeDetailContent({ recipe, headerAction, isDialog = false }: RecipeDetailContentProps) {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Fetch detailed feedback (comments, distribution)
    const { data: feedbackData } = useQuery({
        queryKey: ['feedback', recipe.id],
        queryFn: () => getAggregatedFeedback(recipe.id),
        enabled: !!recipe,
    });

    return (
        <div className="flex flex-col h-full bg-background/20 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 pb-4 border-b border-white/10 shrink-0 bg-background/40 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold leading-tight mb-3">{recipe.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full border border-secondary/20">
                                <Clock className="h-4 w-4" />
                                {recipe.estimatedTime} mins
                            </div>
                            <div className="flex items-center gap-1.5 capitalize bg-secondary/30 px-3 py-1 rounded-full border border-secondary/20">
                                <ChefHat className="h-4 w-4" />
                                {recipe.difficulty}
                            </div>
                            {/* Rating badge */}
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/20">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="font-semibold">{recipe.averageRating?.toFixed(1) || "New"}</span>
                                <span className="text-xs opacity-70">({recipe.reviewCount || 0} reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex gap-2 shrink-0 ${isDialog ? 'mr-10' : ''}`}>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setIsFeedbackOpen(true)}
                        >
                            <Star className="h-4 w-4" /> Rate
                        </Button>
                        {headerAction}
                    </div>
                </div>
                <div className="mt-4 text-base leading-relaxed text-foreground/80">
                    {recipe.description}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="p-8 space-y-10">
                    {/* Ingredients & Instructions Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ingredients */}
                        <div className="bg-card/50 rounded-2xl p-6 border border-border/50 shadow-sm h-fit">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                Ingredients
                            </h3>
                            <ul className="space-y-3">
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm group">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary/50 mt-1.5 group-hover:bg-primary transition-colors" />
                                        <span className="group-hover:text-primary/90 transition-colors">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <div className="h-6 w-1.5 bg-primary rounded-full" />
                                Instructions
                            </h3>
                            <div className="space-y-6 relative border-l-2 border-primary/10 ml-3 pl-6">
                                {recipe.steps.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-[31px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                            {idx + 1}
                                        </div>
                                        <p className="text-base text-muted-foreground group-hover:text-foreground transition-colors">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/50" />

                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Reviews & Feedback
                        </h3>

                        {!feedbackData?.recentComments?.length ? (
                            <div className="text-center py-8 text-muted-foreground bg-accent/5 rounded-xl border border-dashed border-border/50">
                                <p>No reviews yet. Be the first to try this recipe!</p>
                                <Button variant="link" onClick={() => setIsFeedbackOpen(true)}>Write a review</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {feedbackData.recentComments.map((feedback: any) => (
                                    <div key={feedback.id} className="p-4 rounded-xl bg-card border border-border/50 flex gap-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{feedback.rating || "?"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">Chef</span>
                                                    <RatingStars rating={feedback.rating || 0} size="sm" readonly />
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {feedback.comment && (
                                                <p className="text-sm text-foreground/80">{feedback.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Safety Notes */}
                    {recipe.safetyNotes && recipe.safetyNotes.length > 0 && (
                        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
                            <h4 className="flex items-center gap-2 font-bold text-yellow-600 dark:text-yellow-500 mb-3">
                                <AlertTriangle className="h-5 w-5" /> Safety First
                            </h4>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {recipe.safetyNotes.map((note, idx) => (
                                    <li key={idx}>{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                recipeId={recipe.id}
                recipeName={recipe.title}
            />
        </div>
    )
}
