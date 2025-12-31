import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"
import { useHealthCheck } from "@/hooks/useHealth"
import { Loader2, CheckCircle2, XCircle, ChevronRight, ArrowLeft, Sparkles, AlertCircle, LogOut, User as UserIcon, Search } from "lucide-react"
import { TagInput } from "@/components/ui/tag-input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  generateRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes,
  getAlternatives,
  getCuisines
} from "@/services/recipe"
import { RecipeCard } from "@/components/recipe/recipe-card"
import { RecipeCardSkeleton } from "@/components/recipe/recipe-skeletons"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { LoginPage } from "@/pages/auth/LoginPage"
import { RegisterPage } from "@/pages/auth/RegisterPage"
import { useAuthStore } from "@/store/authStore"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { SavedRecipesSheet } from "@/components/recipe/saved-recipes-sheet"
import { SearchView } from "@/components/recipe/search-view"
import { PublicRecipePage } from "@/pages/public/PublicRecipePage"
import { ProfilePage } from "@/pages/profile/ProfilePage"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { PageTransition } from "@/components/layout/page-transition"

const queryClient = new QueryClient()

function BackendStatus() {
  const { isLoading, isError } = useHealthCheck()

  if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Connecting...</div>
  if (isError) return <div className="flex items-center gap-2 text-destructive"><XCircle className="h-4 w-4" /> Backend Offline</div>

  return (
    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
      <CheckCircle2 className="h-4 w-4" />
      <span className="text-sm font-medium">System Online</span>
    </div>
  )
}

function UserMenu() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
        <Button size="sm" onClick={() => navigate('/register')}>Register</Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full">
          <UserIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{user.name || user.email.split('@')[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <UserIcon className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Dashboard() {
  const [started, setStarted] = useState(false)
  const [ingredients, setIngredients] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string[]>([])
  const [preferences, setPreferences] = useState<string[]>([])
  const [maxTime, setMaxTime] = useState<number[]>([60])
  const [difficulty, setDifficulty] = useState<string>("any")
  const [cuisine, setCuisine] = useState<string>("any")
  const [activeTab, setActiveTab] = useState("recommended")

  const queryClient = useQueryClient();
  const { data: cuisines } = useQuery({ queryKey: ['cuisines'], queryFn: getCuisines });

  const generateMutation = useMutation({
    mutationFn: (data: { ingredients: string[], preferences: string[], allergies: string[], maxTime: number, difficulty: string, cuisine: string }) =>
      generateRecipes({
        ingredients: data.ingredients,
        preferences: data.preferences,
        allergies: data.allergies,
        maxTime: data.maxTime,
        difficulty: data.difficulty === "any" ? undefined : data.difficulty as any,
        cuisine: data.cuisine === "any" ? undefined : data.cuisine
      }),
    onSuccess: (data) => {
      if (data.cached) {
        toast.info("Loaded from cache", { description: "Found similar recipe request in our database." })
      }
    },
    onError: (err) => {
      toast.error("Generation Failed", { description: err.message })
    }
  })

  // Fetch alternatives only when tab is active and ingredients exist
  const { data: alternativesData, isLoading: isLoadingAlternatives } = useQuery({
    queryKey: ['alternatives', ingredients, allergies, preferences],
    queryFn: () => getAlternatives({
      ingredients: ingredients.join(','),
      allergies: allergies.join(','),
      preferences: preferences.join(',')
    }),
    enabled: activeTab === 'alternatives' && ingredients.length > 0 && !!generateMutation.data,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

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
      // Invalidate both lists
      queryClient.invalidateQueries({ queryKey: ['saved-recipes'] });
      const action = variables.isSaved ? "Removed from" : "Added to";
      toast.success(`${action} Cookbook`);
    },
    onError: (err) => {
      toast.error("Action failed", { description: (err as any).response?.data?.message || err.message })
    }
  });

  const handleGenerate = () => {
    if (ingredients.length > 0) {
      generateMutation.mutate({
        ingredients,
        allergies,
        preferences,
        maxTime: maxTime[0],
        difficulty,
        cuisine
      })
    }
  }

  const handleBack = () => {
    generateMutation.reset()
    setActiveTab("recommended")
  }

  const handleSaveToggle = (id: string, isSaved: boolean) => {
    saveMutation.mutate({ id, isSaved });
  }

  const { data: savedRecipes } = useQuery({ queryKey: ['saved-recipes'], queryFn: getSavedRecipes });
  const savedIds = new Set(savedRecipes?.map(r => r.id));

  if (!started) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4 relative z-10 animate-in fade-in zoom-in duration-500">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" /> AI-Powered V1.0
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Pantry<span className="text-primary">Pilot</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Transform your leftover ingredients into culinary masterpieces.
            Smart recipes, zero waste.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" onClick={() => setStarted(true)} className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
              Start Cooking <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 hover:bg-secondary/50">
              How it Works
            </Button>
          </motion.div>
        </motion.div>
        <OnboardingDialog />
      </main>
    )
  }

  return (
    <main className="container max-w-5xl mx-auto p-4 md:p-8 min-h-[90vh] flex flex-col">
      <div className="flex flex-col flex-grow">

        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" size="sm" className="-ml-4 hover:bg-transparent hover:text-primary" onClick={() => !generateMutation.data ? setStarted(false) : handleBack()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {generateMutation.data ? "New Search" : "Back Home"}
          </Button>

          {!generateMutation.data && <h2 className="text-2xl font-bold tracking-tight">Recipe Configuration</h2>}
        </div>

        <AnimatePresence mode="wait">
          {!generateMutation.data ? (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center flex-grow max-w-3xl mx-auto w-full"
            >
              <div className="w-full glass rounded-3xl p-6 md:p-10 shadow-2xl grid md:grid-cols-2 gap-8 relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                {/* Ingredients & Filters Form */}
                <div className="col-span-2 md:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><div className="h-6 w-1 bg-primary rounded-full" /> Ingredients</h3>
                    <p className="text-sm text-muted-foreground mb-4">What's in your pantry?</p>
                    <TagInput
                      tags={ingredients}
                      onChange={setIngredients}
                      placeholder="Add ingredient..."
                      emptyMessage="Start by adding ingredients like chicken, rice, eggs..."
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Dietary Restrictions</h3>
                    <p className="text-sm text-muted-foreground mb-2">Any allergies?</p>
                    <TagInput
                      tags={allergies}
                      onChange={setAllergies}
                      placeholder="Add allergy (e.g. peanuts)..."
                      emptyMessage="No allergies specified."
                    />
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-4">Customize your meal.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Cooking Time</label>
                        <div className="flex items-center gap-4">
                          <Slider
                            value={maxTime}
                            onValueChange={setMaxTime}
                            max={180}
                            step={5}
                            className="flex-1"
                          />
                          <span className="text-sm font-mono w-16 text-right">{maxTime[0]}m</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Difficulty</label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any Difficulty</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Cuisine Style</label>
                        <Select value={cuisine} onValueChange={setCuisine}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cuisine" />
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
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Other Preferences</label>
                        <TagInput
                          tags={preferences}
                          onChange={setPreferences}
                          placeholder="e.g. Low Carb, Keto..."
                          emptyMessage="No specific preferences."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 pt-4">
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                    onClick={handleGenerate}
                    disabled={ingredients.length === 0 || generateMutation.isPending}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chef is thinking...
                      </>
                    ) : (
                      <>
                        Generate Custom Recipes <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>

                {generateMutation.isError && (
                  <div className="col-span-2 flex items-center justify-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{(generateMutation.error as Error).message}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{activeTab === 'recommended' ? 'Your Custom Menu' : activeTab === 'alternatives' ? 'Smart Substitutes' : 'Explore Recipes'}</h3>
                    {activeTab !== 'search' && (
                      <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline">{ingredients.length} ingredients</Badge>
                        {difficulty !== "any" && <Badge variant="outline">{difficulty}</Badge>}
                        <Badge variant="outline">Max {maxTime[0]}m</Badge>
                      </div>
                    )}
                  </div>
                  <TabsList>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                    <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                    <TabsTrigger value="search" className="gap-2"><Search className="h-4 w-4" /> Explore</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="recommended" className="mt-0">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {generateMutation.data.recipes.map((recipe, idx) => (
                      <RecipeCard
                        key={recipe.id || idx}
                        recipe={recipe}
                        index={idx}
                        isSaved={savedIds.has(recipe.id)}
                        onSave={handleSaveToggle}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="alternatives" className="mt-0">
                  {isLoadingAlternatives ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <RecipeCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {alternativesData?.flatMap(group => group.recipes).map((recipe, idx) => (
                        <RecipeCard
                          key={recipe.id || `alt-${idx}`}
                          recipe={recipe}
                          index={idx}
                          isSaved={savedIds.has(recipe.id)}
                          onSave={handleSaveToggle}
                        />
                      ))}
                      {(!alternativesData || alternativesData.length === 0) && (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          <p>No specific alternatives found. Try adjusting your preferences.</p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="search" className="mt-0">
                  <SearchView />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <OnboardingDialog />
    </main>
  )
}

function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center h-full text-center p-4 relative z-10 animate-in fade-in zoom-in duration-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" /> AI-Powered V1.0
        </div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          Pantry<span className="text-primary">Pilot</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
          Transform your leftover ingredients into culinary masterpieces.
          Smart recipes, zero waste.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button size="lg" onClick={() => navigate('/login')} className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
            Start Cooking <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 hover:bg-secondary/50">
            How it Works
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden relative selection:bg-primary/30">
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:cursor-pointer" onClick={() => navigate('/')}>
          PantryPilot
        </div>
        <div className="flex items-center gap-4">
          <BackendStatus />
          {user && <SavedRecipesSheet />}
          <UserMenu />
          <ModeToggle />
        </div>
      </header>

      <div className="h-20" /> {/* Spacer for fixed header */}

      {children}

      {/* Background Ambient Effects - FALLBACK if Aurora is not used or needed here */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-[50vw] h-[50vw] bg-accent/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/3 w-[50vw] h-[50vw] bg-pink-500/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />
      </div>
    </div>
  )
}

function HomePage() {
  const { user } = useAuthStore();

  // If logged in, show Dashboard. Otherwise, show Landing Page.
  if (user) {
    return <Dashboard />;
  }

  return (
    <AuroraBackground className="h-[calc(100vh-5rem)]">
      <LandingPage />
    </AuroraBackground>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <AuroraBackground className="h-[calc(100vh-5rem)]">
              <LoginPage />
            </AuroraBackground>
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <AuroraBackground className="h-[calc(100vh-5rem)]">
              <RegisterPage />
            </AuroraBackground>
          </PageTransition>
        } />
        <Route path="/r/:shareId" element={
          <PageTransition>
            <PublicRecipePage />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <ProfilePage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

import { ErrorBoundary } from "@/components/ui/error-boundary"
import { OnboardingDialog } from "@/components/onboarding-dialog"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Layout>
            <AppContent />
          </Layout>
          <Toaster position="top-center" />
        </ErrorBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App