import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground p-4">
                    <div className="flex flex-col items-center gap-4 text-center max-w-md">
                        <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold">Something went wrong!</h1>
                        <p className="text-muted-foreground">
                            We apologize for the inconvenience. The application has encountered an unexpected error.
                        </p>
                        {this.state.error && (
                            <div className="w-full overflow-auto rounded-md bg-muted p-2 text-xs text-left font-mono">
                                {this.state.error.message}
                            </div>
                        )}
                        <Button onClick={() => window.location.reload()} variant="default">
                            Reload Application
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
