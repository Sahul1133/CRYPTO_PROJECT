import { TrendingUp, TrendingDown, Activity, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface PredictionCardProps {
  symbol: string;
  name: string;
  currentPrice: number;
  nextHourPrediction: number;
  nextDayPrediction: number;
  trend: 'bullish' | 'bearish';
  confidence: number;
  isLive?: boolean;
}

export function PredictionCard({
  symbol,
  name,
  currentPrice,
  nextHourPrediction,
  nextDayPrediction,
  trend,
  confidence,
  isLive
}: PredictionCardProps) {
  const hourChange = ((nextHourPrediction - currentPrice) / currentPrice) * 100;
  const dayChange = ((nextDayPrediction - currentPrice) / currentPrice) * 100;

  const isBullish = trend === 'bullish';
  const colorClass = isBullish ? 'from-green-500/20 to-emerald-500/5' : 'from-red-500/20 to-rose-500/5';
  const borderColor = isBullish ? 'border-green-500/20' : 'border-red-500/20';
  const iconColor = isBullish ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`relative group p-[1px] rounded-3xl bg-gradient-to-br from-border/50 via-border/10 to-transparent overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className={`relative h-full bg-card/60 backdrop-blur-xl rounded-[23px] p-5 border border-white/5 ${borderColor} flex flex-col gap-4 z-10`}>
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2">
              {symbol}
              {isBullish ? <TrendingUp className={`h-4 w-4 ${iconColor}`} /> : <TrendingDown className={`h-4 w-4 ${iconColor}`} />}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">{name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground font-medium">Price</div>
            <div className="text-xl font-bold font-mono text-foreground tracking-tight">
              ${currentPrice < 1 ? currentPrice.toFixed(4) : currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {/* 1 Hour */}
          <div className="bg-background/40 rounded-xl p-3 border border-border/40 hover:border-border/80 transition-colors">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              1H Forecast
            </div>
            <div className="font-mono font-semibold text-sm mb-1 text-foreground">
              ${nextHourPrediction < 1 ? nextHourPrediction.toFixed(4) : nextHourPrediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-bold ${hourChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {hourChange >= 0 ? '+' : ''}{hourChange.toFixed(2)}%
            </div>
          </div>

          {/* 1 Day */}
          <div className="bg-background/40 rounded-xl p-3 border border-border/40 hover:border-border/80 transition-colors">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mb-1.5">
              <Activity className="h-3.5 w-3.5 text-purple-400" />
              24H Forecast
            </div>
            <div className="font-mono font-semibold text-sm mb-1 text-foreground">
              ${nextDayPrediction < 1 ? nextDayPrediction.toFixed(4) : nextDayPrediction.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs font-bold ${dayChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-4 border-t border-border/30 flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <Zap className="h-3.5 w-3.5 text-yellow-400" />
            AI Confidence
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="font-bold text-foreground">{confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
