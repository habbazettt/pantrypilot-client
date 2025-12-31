import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"

import { Bookmark, BookmarkCheck } from "lucide-react"
import type { RecipeResponseDto } from "@/types/recipe"
import { Button } from "@/components/ui/button"
import { RecipeDetailContent } from "./recipe-detail-content"

interface RecipeDetailDialogProps {
    recipe: RecipeResponseDto | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (id: string, isSaved: boolean) => void
    isSaved?: boolean
}

export function RecipeDetailDialog({ recipe, open, onOpenChange, onSave, isSaved = false }: RecipeDetailDialogProps) {
    if (!recipe) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-none glass-card bg-background/95">
                <RecipeDetailContent
                    recipe={recipe}
                    isDialog={true}
                    headerAction={
                        onSave && (
                            <Button
                                size="sm"
                                variant={isSaved ? "secondary" : "default"}
                                className="gap-2 shadow-sm"
                                onClick={() => onSave(recipe.id, isSaved)}
                            >
                                {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                                {isSaved ? "Saved" : "Save"}
                            </Button>
                        )
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

