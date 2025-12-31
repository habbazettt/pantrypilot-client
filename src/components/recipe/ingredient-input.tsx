import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface IngredientInputProps {
    ingredients: string[];
    onChange: (ingredients: string[]) => void;
    className?: string;
    maxIngredients?: number;
}

export function IngredientInput({
    ingredients,
    onChange,
    className,
    maxIngredients = 10,
}: IngredientInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !ingredients.includes(trimmed) && ingredients.length < maxIngredients) {
            onChange([...ingredients, trimmed]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const removeIngredient = (ingredientToRemove: string) => {
        onChange(ingredients.filter((i) => i !== ingredientToRemove));
    };

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter ingredient (e.g., chicken, eggs, rice)..."
                        className="flex h-12 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={ingredients.length >= maxIngredients}
                    />
                    <span className="absolute right-3 top-3 text-xs text-muted-foreground">
                        {ingredients.length}/{maxIngredients}
                    </span>
                </div>
                <Button onClick={handleAdd} disabled={!inputValue.trim() || ingredients.length >= maxIngredients}>
                    <Plus className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Add</span>
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[40px] content-start">
                <AnimatePresence>
                    {ingredients.map((ingredient) => (
                        <motion.div
                            key={ingredient}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                            className="inline-flex items-center rounded-full border border-secondary bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-foreground"
                        >
                            {ingredient}
                            <button
                                onClick={() => removeIngredient(ingredient)}
                                className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                <span className="sr-only">Remove {ingredient}</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {ingredients.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        No ingredients added yet. Start typing above!
                    </p>
                )}
            </div>
        </div>
    );
}
