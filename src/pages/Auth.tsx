import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { BrandButton } from "@/components/ui/brand-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { sessionManager } from "@/lib/session";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!validateEmail(loginForm.email)) {
        toast({
          title: "Error de validación",
          description: "Por favor ingresa un email válido",
          variant: "destructive",
        });
        return;
      }

      if (!loginForm.password) {
        toast({
          title: "Error de validación",
          description: "La contraseña es obligatoria",
          variant: "destructive",
        });
        return;
      }

      // Simulación de login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar credenciales (simulado)
      const storedUser = localStorage.getItem('user_' + loginForm.email);
      if (!storedUser) {
        toast({
          title: "Credenciales inválidas",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        });
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.password !== loginForm.password) {
        toast({
          title: "Credenciales inválidas",
          description: "Email o contraseña incorrectos",
          variant: "destructive",
        });
        return;
      }

      // Crear sesión usando sessionManager
      sessionManager.createSession(loginForm.email, user.name);

      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión correctamente",
      });

      navigate("/analysis");
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!registerForm.name.trim()) {
        toast({
          title: "Error de validación",
          description: "El nombre es obligatorio",
          variant: "destructive",
        });
        return;
      }

      if (!validateEmail(registerForm.email)) {
        toast({
          title: "Error de validación",
          description: "Por favor ingresa un email válido",
          variant: "destructive",
        });
        return;
      }

      if (registerForm.password.length < 8) {
        toast({
          title: "Error de validación",
          description: "La contraseña debe tener al menos 8 caracteres",
          variant: "destructive",
        });
        return;
      }

      // Simulación de registro
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verificar si el usuario ya existe
      const existingUser = localStorage.getItem('user_' + registerForm.email);
      if (existingUser) {
        toast({
          title: "Usuario ya existe",
          description: "Ya existe una cuenta con este email. ¿Quieres iniciar sesión?",
          variant: "destructive",
        });
        return;
      }

      // Guardar usuario
      localStorage.setItem('user_' + registerForm.email, JSON.stringify({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        createdAt: Date.now()
      }));

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      });

      // Limpiar formulario y cambiar a login
      setRegisterForm({ name: "", email: "", password: "" });
      
      // Auto-llenar el formulario de login
      setLoginForm({ email: registerForm.email, password: "" });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 py-12 px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-brand">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-brand-primary">
              PYME Credit AI
            </CardTitle>
            <CardDescription>
              Accede a tu plataforma de evaluación financiera
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <BrandButton 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </BrandButton>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <BrandButton 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                  </BrandButton>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;