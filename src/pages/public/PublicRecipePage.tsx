import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSharedRecipe } from "@/services/recipe";
import { RecipeDetailContent } from "@/components/recipe/recipe-detail-content";
import { ArrowLeft, Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { ShareModal } from "@/components/recipe/share-modal";
import { RecipeDetailSkeleton } from "@/components/recipe/recipe-skeletons";

export function PublicRecipePage() {
    const { shareId } = useParams<{ shareId: string }>();
    const navigate = useNavigate();
    const [showShare, setShowShare] = useState(false);

    const { data: recipe, isLoading, isError } = useQuery({
        queryKey: ['shared-recipe', shareId],
        queryFn: () => getSharedRecipe(shareId!),
        enabled: !!shareId,
        retry: false
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <header className="px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
                        PantryPilot
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="default" size="sm" onClick={() => navigate('/')}>Try PantryPilot</Button>
                        <ModeToggle />
                    </div>
                </header>
                <div className="flex-1 max-w-4xl mx-auto w-full py-8 px-4 h-full">
                    <div className="rounded-xl border glass-card overflow-hidden h-[80vh]">
                        <RecipeDetailSkeleton />
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !recipe) {
        return (
            <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
                <h2 className="text-2xl font-bold mb-2">Recipe Not Found</h2>
                <p className="text-muted-foreground mb-6">The link might be broken or expired.</p>
                <Button onClick={() => navigate('/')} className="gap-2">
                    <Home className="h-4 w-4" /> Go Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur p-4">
                <div className="container max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg hidden sm:inline">PantryPilot</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowShare(true)}>
                            <Share2 className="h-4 w-4" /> Share
                        </Button>
                        <Button onClick={() => navigate('/')} size="sm" className="gap-2">
                            <Home className="h-4 w-4" /> Try PantryPilot
                        </Button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container max-w-4xl mx-auto p-4 md:p-8">
                <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden min-h-[600px]">
                    <RecipeDetailContent recipe={recipe} />
                </div>

                <div className="text-center mt-8 text-muted-foreground">
                    <p className="text-sm">Shared via PantryPilot - Turn your ingredients into meals.</p>
                </div>
            </main>

            <ShareModal
                recipe={recipe}
                isOpen={showShare}
                onClose={() => setShowShare(false)}
            />
        </div>
    );
}
