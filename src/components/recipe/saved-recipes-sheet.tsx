import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { getSavedRecipes, getCuisines } from "@/services/recipe"
import { RecipeDetailDialog } from "@/components/recipe/recipe-detail-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function SavedRecipesSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCuisine, setSelectedCuisine] = useState<string>("all")

    const { data: savedRecipes, isLoading } = useQuery({
        queryKey: ['saved-recipes'],
        queryFn: getSavedRecipes
    });

    const { data: cuisines } = useQuery({ queryKey: ['cuisines'], queryFn: getCuisines });

    // Client-side filtering
    const filteredRecipes = savedRecipes?.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCuisine = selectedCuisine === "all" || recipe.cuisine === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

    const handleViewRecipe = (recipe: any) => {
        setSelectedRecipe(recipe);
        setIsOpen(false);
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2 rounded-full border-primary/20 hover:bg-primary/10">
                        <Bookmark className="h-4 w-4 text-primary" />
                        My Cookbook
                        {savedRecipes && savedRecipes.length > 0 && (
                            <span className="ml-1 bg-primary text-[10px] text-primary-foreground font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[1.25rem]">
                                {savedRecipes.length}
                            </span>
                        )}
                    </Button>
                </SheetTrigger>
                {/* Mobile Trigger (Icon Only) */}
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="sm:hidden relative">
                        <Bookmark className="h-5 w-5" />
                        {savedRecipes && savedRecipes.length > 0 && (
                            <span className="absolute top-1 right-1 h-3 w-3 bg-primary rounded-full border-2 border-background" />
                        )}
                    </Button>
                </SheetTrigger>

                <SheetContent className="w-full sm:max-w-xl overflow-y-auto z-[60] glass border-l border-white/10 p-0">
                    <SheetHeader className="p-6 pb-2 sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b border-white/10">
                        <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                            <BookmarkCheck className="h-6 w-6 text-primary" /> My CookBook
                        </SheetTitle>
                        <SheetDescription>
                            Your personal collection of saved recipes.
                        </SheetDescription>

                        {/* Search & Filter Bar */}
                        <div className="pt-4 pb-2 flex gap-2">
                            <Input
                                placeholder="Search your recipes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-background/50 flex-1"
                            />
                            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                                <SelectTrigger className="w-[140px] bg-background/50">
                                    <SelectValue placeholder="Cuisine" />
                                </SelectTrigger>
                                <SelectContent className="z-[70]">
                                    <SelectItem value="all">All Cuisines</SelectItem>
                                    {cuisines?.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </SheetHeader>

                    <div className="p-6 pt-6 flex flex-col gap-6 min-h-[50vh]">
                        {isLoading && <div className="text-center py-10"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>}

                        {!isLoading && savedRecipes?.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-white/10 border-dashed">
                                <Bookmark className="h-12 w-12 mb-4 opacity-20" />
                                <p className="font-medium">Your cookbook is empty</p>
                                <p className="text-sm opacity-70">Save recipes you love to find them here.</p>
                            </div>
                        )}

                        {!isLoading && savedRecipes && savedRecipes.length > 0 && filteredRecipes?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No recipes found matching "{searchQuery}"</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            {filteredRecipes?.map((recipe) => (
                                <div key={recipe.id} className="relative group">
                                    <RecipeCard
                                        recipe={recipe}
                                        isSaved={true}
                                        onSave={() => { }}
                                        onView={handleViewRecipe}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <RecipeDetailDialog
                recipe={selectedRecipe}
                open={!!selectedRecipe}
                onOpenChange={(open) => !open && setSelectedRecipe(null)}
                isSaved={true}
                onSave={() => { }}
            />
        </>
    )
}