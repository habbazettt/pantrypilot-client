import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import type { RecipeDifficulty } from "@/types/recipe"

interface SearchFiltersProps {
    difficulty: RecipeDifficulty | "any"
    setDifficulty: (val: RecipeDifficulty | "any") => void
    maxTime: number
    setMaxTime: (val: number) => void
    tags: string
    setTags: (val: string) => void
    sortBy: "createdAt" | "rating" | "estimatedTime"
    setSortBy: (val: "createdAt" | "rating" | "estimatedTime") => void
    order: "asc" | "desc"
    setOrder: (val: "asc" | "desc") => void
    onClear: () => void
    cuisine: string
    setCuisine: (val: string) => void
}

import { useQuery } from "@tanstack/react-query"
import { getCuisines } from "@/services/recipe"

export function SearchFilters({
    difficulty,
    setDifficulty,
    maxTime,
    setMaxTime,
    tags,
    setTags,
    sortBy,
    setSortBy,
    order,
    setOrder,
    onClear,
    cuisine,
    setCuisine
}: SearchFiltersProps) {
    const timeOptions = [15, 30, 45, 60, 90, 120, 180]
    const { data: cuisines } = useQuery({ queryKey: ['cuisines'], queryFn: getCuisines });
    const popularCuisines = ["ITALIAN", "JAPANESE", "MEXICAN", "INDIAN"];

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
                {/* Difficulty Filter */}
                <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                    <SelectTrigger className="w-[130px] h-8 rounded-full border-dashed bg-transparent">
                        <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Level</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>

                {/* Cuisine Filter */}
                <Select value={cuisine} onValueChange={setCuisine}>
                    <SelectTrigger className="w-[130px] h-8 rounded-full border-dashed bg-transparent">
                        <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="any">Any Cuisine</SelectItem>
                        {cuisines?.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Time Filter */}
                <Select value={maxTime.toString()} onValueChange={(v) => setMaxTime(Number(v))}>
                    <SelectTrigger className="w-[130px] h-8 rounded-full border-dashed bg-transparent">
                        <SelectValue placeholder="Max Time" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeOptions.map(t => (
                            <SelectItem key={t} value={t.toString()}>{t} mins</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                    <SelectTrigger className="w-[140px] h-8 rounded-full border-dashed bg-transparent text-muted-foreground">
                        <span className="text-foreground mr-1">Sort:</span> <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Newest</SelectItem>
                        <SelectItem value="rating">Top Rated</SelectItem>
                        <SelectItem value="estimatedTime">Fastest</SelectItem>
                    </SelectContent>
                </Select>

                {/* Order Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0"
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                >
                    {order === "asc" ? "↑" : "↓"}
                </Button>

                {/* Clear Filters (if any active) */}
                {(difficulty !== "any" || maxTime !== 180 || cuisine !== "any") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    >
                        Clear <X className="ml-1 h-3 w-3" />
                    </Button>
                )}
            </div>

            {/* Active Filters Display (Optional, for tags in future) */}
            {tags && (
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Tags:</span>
                    {tags.split(',').map(tag => (
                        <Badge key={tag} variant="secondary" className="rounded-md">
                            {tag} <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => {
                                const newTags = tags.split(',').filter(t => t !== tag).join(',')
                                setTags(newTags)
                            }} />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Quick Cuisine Select */}
            <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs font-medium text-muted-foreground self-center mr-1">Popular:</span>
                {popularCuisines.map(c => (
                    <Button
                        key={c}
                        variant={cuisine === c ? "secondary" : "outline"}
                        size="sm"
                        className="h-7 text-xs rounded-full"
                        onClick={() => setCuisine(c === cuisine ? "any" : c)}
                    >
                        {c.charAt(0) + c.slice(1).toLowerCase()}
                    </Button>
                ))}
            </div>
        </div>
    )
}
