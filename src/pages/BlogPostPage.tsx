import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  created_at: string;
}

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/16e0ac3d-c431-4657-891c-a62e46e11f7d?id=${id}`);
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Статья не найдена</h1>
          <Button asChild>
            <Link to="/blog">Вернуться к блогу</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/blog">
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Назад к блогу
            </Link>
          </Button>

          <div className="bg-card rounded-lg overflow-hidden shadow-lg">
            <div className="aspect-video overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-6 border-b">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={18} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={18} />
                  <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h3 key={index} className="text-2xl font-bold mt-6 mb-4">{paragraph.replace(/\*\*/g, '')}</h3>;
                  }
                  if (paragraph.startsWith('# ')) {
                    return <h2 key={index} className="text-3xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h2>;
                  }
                  if (paragraph.startsWith('- ')) {
                    return <li key={index} className="ml-6 mb-2">{paragraph.replace('- ', '')}</li>;
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return <li key={index} className="ml-6 mb-2">{paragraph.replace(/^\d+\.\s/, '')}</li>;
                  }
                  if (paragraph.trim()) {
                    return <p key={index} className="mb-4 text-lg leading-relaxed">{paragraph}</p>;
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
