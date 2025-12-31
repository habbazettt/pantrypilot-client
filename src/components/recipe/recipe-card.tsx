import type { RecipeResponseDto } from "@/types/recipe";
import { Clock, ChefHat, AlertTriangle, Bookmark, BookmarkCheck, Eye, Globe, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { RecipeDetailDialog } from "@/components/recipe/recipe-detail-dialog";
import { ShareModal } from "@/components/recipe/share-modal";

interface RecipeCardProps {
    recipe: RecipeResponseDto;
    onSave?: (id: string, currentlySaved: boolean) => void;
    isSaved?: boolean;
    index?: number;
    onView?: (recipe: RecipeResponseDto) => void;
}

export function RecipeCard({ recipe, onSave, isSaved, onView }: RecipeCardProps) {
    const [showDetail, setShowDetail] = useState(false);
    const [showShare, setShowShare] = useState(false);

    const handleView = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (onView) {
            onView(recipe);
        } else {
            setShowDetail(true);
        }
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShare(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                className="h-full"
            >
                <Card className="h-full flex flex-col overflow-hidden glass-card transition-all border-white/20 dark:border-white/10 hover:shadow-2xl hover:shadow-primary/20 relative group">
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-8 -top-8 text-primary/5 rotate-12 group-hover:rotate-45 transition-transform duration-700 pointer-events-none">
                        <ChefHat size={120} />
                    </div>

                    <CardHeader className="bg-primary/5 pb-4 cursor-pointer relative z-10" onClick={handleView}>
                        <div className="flex justify-between items-start">
                            <div className="pr-4">
                                <CardTitle className="text-xl md:text-2xl font-bold text-primary mb-2 line-clamp-2 hover:underline decoration-primary/50 underline-offset-4">
                                    {recipe.title}
                                </CardTitle>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge variant={recipe.difficulty === "easy" ? "default" : recipe.difficulty === "medium" ? "secondary" : "destructive"}>
                                        {recipe.difficulty}
                                    </Badge>
                                    {recipe.cuisine && (
                                        <Badge variant="outline" className="flex items-center gap-1 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
                                            <Globe className="h-3 w-3" /> {recipe.cuisine}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="flex items-center gap-1 bg-background/50 backdrop-blur-sm">
                                        <Clock className="h-3 w-3" /> {recipe.estimatedTime} mins
                                    </Badge>
                                    {recipe.averageRating ? (
                                        <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                                            <span className="text-xs">★</span> {recipe.averageRating.toFixed(1)} <span className="text-[10px] opacity-70">({recipe.reviewCount})</span>
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <CardDescription className="text-sm line-clamp-3 font-medium text-muted-foreground/90">
                            {recipe.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-grow pt-6 space-y-4 relative z-10">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2 mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                                <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">1</span>
                                Key Ingredients
                            </h4>
                            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground ml-1">
                                {recipe.ingredients.slice(0, 5).map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                                {recipe.ingredients.length > 5 && (
                                    <li className="list-none text-xs italic opacity-70 pl-4">+{recipe.ingredients.length - 5} more...</li>
                                )}
                            </ul>
                        </div>

                        {recipe.safetyNotes && recipe.safetyNotes.length > 0 && (
                            <div className="bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-xs backdrop-blur-sm">
                                <div className="flex items-center gap-1 font-bold text-destructive mb-1">
                                    <AlertTriangle className="h-3 w-3" /> Chef's Note
                                </div>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {recipe.safetyNotes.slice(0, 2).map((note, i) => (
                                        <li key={i}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="bg-black/5 dark:bg-white/5 pt-4 gap-2 backdrop-blur-md border-t border-white/10">
                        <Button
                            variant="ghost"
                            className="flex-1 gap-2 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={handleView}
                        >
                            <Eye className="h-4 w-4" /> View
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 hover:bg-black/5 dark:hover:bg-white/10"
                            onClick={handleShare}
                            title="Share Recipe"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={isSaved ? "secondary" : "default"}
                            className={`flex-1 gap-2 shadow-sm transition-all ${isSaved ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-primary/10"}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSave?.(recipe.id, isSaved || false);
                            }}
                        >
                            {isSaved ? <BookmarkCheck className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
                            {isSaved ? "Saved" : "Save"}
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            {!onView && (
                <RecipeDetailDialog
                    recipe={recipe}
                    open={showDetail}
                    onOpenChange={setShowDetail}
                    onSave={onSave}
                    isSaved={isSaved}
                />
            )}

            <ShareModal
                recipe={recipe}
                isOpen={showShare}
                onClose={() => setShowShare(false)}
            />
        </>
    );
}

