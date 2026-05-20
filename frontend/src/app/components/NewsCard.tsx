import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NewsCardProps {
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  time: string;
}

export function NewsCard({ title, source, sentiment, score, time }: NewsCardProps) {
  const getSentimentIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-500/20 bg-green-500/5';
      case 'negative':
        return 'border-red-500/20 bg-red-500/5';
      default:
        return 'border-yellow-500/20 bg-yellow-500/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${getSentimentColor()} hover:border-opacity-40 transition-all cursor-pointer`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{getSentimentIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-foreground mb-1 line-clamp-2">{title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{source}</span>
            <span>•</span>
            <span>{time}</span>
            <span>•</span>
            <span className={
              sentiment === 'positive' ? 'text-green-500' :
              sentiment === 'negative' ? 'text-red-500' :
              'text-yellow-500'
            }>
              Score: {score}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
