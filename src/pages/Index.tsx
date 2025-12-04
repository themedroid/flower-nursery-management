import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
  badge?: string | null;
  stock: number;
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "Все растения", icon: "Flower2" },
    { id: "peonies", name: "Пионы", icon: "Flower" },
    { id: "clematis", name: "Клематисы", icon: "TreeDeciduous" },
    { id: "shrubs", name: "Кустарники", icon: "Trees" },
    { id: "seeds", name: "Семена", icon: "Sprout" },
    { id: "fertilizers", name: "Удобрения", icon: "Droplets" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory === "all" 
          ? "https://functions.poehali.dev/12376e42-ed70-4d76-a79a-63a0d5b0e5c3"
          : `https://functions.poehali.dev/12376e42-ed70-4d76-a79a-63a0d5b0e5c3?category=${selectedCategory}`;
        
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить товары",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, toast]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} добавлен в корзину`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Flower2" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Бал цветов</h1>
                <p className="text-sm text-muted-foreground">Питомник растений с 2006 года</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-6">
              <Link to="/" className="text-foreground hover:text-primary transition font-medium">
                Главная
              </Link>
              <Link to="/blog" className="text-foreground hover:text-primary transition">
                Блог
              </Link>
              <a href="#contacts" className="text-foreground hover:text-primary transition">
                Контакты
              </a>
            </nav>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="tel:+79287662989">
                  <Icon name="Phone" size={20} />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart">
                  <Icon name="ShoppingCart" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-5xl font-bold mb-6 text-foreground">
              Создайте сад вашей мечты
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Выращиваем декоративные растения с любовью в Ростовской области. 
              Пионы, клематисы, княжики, гортензии и многое другое.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="ShoppingBag" size={20} />
                Каталог растений
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={() => document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' })}>
                <Icon name="MapPin" size={20} />
                Как добраться
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 animate-fade-in">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Award" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">С 2006 года</h3>
                <p className="text-sm text-muted-foreground">Опыт выращивания</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Truck" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Доставка</h3>
                <p className="text-sm text-muted-foreground">Почтой России</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Shield" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Гарантия</h3>
                <p className="text-sm text-muted-foreground">Качество растений</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="MessageCircle" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold mb-2">Консультации</h3>
                <p className="text-sm text-muted-foreground">По уходу за растениями</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16" id="catalog">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Наши растения</h2>
          
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
                className="gap-2"
              >
                <Icon name={cat.icon as any} size={18} />
                {cat.name}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={48} />
              <p className="text-muted-foreground">Загружаем растения...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                      <Button size="sm" className="gap-2" onClick={() => handleAddToCart(product)}>
                        <Icon name="ShoppingCart" size={16} />
                        В корзину
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-card" id="contacts">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Контакты и режим работы</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Icon name="MapPin" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-muted-foreground">г. Шахты, Ростовская область<br />переулок Ильича, 80а</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Clock" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Режим работы</p>
                    <p className="text-muted-foreground">Ежедневно с 9:00 до 21:00</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Phone" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <a href="tel:+79287662989" className="text-muted-foreground hover:text-primary transition">
                      +7 (928) 766-29-89
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Mail" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Сайт</p>
                    <a href="http://балцветов.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition">
                      балцветов.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" size="icon" asChild>
                  <a href="http://балцветов.com" target="_blank" rel="noopener noreferrer">
                    <Icon name="Globe" size={20} />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://vk.com/balcvetow" target="_blank" rel="noopener noreferrer">
                    <Icon name="MessageCircle" size={20} />
                  </a>
                </Button>
              </div>
            </div>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Icon name="MapPin" size={64} className="text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
