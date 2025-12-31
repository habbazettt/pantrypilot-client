import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitFeedback } from "@/services/feedback";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RatingStars } from "../ui/rating-stars";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipeId: string;
    recipeName: string;
}

export function FeedbackModal({ isOpen, onClose, recipeId, recipeName }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            return submitFeedback(recipeId, {
                type: "rating",
                rating,
                comment: comment.trim() || undefined
            });
        },
        onSuccess: () => {
            toast.success("Feedback submitted", { description: "Thank you for rating this recipe!" });
            queryClient.invalidateQueries({ queryKey: ['feedback', recipeId] });
            onClose();
        },
        onError: (error: any) => {
            toast.error("Failed to submit feedback", {
                description: error.response?.data?.message || "Please try again later."
            });
        }
    });

    const handleSubmit = () => {
        if (rating === 0) {
            toast.warning("Please select a rating", { description: "Click on the stars to rate." });
            return;
        }
        mutation.mutate();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rate this Recipe</DialogTitle>
                    <DialogDescription>
                        How was your experience cooking <strong>{recipeName}</strong>?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-6">
                    <div className="text-center">
                        <span className="text-sm font-medium text-muted-foreground mb-2 block">Tap stars to rate</span>
                        <RatingStars
                            rating={rating}
                            onRate={setRating}
                            size="lg"
                            className="gap-2"
                        />
                        <span className="text-xs text-muted-foreground mt-2 block h-4">
                            {rating > 0 ? `${rating} out of 5 stars` : ""}
                        </span>
                    </div>

                    <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Share your thoughts (optional)..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={mutation.isPending}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Feedback
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
