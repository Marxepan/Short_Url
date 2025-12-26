import React, { useState } from 'react';
import { Copy, Check, Trash2, ExternalLink, Tag, Activity } from 'lucide-react';
import { ShortenedLink } from '../types';

interface LinkCardProps {
  link: ShortenedLink;
  onDelete: (id: string) => void;
  onVisit: (id: string) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onDelete, onVisit }) => {
  const [copied, setCopied] = useState(false);

  // Generate a functional URL that works in this environment using the ?u= redirector
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${origin}?u=${link.shortCode}`;
  
  // Display version (cleaner)
  const displayUrl = `${window.location.host}/?u=${link.shortCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = () => {
      onVisit(link.id);
      window.open(link.originalUrl, '_blank');
  };

  return (
    <div className="glass-panel p-6 rounded-xl hover:border-primary/30 transition-all group">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        
        {/* Left Side: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/20 uppercase tracking-wider">
              {link.category || 'General'}
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1">
               {new Date(link.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 truncate">
            {displayUrl}
          </h3>
          
          <p className="text-slate-400 text-sm truncate mb-4 font-mono opacity-70">
            {link.originalUrl}
          </p>

          <div className="flex flex-wrap gap-2">
            {link.tags?.map((tag, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full flex items-center gap-1 border border-slate-700">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
             {link.aiSummary && (
                <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-full border border-emerald-800/50 italic">
                    AI: "{link.aiSummary}"
                </span>
             )}
          </div>
        </div>

        {/* Right Side: Actions & Stats */}
        <div className="flex flex-col items-end gap-4 border-l border-slate-700 pl-6 md:w-48 flex-shrink-0">
          
          <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg w-full justify-center">
            <Activity className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-white">{link.clicks}</span>
            <span className="text-xs">clicks</span>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              title="Copy Working Link"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm md:hidden lg:inline">Copy</span>
            </button>
            
            <button
              onClick={handleVisit}
              className="flex items-center justify-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-lg transition-colors border border-primary/20"
              title="Go to original"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm md:hidden lg:inline">Visit</span>
            </button>
          </div>

            <button
              onClick={() => onDelete(link.id)}
              className="flex items-center justify-center gap-1 text-red-400 hover:text-red-300 text-xs mt-auto opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
              Delete Link
            </button>
        </div>
      </div>
    </div>
  );
};

export default LinkCard;