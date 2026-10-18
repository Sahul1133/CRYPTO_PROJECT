import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'motion/react';
import { getChartData } from '../../api/predictionApi';

interface ChartSectionProps {
  selectedCoin: string;
  livePrediction?: {
    symbol: string;
    current_price: number;
    predicted_price: number;
    is_mock?: boolean;
    trend?: string;
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
        const intervalParam = timeframe.toLowerCase();
        const chartData = await getChartData(selectedCoin, intervalParam);
        if (isMounted) {
          if (chartData && Array.isArray(chartData) && chartData.length > 0) {
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
  }, [selectedCoin, timeframe]);

  const timeframes = [
    { label: '1H', value: '1H' as const },
    { label: '4H', value: '4H' as const },
    { label: '1D', value: '1D' as const },
  ];

  const formatPrice = (val: number) => {
    if (val === undefined || val === null || isNaN(val)) return '$0';
    if (val < 0.0001) return `$${val.toFixed(8)}`;
    if (val < 0.01) return `$${val.toFixed(6)}`;
    if (val < 1) return `$${val.toFixed(4)}`;
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Price Prediction Trajectory</h3>
          <p className="text-sm text-muted-foreground">Historical Binance price action with AI forecasted next-interval target</p>
        </div>
        <div className="flex gap-2 bg-card/60 p-1.5 rounded-xl border border-border/50 backdrop-blur-md">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeframe === tf.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
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
        className="p-6 md:p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <div>
            <h4 className="text-base font-semibold text-foreground">
              {selectedCoin} Market vs AI Forecast
            </h4>
            <span className="text-xs text-muted-foreground">
              {isLoading ? "Fetching live market candles..." : `Showing ${timeframe} candles from Binance`}
            </span>
          </div>
          {livePrediction && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
              <span>Next Forecast: {formatPrice(livePrediction.predicted_price)}</span>
            </div>
          )}
        </div>

        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
              <XAxis
                dataKey="time"
                stroke="#888"
                style={{ fontSize: '12px' }}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                stroke="#888"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => formatPrice(value)}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 24, 39, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)'
                }}
                formatter={(value: any, name: string) => [
                  value !== null && value !== undefined ? formatPrice(Number(value)) : 'Forecasting...',
                  name === 'actual' ? 'Actual Price' : 'AI Prediction'
                ]}
              />
              <Legend verticalAlign="top" height={36} />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorActual)"
                name="Actual Price"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#a855f7"
                strokeWidth={2.5}
                fill="url(#colorPredicted)"
                name="AI Prediction"
                strokeDasharray="4 4"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground bg-black/10 rounded-2xl border border-dashed border-border/50">
            {isLoading ? 'Syncing real market candles from Binance...' : 'No historical data available for this pair.'}
          </div>
        )}
      </motion.div>
    </div>
  );
}
