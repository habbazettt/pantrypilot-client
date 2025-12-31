import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function RecipeCardSkeleton() {
    return (
        <Card className="h-full flex flex-col overflow-hidden border-white/20 dark:border-white/10">
            <CardHeader className="bg-primary/5 pb-4">
                <div className="flex justify-between items-start">
                    <div className="w-full pr-4 space-y-3">
                        {/* Title */}
                        <Skeleton className="h-7 w-3/4" />

                        {/* Badges */}
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </CardHeader>

            <CardContent className="flex-grow pt-6 space-y-4">
                <div>
                    {/* Ingredients Header */}
                    <Skeleton className="h-5 w-32 mb-3" />
                    {/* List */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-10/12" />
                        <Skeleton className="h-4 w-9/12" />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="bg-black/5 dark:bg-white/5 pt-4 gap-2 border-t border-white/10">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
            </CardFooter>
        </Card>
    )
}

export function RecipeDetailSkeleton() {
    return (
        <div className="flex flex-col h-full bg-background/20 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 pb-4 border-b border-white/10 shrink-0 bg-background/40">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-1/2" />
                        <div className="flex flex-wrap items-center gap-3">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-20 rounded-md" />
                        <Skeleton className="h-9 w-24 rounded-md toggled" />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden p-8 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ingredients */}
                    <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-10/12" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-9/12" />
                        </div>
                    </div>
                    {/* Instructions */}
                    <div>
                        <Skeleton className="h-6 w-32 mb-4" />
                        <div className="space-y-6 ml-3 pl-6 border-l-2 border-primary/10">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/6" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-11/12" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
