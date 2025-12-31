import { useState } from 'react';
import { register, login } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Register
            await register({ email, password, name });
            toast.success('Account created successfully!');

            // Auto login
            const data = await login({ email, password });
            setAuth(data.access_token, data.user);
            navigate('/');
        } catch (error: any) {
            toast.error('Registration failed', {
                description: error.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-sm mx-auto p-4 z-[100]">
            <h1 className="text-3xl font-bold mb-6">Create Account</h1>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <Input
                        type="text"
                        placeholder="Full Name (Optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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
                        placeholder="Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Create Account
                </Button>
            </form>
            <p className="mt-4 text-sm text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
        </div>
    );
}
