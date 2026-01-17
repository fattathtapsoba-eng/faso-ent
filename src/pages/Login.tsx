import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { login } from '../services/api/mockApi';
import { School, Loader2 } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await login({ phone, password });

            // Store user and token
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);

            // Redirect based on role
            if (response.user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (response.user.role === 'TEACHER') {
                navigate('/teacher/grade-entry');
            } else if (response.user.role === 'PARENT') {
                navigate('/parent/dashboard');
            } else if (response.user.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Numéro ou mot de passe incorrect');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
                        <School className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Faso-ENT</h1>
                    <p className="text-sm text-gray-600">Environnement Numérique de Travail</p>
                </div>

                {/* Login Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Connexion</CardTitle>
                        <CardDescription>Entrez vos identifiants pour continuer</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Numéro de téléphone
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+226 70 12 34 56"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Connexion...
                                    </>
                                ) : (
                                    'Se connecter'
                                )}
                            </Button>

                            {/* Demo credentials hint */}
                            <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
                                <p>Demo Admin: +22670123456 / password</p>
                                <p>Demo Prof: +22676543210 / password</p>
                                <p>Demo Parent: +22678901234 / password</p>
                                <p>Demo Élève: +22678901236 / password</p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
