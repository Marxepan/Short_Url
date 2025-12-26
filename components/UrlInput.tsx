import React, { useState } from 'react';
import { Link2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { analyzeUrl } from '../services/geminiService';
import { ShortenedLink } from '../types';

interface UrlInputProps {
  onAddLink: (link: ShortenedLink) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAddLink }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const normalizeUrl = (input: string) => {
    let normalized = input.trim();
    // If it doesn't start with http:// or https://, prepend https://
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Normalize URL (fix prefixes)
    const validUrl = normalizeUrl(url);

    // Basic URL validation after normalization
    try {
      new URL(validUrl);
    } catch (_) {
      setError('Invalid URL format. Example: google.com');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Analyze with Gemini
      const analysis = await analyzeUrl(validUrl);
      
      const newLink: ShortenedLink = {
        id: crypto.randomUUID(),
        originalUrl: validUrl, // Store the normalized working URL
        shortCode: generateShortCode(),
        createdAt: Date.now(),
        clicks: 0,
        tags: analysis.tags,
        aiSummary: analysis.summary,
        category: analysis.category
      };

      onAddLink(newLink);
      setUrl('');
    } catch (err) {
      console.error(err);
      setError('Failed to process link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span>Shorten & Analyze</span>
        </h2>
        <p className="text-slate-400 mb-6">Paste a URL (e.g. google.com) to shorten it and get an AI-powered breakdown.</p>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <Link2 className="absolute left-4 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="google.com/article..."
              className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-36 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-slate-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-medium px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Thinking...</span>
                </>
              ) : (
                <>
                  <span>Shorten</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-3 ml-2 flex items-center gap-1 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UrlInput;