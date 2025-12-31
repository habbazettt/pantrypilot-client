import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
    rating: number; // 0-5
    maxRating?: number;
    onRate?: (rating: number) => void;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function RatingStars({
    rating,
    maxRating = 5,
    onRate,
    readonly = false,
    size = "md",
    className
}: RatingStarsProps) {
    // Generate array [1, 2, 3, 4, 5]
    const stars = Array.from({ length: maxRating }, (_, i) => i + 1);

    const sizeClasses = {
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-6 w-6"
    };

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onRate && onRate(star)}
                    className={cn(
                        "transition-all duration-200 focus:outline-none focus:scale-110",
                        readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400" // Filled gold
                                : "fill-muted/20 text-muted-foreground/30", // Empty
                            // Half stars logic could be added here if needed, 
                            // but basic implementation uses full stars.
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
