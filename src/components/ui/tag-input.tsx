import { useState, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    className?: string;
    maxTags?: number;
    placeholder?: string;
    emptyMessage?: string;
    description?: string;
}

export function TagInput({
    tags,
    onChange,
    className,
    maxTags = 10,
    placeholder = "Add a tag...",
    emptyMessage = "No tags added yet.",
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
            onChange([...tags, trimmed]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((t) => t !== tagToRemove));
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
                        placeholder={placeholder}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={tags.length >= maxTags}
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        {tags.length}/{maxTags}
                    </span>
                </div>
                <Button onClick={handleAdd} disabled={!inputValue.trim() || tags.length >= maxTags} variant="secondary" size="sm">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[32px] content-start">
                <AnimatePresence>
                    {tags.map((tag) => (
                        <motion.div
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                            className="inline-flex items-center rounded-full border border-secondary bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors hover:bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {tag}
                            <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                <span className="sr-only">Remove {tag}</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {tags.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">
                        {emptyMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
