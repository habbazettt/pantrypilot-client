import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { login } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = await login({ email, password });
            setAuth(data.access_token, data.user);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error: any) {
            toast.error('Login failed', {
                description: error.response?.data?.message || 'Invalid credentials'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto p-4 z-[100]">
            <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Sign In
                </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
                Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
            </p>
        </div>
    );
}
