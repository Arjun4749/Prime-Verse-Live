import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest block">
          Support & Sponsorships
        </span>
        <h1 className="text-3xl sm:text-5xl font-black italic text-white uppercase font-mono">
          Get In Touch
        </h1>
      </div>

      <Card className="p-8 space-y-6">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase">Message Delivered</h3>
            <p className="text-xs text-gray-400">Our tournament referee team will respond within 24 hours.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 text-xs"
          >
            <div>
              <label className="block text-gray-300 font-bold mb-1">Your Name / BGMI IGN</label>
              <input
                type="text"
                required
                placeholder="e.g. Jonathan"
                className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="jonathan@esports.in"
                className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Subject / Query Type</label>
              <select className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white">
                <option>Tournament Inquiry</option>
                <option>Result Dispute</option>
                <option>Prize Payout Question</option>
                <option>Sponsorship / Host Tournament</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your question or issue in detail..."
                className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <Button variant="primary" size="md" glow type="submit" className="w-full">
              <Send className="w-4 h-4" /> SEND MESSAGE
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
