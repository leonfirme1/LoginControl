import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Redirect } from "wouter";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type LoginFormData = {
  name: string;
  password: string;
  remember?: boolean;
};

type RegisterFormData = {
  name: string;
  password: string;
  confirmPassword: string;
};

export default function AuthPage() {
  console.log('AuthPage renderizando...');
  const { user, loginMutation, registerMutation } = useAuth();
  console.log('User:', user, 'LoginMutation disponível:', !!loginMutation);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<LoginFormData>({
    defaultValues: {
      name: "",
      password: "",
      remember: false,
    },
  });

  const registerForm = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    console.log('=== LOGIN SUBMIT ===');
    console.log('Dados recebidos:', data);
    console.log('Estado da mutation:', loginMutation.isPending);
    console.log('Erros do formulário:', loginForm.formState.errors);
    console.log('Form válido:', loginForm.formState.isValid);
    
    // Verificar se os dados estão corretos antes de enviar
    if (!data.name || !data.password) {
      console.error('Dados incompletos:', data);
      return;
    }
    
    console.log('Enviando mutation...');
    loginMutation.mutate({
      name: data.name,
      password: data.password,
    });
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      name: data.name,
      password: data.password,
    });
  };

  // Redirect if already logged in
  if (user) {
    console.log('Redirecionando usuário logado:', user);
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Forms */}
        <div className="w-full max-w-md mx-auto">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Controle de Horas</h1>
            <p className="text-slate-600 mt-2">Faça login para acessar o sistema</p>
          </div>

          {/* Forms */}
          <Card className="shadow-xl">
            <CardHeader className="space-y-1">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <CardTitle>Entrar na sua conta</CardTitle>
                    <CardDescription>
                      Digite suas credenciais para acessar o sistema
                    </CardDescription>
                  </div>
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuário</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Digite seu usuário" 
                                {...field} 
                                className="py-3"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Digite sua senha" 
                                  {...field} 
                                  className="py-3 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="remember"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal">
                                  Lembrar-me
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <Button variant="link" className="px-0 font-normal text-sm">
                          Esqueceu a senha?
                        </Button>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full py-3"
                        disabled={loginMutation.isPending}
                        onClick={(e) => {
                          console.log('Botão Entrar clicado!');
                          console.log('Event:', e);
                        }}
                      >
                        {loginMutation.isPending ? "Entrando..." : "Entrar"}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="outline"
                        className="w-full py-2 text-sm"
                        onClick={() => {
                          console.log('Teste direto - forçando login');
                          const formData = {
                            name: loginForm.getValues('name') || '1',
                            password: loginForm.getValues('password') || '1'
                          };
                          onLoginSubmit(formData);
                        }}
                      >
                        🔧 Teste Direto
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-2">
                    <CardTitle>Criar uma conta</CardTitle>
                    <CardDescription>
                      Preencha os dados para criar sua conta
                    </CardDescription>
                  </div>
                  
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usuário</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Digite seu usuário" 
                                {...field} 
                                className="py-3"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Digite sua senha" 
                                  {...field} 
                                  className="py-3 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Senha</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirme sua senha" 
                                  {...field} 
                                  className="py-3 pr-12"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full py-3"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Criando conta..." : "Criar conta"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-slate-500">
              © 2024 Controle de Horas. Todos os direitos reservados.
            </p>
          </div>
        </div>

        {/* Right Column - Hero Section */}
        <div className="hidden lg:block">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-2xl mb-6">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Gerencie seu tempo com eficiência
              </h2>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                Uma plataforma completa para controle de horas, projetos e produtividade. 
                Organize seu trabalho e aumente sua eficiência.
              </p>
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto pt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-slate-600">Controle de tempo preciso</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-slate-600">Relatórios detalhados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-slate-600">Interface intuitiva</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
