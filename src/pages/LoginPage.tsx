import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать!"
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Flower2" className="text-primary-foreground" size={32} />
          </div>
          <CardTitle className="text-3xl">Вход в систему</CardTitle>
          <p className="text-muted-foreground">Бал цветов — Личный кабинет</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Зарегистрироваться
              </Link>
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <Icon name="ArrowLeft" size={14} />
              На главную
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
