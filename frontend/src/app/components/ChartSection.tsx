import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';
import { getChartData } from '../../api/predictionApi';

interface ChartSectionProps {
  selectedCoin: string;
  livePrediction?: {
    symbol: string;
    current_price: number;
    predicted_price: number;
    is_mock?: boolean;
  } | null;
}

export function ChartSection({ selectedCoin, livePrediction }: ChartSectionProps) {
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D'>('1H');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchChart = async () => {
      setIsLoading(true);
      try {
        const chartData = await getChartData(selectedCoin);
        if (isMounted) {
            if (chartData && chartData.length > 0) {
                setData(chartData);
            } else {
                setData([]);
            }
        }
      } catch (e) {
        console.error("Failed to fetch chart data", e);
        if (isMounted) setData([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchChart();
    
    return () => { isMounted = false; };
  }, [selectedCoin]);

  const timeframes = [
    { label: '1H', value: '1H' as const },
    { label: '4H', value: '4H' as const },
    { label: '1D', value: '1D' as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3>Price Prediction Analysis</h3>
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeframe === tf.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-border/60'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
        <div className="mb-4">
          <h4 className="text-sm text-muted-foreground mb-2">Market Price vs AI Prediction {isLoading && "(Loading real data...)"}</h4>
        </div>
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
              <XAxis
                dataKey="time"
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorActual)"
                name="Actual Price"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#colorPredicted)"
                name="AI Prediction"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground bg-black/10 rounded-xl border border-dashed border-border/50">
            {isLoading ? 'Loading chart data...' : 'No historical data available for this pair.'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
