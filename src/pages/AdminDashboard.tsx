import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  total_products: number;
  total_customers: number;
  orders_last_month: number;
  revenue_last_month: number;
}

interface Customer {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  status: string;
  last_order_date: string | null;
}

interface ProductStats {
  name: string;
  category: string;
  times_ordered: number;
  total_quantity: number;
  total_revenue: number;
}

const AdminDashboard = () => {
  const { user, token, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [productStats, setProductStats] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: "Доступ запрещён",
        description: "У вас нет прав администратора",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, customersRes, productsRes] = await Promise.all([
          fetch('https://functions.poehali.dev/2dbb4d37-50d4-4ae3-b44d-b3bbdc2a7dfc?path=dashboard', {
            headers: { 'X-Auth-Token': token || '' }
          }),
          fetch('https://functions.poehali.dev/2dbb4d37-50d4-4ae3-b44d-b3bbdc2a7dfc?path=customers', {
            headers: { 'X-Auth-Token': token || '' }
          }),
          fetch('https://functions.poehali.dev/2dbb4d37-50d4-4ae3-b44d-b3bbdc2a7dfc?path=products/stats', {
            headers: { 'X-Auth-Token': token || '' }
          })
        ]);

        const [statsData, customersData, productsData] = await Promise.all([
          statsRes.json(),
          customersRes.json(),
          productsRes.json()
        ]);

        setStats(statsData);
        setCustomers(customersData);
        setProductStats(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить данные",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin, token, navigate, toast]);

  const handleExportPriceList = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/2dbb4d37-50d4-4ae3-b44d-b3bbdc2a7dfc?path=export&format=csv');
      const csv = await response.text();
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `pricelist_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast({
        title: "Прайс-лист экспортирован",
        description: "Файл успешно скачан"
      });
    } catch (error) {
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать прайс-лист",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Панель управления</h1>
            <p className="text-muted-foreground">Добро пожаловать, {user?.full_name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <Icon name="Plus" className="mr-2" size={18} />
                Добавить товар/пост
              </Link>
            </Button>
            <Button variant="outline" onClick={handleExportPriceList}>
              <Icon name="FileDown" className="mr-2" size={18} />
              Экспорт прайс-листа
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Всего заказов</CardTitle>
              <Icon name="ShoppingCart" className="text-muted-foreground" size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_orders || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.orders_last_month || 0} за месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
              <Icon name="TrendingUp" className="text-muted-foreground" size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_revenue.toLocaleString() || 0} ₽</div>
              <p className="text-xs text-muted-foreground">
                +{stats?.revenue_last_month.toLocaleString() || 0} ₽ за месяц
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Клиентов</CardTitle>
              <Icon name="Users" className="text-muted-foreground" size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_customers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Активных пользователей
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Средний чек</CardTitle>
              <Icon name="DollarSign" className="text-muted-foreground" size={18} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avg_order_value.toLocaleString() || 0} ₽</div>
              <p className="text-xs text-muted-foreground">
                На заказ
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="customers">Клиенты CRM</TabsTrigger>
            <TabsTrigger value="products">Популярные товары</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>База клиентов</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead className="text-right">Заказов</TableHead>
                      <TableHead className="text-right">Потрачено</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.full_name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell className="text-right">{customer.total_orders}</TableCell>
                        <TableCell className="text-right">{customer.total_spent.toLocaleString()} ₽</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            customer.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Топ продаж</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Товар</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead className="text-right">Заказов</TableHead>
                      <TableHead className="text-right">Продано шт.</TableHead>
                      <TableHead className="text-right">Выручка</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productStats.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{product.times_ordered}</TableCell>
                        <TableCell className="text-right">{product.total_quantity}</TableCell>
                        <TableCell className="text-right">{product.total_revenue.toLocaleString()} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
