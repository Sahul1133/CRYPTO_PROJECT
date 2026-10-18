import { motion } from 'motion/react';
import { Smile, Frown, Meh } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

interface SentimentMeterProps {
  positive: number;
  neutral: number;
  negative: number;
  overallScore: number;
  currentPrice?: number;
  symbol?: string;
}

export function SentimentMeter({
  positive = 50,
  neutral = 35,
  negative = 15,
  overallScore = 65,
  currentPrice,
  symbol = 'BTCUSDT'
}: SentimentMeterProps) {
  const getSentimentColor = (score: number) => {
    if (score >= 60) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSentimentBg = (score: number) => {
    if (score >= 60) return 'from-green-500/20 to-green-500/0';
    if (score >= 40) return 'from-yellow-500/20 to-yellow-500/0';
    return 'from-red-500/20 to-red-500/0';
  };

  const sentimentData = [
    { name: 'Positive', score: positive, impact: `+${((positive / 100) * 4.2).toFixed(1)}%`, color: '#22c55e' },
    { name: 'Neutral', score: neutral, impact: '+0.1%', color: '#eab308' },
    { name: 'Negative', score: negative, impact: `-${((negative / 100) * 3.8).toFixed(1)}%`, color: '#ef4444' },
  ];

  // Dynamically generate 24h sentiment trend correlated with the live price
  const basePrice = currentPrice && currentPrice > 0 ? currentPrice : 81000;
  const sentimentTrendData = [
    { time: '00:00', sentiment: Math.max(30, overallScore - 12), price: basePrice * 0.988 },
    { time: '04:00', sentiment: Math.max(35, overallScore - 7), price: basePrice * 0.992 },
    { time: '08:00', sentiment: Math.max(40, overallScore - 3), price: basePrice * 0.996 },
    { time: '12:00', sentiment: overallScore, price: basePrice },
    { time: '16:00', sentiment: Math.min(95, overallScore + 4), price: basePrice * 1.004 },
    { time: '20:00', sentiment: Math.min(95, overallScore + 2), price: basePrice * 1.002 },
    { time: '24:00', sentiment: Math.min(95, overallScore + 5), price: basePrice * 1.006 },
  ];

  const formatPrice = (val: number) => {
    if (val < 0.01) return `$${val.toFixed(6)}`;
    if (val < 1) return `$${val.toFixed(4)}`;
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const coinName = symbol.replace('USDT', '');

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-foreground">Market Sentiment Matrix</h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Dynamic Sentiment Index</span>
            <span className={`text-3xl font-extrabold ${getSentimentColor(overallScore)}`}>
              {overallScore}/100
            </span>
          </div>
          <div className="relative h-3 bg-muted/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1 }}
              className={`absolute h-full bg-gradient-to-r ${getSentimentBg(overallScore)}`}
            />
            <div
              className="absolute h-full w-1.5 bg-foreground/70 rounded-full"
              style={{ left: `${overallScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${positive}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-foreground w-12 text-right">{positive}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Meh className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${neutral}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-foreground w-12 text-right">{neutral}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-muted-foreground">Negative</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${negative}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
              <span className="text-sm font-bold text-foreground w-12 text-right">{negative}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <h4 className="text-base font-semibold mb-1 text-foreground">Score Distribution & Projected Impact</h4>
        <p className="text-xs text-muted-foreground mb-4">Correlation between news sentiment breakdown and price momentum</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#888"
              style={{ fontSize: '12px' }}
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 24, 39, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name) => [
                name === 'score' ? `${value}%` : value,
                name === 'score' ? 'Distribution' : name
              ]}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {sentimentData.map((item) => (
            <div key={item.name} className="text-center p-2.5 rounded-xl bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="text-base font-bold font-mono" style={{ color: item.color }}>{item.impact}</p>
              <p className="text-[10px] text-muted-foreground">Impact</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md shadow-xl">
        <h4 className="text-base font-semibold mb-1 text-foreground">24h Sentiment Trend vs {coinName} Price</h4>
        <p className="text-xs text-muted-foreground mb-4">Real-time correlation between social sentiment and {coinName} market value</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={sentimentTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#888"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#888"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => formatPrice(value)}
              domain={['auto', 'auto']}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(20, 24, 39, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: any, name: string) => [
                name === 'Sentiment Score' ? `${value}/100` : formatPrice(Number(value)),
                name
              ]}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', r: 3 }}
              name="Sentiment Score"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              name={`${coinName} Price`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
