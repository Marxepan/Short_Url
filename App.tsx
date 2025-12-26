import React, { useState, useEffect } from 'react';
import { Zap, Github, ShieldCheck, Loader2 } from 'lucide-react';
import UrlInput from './components/UrlInput';
import LinkCard from './components/LinkCard';
import { ShortenedLink } from './types';

const App: React.FC = () => {
  const [links, setLinks] = useState<ShortenedLink[]>([]);
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // 1. Check for redirection query param immediately
    const params = new URLSearchParams(window.location.search);
    const shortCode = params.get('u');

    // 2. Load data
    const savedLinksStr = localStorage.getItem('swiftlink_data');
    let savedLinks: ShortenedLink[] = [];
    if (savedLinksStr) {
      try {
        savedLinks = JSON.parse(savedLinksStr);
        setLinks(savedLinks);
      } catch (e) {
        console.error("Failed to load links", e);
      }
    }
    setMounted(true);

    // 3. Execute redirect if needed
    if (shortCode && savedLinks.length > 0) {
      const target = savedLinks.find(l => l.shortCode === shortCode);
      if (target) {
        setRedirecting(true);
        // Increment click count (optional, but nice)
        const updatedLinks = savedLinks.map(l => 
           l.id === target.id ? { ...l, clicks: l.clicks + 1 } : l
        );
        localStorage.setItem('swiftlink_data', JSON.stringify(updatedLinks));
        
        // Use replace to simulate a redirect
        window.location.replace(target.originalUrl);
        return; 
      }
    }
  }, []);

  // Save links whenever they change (only after initial mount)
  useEffect(() => {
    if (mounted && !redirecting) {
      localStorage.setItem('swiftlink_data', JSON.stringify(links));
    }
  }, [links, mounted, redirecting]);

  const handleAddLink = (newLink: ShortenedLink) => {
    setLinks(prev => [newLink, ...prev]);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const handleVisitLink = (id: string) => {
    setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
    ));
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Redirecting...</h2>
            <p className="text-slate-400">Hold tight.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-primary/30 font-sans pb-20">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[40%] bg-blue-500/10 rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Zap className="text-white w-6 h-6 fill-white" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SwiftLink <span className="text-primary font-light">AI</span></h1>
                <span className="text-xs text-slate-500 font-mono">v1.0.0</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>Secure Storage</span>
             </div>
             <a href="#" className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                <Github className="w-5 h-5" />
             </a>
          </div>
        </header>

        {/* Hero Section & Form */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Make your links <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">Intelligent</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Not just a shortener. SwiftLink uses Gemini AI to categorize and summarize your URLs instantly.
          </p>
        </div>

        <UrlInput onAddLink={handleAddLink} />

        {/* Links List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-semibold text-white">Your History</h2>
            <span className="text-sm text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                {links.length} Links
            </span>
          </div>

          {links.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-2xl border-dashed border-2 border-slate-700">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">No links yet</h3>
              <p className="text-slate-500">Paste a URL above to get started</p>
            </div>
          ) : (
            <div className="grid gap-4 animate-fadeIn">
              {links.map(link => (
                <LinkCard 
                    key={link.id} 
                    link={link} 
                    onDelete={handleDeleteLink} 
                    onVisit={handleVisitLink}
                />
              ))}
            </div>
          )}
        </div>
        
        <footer className="mt-24 py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>Built with React, Tailwind & Google Gemini.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;