import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await register(email, password, fullName);
      toast({
        title: "Регистрация успешна!",
        description: referralCode 
          ? "Вы получите бонус за регистрацию по реферальной ссылке" 
          : "Добро пожаловать в Бал цветов"
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Попробуйте другой email",
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
          <CardTitle className="text-3xl">Регистрация</CardTitle>
          <p className="text-muted-foreground">Создайте аккаунт в Бал цветов</p>
          {referralCode && (
            <div className="mt-2 text-sm text-primary font-medium">
              🎁 Регистрация по реферальной ссылке
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Имя и фамилия</Label>
              <Input 
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

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
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">Минимум 6 символов</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Войти
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

export default RegisterPage;
