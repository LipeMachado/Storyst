import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage: React.FC = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Carregando dashboard...</p>
            </div>
        );
    }

    // Se não autenticado ou sem dados de usuário (o que pode acontecer se o token for inválido)
    // ProtectedRoute já redireciona para /login, então esse bloco pode ser mais um fallback ou para exibir uma mensagem específica.
    if (!isAuthenticated || !user) {
        // Redirecionamento já ocorre no ProtectedRoute, mas se quiser uma mensagem aqui
        // antes do redirecionamento acontecer, ou para um caso de erro improvável.
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
                <p className="text-xl text-red-500 mb-4">Acesso negado. Por favor, faça login.</p>
                <Button onClick={() => logout()}>Ir para Login</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
            <h1 className="text-4xl font-bold text-green-700 mb-8">
                Bem-vindo ao Dashboard, {user.name}!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Vendas Hoje</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">R$ 1.500,00</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Clientes Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">120</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Meta Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">85%</p>
                    </CardContent>
                </Card>
            </div>
            <Button className="mt-10" onClick={() => alert('Gerenciar Vendas!')}>
                Gerenciar Vendas
            </Button>
            <Button variant="destructive" className="mt-4" onClick={logout}>
                Sair
            </Button>
        </div>
    );
};

export default DashboardPage;