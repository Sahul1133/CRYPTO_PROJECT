import { Brain, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                CryptoAI Predictor
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered cryptocurrency prediction platform using LSTM neural networks and real-time market data.
            </p>
          </div>

          <div>
            <h4 className="mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>LSTM Neural Networks</li>
              <li>Binance Market Data</li>
              <li>Sentiment Analysis</li>
              <li>Technical Indicators</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4">Project</h4>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CryptoAI Predictor. Built with React, TailwindCSS, and LSTM.</p>
        </div>
      </div>
    </footer>
  );
}
