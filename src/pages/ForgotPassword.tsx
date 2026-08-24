import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white font-mono">
          Reset Password
        </h1>
        <p className="text-xs text-gray-400">Enter your email to receive a password reset link.</p>
      </div>

      <Card className="p-6 space-y-4">
        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">Reset Link Sent</h3>
            <p className="text-xs text-gray-400">Check your inbox for password recovery instructions.</p>
            <Link to="/login">
              <Button variant="outline" size="sm" className="mt-2">
                Back to Sign In
              </Button>
            </Link>
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
              <label className="block text-gray-300 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="player@esports.in"
                className="w-full bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <Button variant="primary" size="md" glow type="submit" className="w-full">
              SEND RESET LINK
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
