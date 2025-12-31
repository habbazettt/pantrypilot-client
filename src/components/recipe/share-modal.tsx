import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Facebook, Twitter, Download, CheckCircle2, Share2, Loader2, Image as ImageIcon } from "lucide-react"
import { useState } from "react"
import type { RecipeResponseDto } from "@/types/recipe"
import { useMutation } from "@tanstack/react-query"
import { generateShareLink } from "@/services/recipe"
import { toast } from "sonner"

interface ShareModalProps {
    recipe: RecipeResponseDto
    isOpen: boolean
    onClose: () => void
}

export function ShareModal({ recipe, isOpen, onClose }: ShareModalProps) {
    const [copied, setCopied] = useState(false)
    const [generatingImage, setGeneratingImage] = useState(false)

    const mutation = useMutation({
        mutationFn: () => generateShareLink(recipe.id),
    })

    const handleCopy = () => {
        if (mutation.data?.shareUrl) {
            navigator.clipboard.writeText(mutation.data.shareUrl)
            setCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleGenerateLink = () => {
        mutation.mutate()
    }

    // Generate link automatically when modal opens if not already generated
    if (isOpen && !mutation.data && !mutation.isPending && !mutation.isError) {
        handleGenerateLink();
    }

    const handleDownloadImage = async () => {
        // We need to render the card hidden or use the id of the detail view if visible
        // For simplicity and quality, we'll suggest using the backend OG image or use basic window print for now
        // BUT the user asked for "Generate recipe card image".
        // Let's implement a hidden HTML structure to capture.
        if (generatingImage) return

        setGeneratingImage(true)
        try {
            // Find the recipe detail content which might be visible behind the modal OR create a temporary hidden one
            // Ideally we'd capture the existing view, but it might be obscured.
            // Let's rely on the OG Image from backend for now as it's cleaner and server-generated

            if (mutation.data?.ogImageUrl) {
                const link = document.createElement('a');
                link.href = mutation.data.ogImageUrl;
                link.download = `${recipe.title.replace(/\s+/g, '-').toLowerCase()}-card.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success("Image downloading...");
            } else {
                toast.error("Image generation not ready yet");
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate image")
        } finally {
            setGeneratingImage(false)
        }
    }

    const shareUrl = mutation.data?.shareUrl || ""
    const shareText = `Check out this recipe for ${recipe.title} on PantryPilot! 🍳`

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md glass-card border-white/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Share2 className="h-5 w-5 text-primary" />
                        Share Recipe
                    </DialogTitle>
                    <DialogDescription>
                        Share <span className="font-semibold text-foreground">{recipe.title}</span> with your friends and family.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Link Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Recipe Link</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    readOnly
                                    value={mutation.isPending ? "Generating link..." : shareUrl}
                                    className="pr-10 bg-background/50 font-mono text-sm"
                                />
                                {mutation.isPending && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <Button size="icon" variant="outline" onClick={handleCopy} disabled={!shareUrl}>
                                {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full gap-2 hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/50" disabled={!shareUrl}
                            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                        >
                            <Twitter className="h-4 w-4" /> Twitter
                        </Button>
                        <Button variant="outline" className="w-full gap-2 hover:bg-blue-700/10 hover:text-blue-700 hover:border-blue-700/50" disabled={!shareUrl}
                            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                        >
                            <Facebook className="h-4 w-4" /> Facebook
                        </Button>
                        <Button variant="outline" className="w-full gap-2 hover:bg-green-600/10 hover:text-green-600 hover:border-green-600/50" disabled={!shareUrl}
                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')}
                        >
                            <div className="h-4 w-4 relative flex items-center justify-center font-bold">W</div> WhatsApp
                        </Button>
                        <Button variant="outline" className="w-full gap-2 hover:bg-pink-600/10 hover:text-pink-600 hover:border-pink-600/50" disabled={!mutation.data?.ogImageUrl}
                            onClick={handleDownloadImage}
                        >
                            <ImageIcon className="h-4 w-4" /> {generatingImage ? "Downloading..." : "Image Card"}
                        </Button>
                    </div>

                    {/* Preview OG Image (Optional) */}
                    {mutation.data?.ogImageUrl && (
                        <div className="rounded-xl overflow-hidden border border-border/50 relative group cursor-pointer" onClick={handleDownloadImage}>
                            <img src={mutation.data.ogImageUrl} alt="Recipe Preview" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium flex items-center gap-1"><Download className="h-3 w-3" /> Download</span>
                            </div>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    )
}
