import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdminPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [productBadge, setProductBadge] = useState("");
  const [productStock, setProductStock] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postPublished, setPostPublished] = useState(false);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const productData = {
        name: productName,
        category: productCategory,
        price: parseInt(productPrice),
        description: productDescription,
        image_url: productImageUrl || '/placeholder.svg',
        badge: productBadge || null,
        stock: parseInt(productStock) || 0
      };

      const response = await fetch("https://functions.poehali.dev/12376e42-ed70-4d76-a79a-63a0d5b0e5c3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        toast({
          title: "Товар добавлен",
          description: "Товар успешно добавлен в каталог"
        });
        setProductName("");
        setProductCategory("");
        setProductPrice("");
        setProductDescription("");
        setProductImageUrl("");
        setProductBadge("");
        setProductStock("");
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const postData = {
        title: postTitle,
        content: postContent,
        excerpt: postExcerpt,
        image_url: postImageUrl || '/placeholder.svg',
        published: postPublished
      };

      const response = await fetch("https://functions.poehali.dev/16e0ac3d-c431-4657-891c-a62e46e11f7d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        toast({
          title: "Пост добавлен",
          description: postPublished ? "Пост опубликован в блоге" : "Пост сохранён как черновик"
        });
        setPostTitle("");
        setPostContent("");
        setPostExcerpt("");
        setPostImageUrl("");
        setPostPublished(false);
      } else {
        throw new Error("Failed to add post");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить пост",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Админ-панель</h1>
            <Icon name="ShieldCheck" size={40} className="text-primary" />
          </div>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Товары</TabsTrigger>
              <TabsTrigger value="blog">Блог</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить товар</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">Название *</Label>
                      <Input 
                        id="product-name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-category">Категория *</Label>
                      <Select value={productCategory} onValueChange={setProductCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peonies">Пионы</SelectItem>
                          <SelectItem value="clematis">Клематисы</SelectItem>
                          <SelectItem value="shrubs">Кустарники</SelectItem>
                          <SelectItem value="seeds">Семена</SelectItem>
                          <SelectItem value="fertilizers">Удобрения</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="product-price">Цена (₽) *</Label>
                        <Input 
                          id="product-price"
                          type="number"
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-stock">Количество</Label>
                        <Input 
                          id="product-stock"
                          type="number"
                          value={productStock}
                          onChange={(e) => setProductStock(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="product-description">Описание</Label>
                      <Textarea 
                        id="product-description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-image">URL изображения</Label>
                      <Input 
                        id="product-image"
                        value={productImageUrl}
                        onChange={(e) => setProductImageUrl(e.target.value)}
                        placeholder="/placeholder.svg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="product-badge">Бейдж (Хит, Новинка и т.д.)</Label>
                      <Input 
                        id="product-badge"
                        value={productBadge}
                        onChange={(e) => setProductBadge(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Добавление..." : "Добавить товар"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blog">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить пост в блог</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPost} className="space-y-4">
                    <div>
                      <Label htmlFor="post-title">Заголовок *</Label>
                      <Input 
                        id="post-title"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="post-excerpt">Краткое описание *</Label>
                      <Textarea 
                        id="post-excerpt"
                        value={postExcerpt}
                        onChange={(e) => setPostExcerpt(e.target.value)}
                        rows={2}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="post-content">Содержание *</Label>
                      <Textarea 
                        id="post-content"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        rows={10}
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Используйте ** для выделения заголовков, - для списков
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="post-image">URL изображения</Label>
                      <Input 
                        id="post-image"
                        value={postImageUrl}
                        onChange={(e) => setPostImageUrl(e.target.value)}
                        placeholder="/placeholder.svg"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="post-published"
                        checked={postPublished}
                        onCheckedChange={setPostPublished}
                      />
                      <Label htmlFor="post-published">Опубликовать сразу</Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Добавление..." : "Добавить пост"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
