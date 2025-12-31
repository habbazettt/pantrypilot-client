import { useState, useRef, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { RecipeCardSkeleton } from "@/components/recipe/recipe-skeletons"
import { SearchFilters } from "./search-filters"
import { searchRecipes, saveRecipe, unsaveRecipe } from "@/services/recipe"
import type { RecipeDifficulty } from "@/types/recipe"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSavedRecipes } from "@/services/recipe"
import { useQuery } from "@tanstack/react-query"

export function SearchView() {
    const [q, setQ] = useState("")
    const [difficulty, setDifficulty] = useState<RecipeDifficulty | "any">("any")
    const [cuisine, setCuisine] = useState<string>("any")
    const [maxTime, setMaxTime] = useState(180)
    const [tags, setTags] = useState("")
    const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "estimatedTime">("createdAt")
    const [order, setOrder] = useState<"asc" | "desc">("desc")

    const queryClient = useQueryClient();

    // Infinite Query for Search
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError
    } = useInfiniteQuery({
        queryKey: ['recipes', 'search', { q, difficulty, cuisine, maxTime, tags, sortBy, order }],
        queryFn: ({ pageParam = 0 }) => searchRecipes({
            q,
            difficulty,
            cuisine,
            maxTime,
            tags,
            sortBy,
            order,
            limit: 12,
            offset: pageParam as number
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages) => {
            const nextOffset = lastPage.offset + lastPage.limit;
            return nextOffset < lastPage.total ? nextOffset : undefined;
        }
    });

    // Save/Unsave Logic (Reused)
    const saveMutation = useMutation({
        mutationFn: async ({ id, isSaved }: { id: string, isSaved: boolean }) => {
            if (isSaved) {
                await unsaveRecipe(id);
                return "unsaved";
            } else {
                await saveRecipe(id);
                return "saved";
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['saved-recipes'] });
            const action = variables.isSaved ? "Removed from" : "Added to";
            toast.success(`${action} Cookbook`);
        },
        onError: (err: any) => {
            toast.error("Action failed", { description: err.message });
        }
    });

    const { data: savedRecipes } = useQuery({ queryKey: ['saved-recipes'], queryFn: getSavedRecipes });
    const savedIds = new Set(savedRecipes?.map(r => r.id));

    const handleSaveToggle = (id: string, isSaved: boolean) => {
        saveMutation.mutate({ id, isSaved });
    }

    // Infinite Scroll Intersection Observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage({});
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasNextPage, fetchNextPage]);

    const handleClearFilters = () => {
        setDifficulty("any")
        setCuisine("any")
        setMaxTime(180)
        setTags("")
    }

    return (
        <div className="w-full animate-in fade-in duration-500">
            <div className="max-w-xl mx-auto mb-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                    placeholder="Search for recipes (e.g. 'spicy chicken')..."
                    className="pl-10 h-12 text-lg rounded-full shadow-sm bg-background/50 backdrop-blur-sm focus-visible:ring-primary/30"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            <SearchFilters
                difficulty={difficulty} setDifficulty={setDifficulty}
                cuisine={cuisine} setCuisine={setCuisine}
                maxTime={maxTime} setMaxTime={setMaxTime}
                tags={tags} setTags={setTags}
                sortBy={sortBy} setSortBy={setSortBy}
                order={order} setOrder={setOrder}
                onClear={handleClearFilters}
            />

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {isError && (
                <div className="text-center py-20 text-destructive">
                    <p>Failed to load recipes. Please try again.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.pages.map((group, i) => (
                    group.data.map((recipe, index) => (
                        <div
                            key={recipe.id}
                            ref={
                                (i === data.pages.length - 1 && index === group.data.length - 1)
                                    ? lastElementRef
                                    : null
                            }
                        >
                            <RecipeCard
                                recipe={recipe}
                                isSaved={savedIds.has(recipe.id)}
                                onSave={handleSaveToggle}
                            />
                        </div>
                    ))
                ))}
            </div>

            {!isLoading && data?.pages[0]?.data.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No recipes found matching your criteria.</p>
                    <Button variant="link" onClick={handleClearFilters}>Clear Filters</Button>
                </div>
            )}

            {isFetchingNextPage && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <RecipeCardSkeleton key={`skeleton-${i}`} />
                    ))}
                </div>
            )}
        </div>
    )
}
