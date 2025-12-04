import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useState } from "react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = [
    {
      id: 1,
      name: "Пион Пинк Гавайи Корал",
      category: "peonies",
      price: 1300,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg",
      description: "Роскошный коралово-розовый пион"
    },
    {
      id: 2,
      name: "Пион Команд Перфект",
      category: "peonies",
      price: 1400,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg",
      description: "Идеальный махровый пион"
    },
    {
      id: 3,
      name: "Пион Сара Бернард",
      category: "peonies",
      price: 1000,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg",
      description: "Классический розовый пион"
    },
    {
      id: 4,
      name: "Пион Бартзелло",
      category: "peonies",
      price: 1600,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/fb7027ca-486a-422a-bff6-5eb6269fd939.jpg",
      description: "Редкий жёлтый пион",
      badge: "Хит"
    },
    {
      id: 5,
      name: "Клематис фиолетовый",
      category: "clematis",
      price: 800,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/464f7346-294d-460e-abe8-38d79ca5af8c.jpg",
      description: "Изящная лиана с крупными цветами"
    },
    {
      id: 6,
      name: "Клематис белый",
      category: "clematis",
      price: 850,
      image: "https://cdn.poehali.dev/projects/54141480-31af-45b9-beb9-cf8a6914c160/files/464f7346-294d-460e-abe8-38d79ca5af8c.jpg",
      description: "Элегантный белоснежный сорт"
    },
    {
      id: 7,
      name: "Семена гибискуса",
      category: "seeds",
      price: 250,
      image: "/placeholder.svg",
      description: "Американская селекция"
    },
    {
      id: 8,
      name: "Удобрение для цветов",
      category: "fertilizers",
      price: 350,
      image: "/placeholder.svg",
      description: "Органическое, 1 кг"
    }
  ];

  const categories = [
    { id: "all", name: "Все растения", icon: "Flower2" },
    { id: "peonies", name: "Пионы", icon: "Flower" },
    { id: "clematis", name: "Клематисы", icon: "TreeDeciduous" },
    { id: "seeds", name: "Семена", icon: "Sprout" },
    { id: "fertilizers", name: "Удобрения", icon: "Droplets" }
  ];

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="Phone" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="ShoppingCart" size={20} />
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
              <Button size="lg" className="gap-2">
                <Icon name="ShoppingBag" size={20} />
                Каталог растений
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
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

      <section className="py-16">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={product.image} 
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
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{product.price} ₽</span>
                    <Button size="sm" className="gap-2">
                      <Icon name="ShoppingCart" size={16} />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
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
                    <p className="text-muted-foreground">+7 (928) 766-29-89</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Mail" className="text-primary flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@балцветов.com</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" size="icon">
                  <Icon name="Globe" size={20} />
                </Button>
                <Button variant="outline" size="icon">
                  <Icon name="MessageCircle" size={20} />
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

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2006-2025 Питомник растений «Бал цветов»</p>
          <p className="text-sm opacity-90">Создаём сады с любовью</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
