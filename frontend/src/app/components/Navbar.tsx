import { TrendingUp, BarChart3, Brain, Newspaper } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-500" />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              CryptoAI Predictor
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#dashboard" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </a>
            <a href="#predictions" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
              <TrendingUp className="h-4 w-4" />
              Predictions
            </a>
            <a href="#market" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
              <BarChart3 className="h-4 w-4" />
              Market Data
            </a>
            <a href="#sentiment" className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
              <Newspaper className="h-4 w-4" />
              Sentiment Analysis
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-green-500">AI Active</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
