import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Swords } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
      <AlertCircle className="w-16 h-16 text-orange-500 mx-auto animate-bounce" />
      <h1 className="text-4xl font-black italic uppercase text-white font-mono">404 - Zone Lost</h1>
      <p className="text-xs text-gray-400">
        You are outside the safe zone. The requested page or match room could not be found.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" glow>
          <Swords className="w-4 h-4" /> Return to Arena Home
        </Button>
      </Link>
    </div>
  );
};
