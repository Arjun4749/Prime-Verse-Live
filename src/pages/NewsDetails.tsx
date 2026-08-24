import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Newspaper, Calendar, User } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const NewsDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = dbStore.getNewsBySlug(slug || '');

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link to="/news">
        <Button variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Button>
      </Link>

      <Card className="p-8 space-y-6">
        <div className="space-y-3">
          <Badge variant="orange">{article.category}</Badge>
          <h1 className="text-3xl font-black text-white">{article.title}</h1>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <img src={article.cover_image} alt={article.title} className="w-full h-80 object-cover rounded-2xl border border-gray-800" />

        <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed space-y-4">
          {article.content}
        </div>
      </Card>
    </div>
  );
};
