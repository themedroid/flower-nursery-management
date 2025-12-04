import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from "@/components/ui/icon";
import { useCart } from "@/lib/cart-context";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone) {
      toast({
        title: "Ошибка",
        description: "Заполните имя и телефон",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        total_amount: totalAmount,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch("https://functions.poehali.dev/89b03535-3b08-457d-b83b-5befc8028447", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Заказ оформлен!",
          description: `Номер вашего заказа: ${result.order_id}. Мы свяжемся с вами в ближайшее время.`,
        });
        clearCart();
        navigate("/");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось оформить заказ. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <Icon name="ShoppingCart" size={64} className="mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
          <p className="text-muted-foreground mb-8">Добавьте растения в корзину, чтобы оформить заказ</p>
          <Button size="lg" asChild>
            <Link to="/">
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Вернуться к каталогу
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Корзина</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <Card key={item.id}>
              <CardContent className="p-4 flex gap-4">
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-xl font-bold text-primary mb-2">{item.price} ₽</p>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold mb-2">{item.price * item.quantity} ₽</p>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Оформление заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя *</Label>
                  <Input 
                    id="name" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Способ получения</Label>
                  <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Самовывоз</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Доставка почтой</Label>
                    </div>
                  </RadioGroup>
                </div>

                {deliveryMethod === "delivery" && (
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Textarea 
                      id="address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Label>Способ оплаты</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Наличные при получении</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Картой при получении</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Итого:</span>
                    <span>{totalAmount} ₽</span>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Оформление..." : "Оформить заказ"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
