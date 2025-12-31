import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Search, Heart, Share2 } from "lucide-react"
import { useAuthStore } from "@/store/authStore"

export function OnboardingDialog() {
    const [open, setOpen] = useState(false)
    const { user } = useAuthStore()

    useEffect(() => {
        // Show only if user is logged in and hasn't seen it yet
        if (user) {
            const hasSeen = localStorage.getItem("pantrypilot-onboarding-seen")
            if (!hasSeen) {
                // Small delay to not overwhelm
                const timer = setTimeout(() => setOpen(true), 1500)
                return () => clearTimeout(timer)
            }
        }
    }, [user])

    const handleClose = () => {
        setOpen(false)
        localStorage.setItem("pantrypilot-onboarding-seen", "true")
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Sparkles className="h-5 w-5 text-primary" /> Welcome to PantryPilot!
                    </DialogTitle>
                    <DialogDescription>
                        Your AI-powered sous chef is ready. Here's how to get started:
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Search className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Find Recipes</h4>
                            <p className="text-sm text-muted-foreground">Enter ingredients you have to generate custom recipes instantly.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Heart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Save Favorites</h4>
                            <p className="text-sm text-muted-foreground">Keep your best discoveries in your personalized cookbook.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Share2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Share with Friends</h4>
                            <p className="text-sm text-muted-foreground">Share your cooking adventures with a simple link.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClose} className="w-full">Let's Cook!</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
