import { motion } from 'motion/react';
import { Smile, Frown, Meh } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';

interface SentimentMeterProps {
  positive: number;
  neutral: number;
  negative: number;
  overallScore: number;
}

export function SentimentMeter({ positive, neutral, negative, overallScore }: SentimentMeterProps) {
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
    { name: 'Positive', score: positive, impact: '+2.3%', color: '#22c55e' },
    { name: 'Neutral', score: neutral, impact: '+0.1%', color: '#eab308' },
    { name: 'Negative', score: negative, impact: '-1.8%', color: '#ef4444' },
  ];

  const sentimentTrendData = [
    { time: '00:00', sentiment: 45, price: 68000 },
    { time: '04:00', sentiment: 52, price: 68200 },
    { time: '08:00', sentiment: 58, price: 68350 },
    { time: '12:00', sentiment: 62, price: 68420 },
    { time: '16:00', sentiment: 65, price: 68550 },
    { time: '20:00', sentiment: 62, price: 68500 },
    { time: '24:00', sentiment: 68, price: 68680 },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border bg-card backdrop-blur-sm">
        <h3 className="mb-6">Market Sentiment Analysis</h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Overall Sentiment Score</span>
            <span className={`text-2xl ${getSentimentColor(overallScore)}`}>
              {overallScore}
            </span>
          </div>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1 }}
              className={`absolute h-full bg-gradient-to-r ${getSentimentBg(overallScore)}`}
            />
            <div
              className="absolute h-full w-1 bg-foreground/50"
              style={{ left: `${overallScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Positive</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${positive}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{positive}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Meh className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Neutral</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${neutral}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{neutral}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="h-5 w-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Negative</span>
            </div>
            <div className="flex items-center gap-3 flex-1 ml-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${negative}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
              <span className="text-sm text-foreground w-12 text-right">{negative}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card backdrop-blur-sm">
        <h4 className="mb-2">Sentiment Score Distribution & Price Impact</h4>
        <p className="text-sm text-muted-foreground mb-6">Correlation between sentiment categories and predicted price movement</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sentimentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: '12px' }}
              label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', style: { fill: '#666' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value, name, props) => {
                if (name === 'score') {
                  return [`${value}%`, 'Score'];
                }
                return [value, name];
              }}
              labelFormatter={(label) => {
                const item = sentimentData.find(d => d.name === label);
                return `${label} - Impact: ${item?.impact}`;
              }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {sentimentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {sentimentData.map((item) => (
            <div key={item.name} className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">{item.name}</p>
              <p className="text-lg" style={{ color: item.color }}>{item.impact}</p>
              <p className="text-xs text-muted-foreground">Price Impact</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-xl border border-border bg-card backdrop-blur-sm">
        <h4 className="mb-2">24h Sentiment Trend vs Price Movement</h4>
        <p className="text-sm text-muted-foreground mb-6">Real-time correlation between sentiment score and market price</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sentimentTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis
              dataKey="time"
              stroke="#666"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#666"
              style={{ fontSize: '12px' }}
              label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', style: { fill: '#666' } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#666"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              label={{ value: 'Price', angle: 90, position: 'insideRight', style: { fill: '#666' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Sentiment Score') {
                  return [value, name];
                }
                return [`$${value.toLocaleString()}`, name];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: '#a855f7', r: 4 }}
              name="Sentiment Score"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              name="BTC Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
