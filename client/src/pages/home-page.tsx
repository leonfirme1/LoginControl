import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-primary mr-3" />
                <h1 className="text-xl font-bold text-slate-900">Controle de Horas</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Olá, {user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {logoutMutation.isPending ? "Saindo..." : "Sair"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h2>
          <p className="text-slate-600">Bem-vindo ao sistema de controle de horas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Horas Hoje</CardTitle>
              <CardDescription>Tempo trabalhado hoje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h 00min</div>
              <p className="text-xs text-slate-600 mt-1">Inicie o cronômetro para começar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Esta Semana</CardTitle>
              <CardDescription>Total de horas esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h 00min</div>
              <p className="text-xs text-slate-600 mt-1">De segunda a hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Este Mês</CardTitle>
              <CardDescription>Total de horas este mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h 00min</div>
              <p className="text-xs text-slate-600 mt-1">Desde o início do mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Cronômetro</CardTitle>
              <CardDescription>Controle seu tempo de trabalho</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold text-slate-900">
                  00:00:00
                </div>
                <div className="space-x-4">
                  <Button size="lg">Iniciar</Button>
                  <Button size="lg" variant="outline">Pausar</Button>
                  <Button size="lg" variant="outline">Parar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
