import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const News: React.FC = () => {
  const newsList = dbStore.getNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Platform Updates & Coverage
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          BGMI Esports News
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((item) => (
          <Card key={item.id} className="space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="h-44 -mx-5 -mt-5 mb-2 overflow-hidden rounded-t-xl">
                <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <Badge variant="orange">{item.category}</Badge>
              <h3 className="text-lg font-bold text-white line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{item.summary}</p>
            </div>

            <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-500 font-mono flex justify-between">
              <span>By {item.author}</span>
              <Link to={`/news/${item.slug}`} className="text-orange-400 hover:underline font-bold">
                Read Article &rarr;
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
