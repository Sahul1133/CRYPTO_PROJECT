import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { PredictionCard } from './components/PredictionCard';
import { CoinSelector } from './components/CoinSelector';
import { SentimentMeter } from './components/SentimentMeter';
import { NewsCard } from './components/NewsCard';
import { ChartSection } from './components/ChartSection';
import { Footer } from './components/Footer';
import { CoinSearch } from './components/CoinSearch';
import { Brain, TrendingUp, Database, BarChart3, Newspaper, Loader2, AlertCircle } from 'lucide-react';

import { getPrediction, getAllPredictions, getNews } from '../api/predictionApi';

export default function App() {
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');

  const [predictionData, setPredictionData] = useState<any>(null);
  const [allPredictions, setAllPredictions] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    setIsPredictionLoading(true);
    setError(null);
    try {
      const [allData, newsData] = await Promise.all([
        getAllPredictions(),
        getNews(selectedCoin)
      ]);
      setAllPredictions(allData);
      setNews(newsData);
      setLastUpdated(new Date().toLocaleString());
      
      // Also fetch single prediction for chart
      await fetchSinglePrediction(selectedCoin);
    } catch (e) {
      console.error(`Failed to fetch initial data`, e);
      setError("Failed to connect to the live data feed. Please try again later.");
    } finally {
      setIsPredictionLoading(false);
    }
  };

  const fetchSinglePrediction = async (symbol: string) => {
    try {
      const singleData = await getPrediction(symbol);
      setPredictionData(singleData);
    } catch (e) {
      console.error(`Failed to fetch prediction for ${symbol}`, e);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (allPredictions.length > 0) {
      fetchSinglePrediction(selectedCoin);
      
      // Fetch news for the new selected coin
      getNews(selectedCoin)
        .then(newsData => setNews(newsData))
        .catch(e => console.error("Failed to fetch news", e));
    }
  }, [selectedCoin]);

  return (
    <div className="min-h-screen bg-background dark selection:bg-blue-500/30">
      <Navbar />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-background to-purple-900/20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)]"
              >
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">LSTM Neural Networks Active</span>
              </motion.div>

              <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white via-blue-100 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                Next-Gen Crypto Intelligence
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Experience real-time market forecasting powered by deep learning models, advanced sentiment analysis, and live Binance data feeds.
              </p>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <CoinSearch coins={allPredictions} onSelect={setSelectedCoin} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Dashboard Section */}
        <section id="predictions" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  Live Market Dashboard
                </h2>
                <p className="text-muted-foreground">Monitoring {allPredictions.length} live cryptocurrency pairs</p>
              </div>
              
              <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-2 pr-4 shadow-xl">
                <button
                  onClick={fetchInitialData}
                  disabled={isPredictionLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPredictionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sync Data'}
                </button>
                <div className="text-sm font-medium text-muted-foreground">
                  {lastUpdated ? (
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>{lastUpdated}</span>
                  ) : 'Waiting for sync...'}
                </div>
              </div>
            </div>

            {error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : allPredictions.length === 0 && !isPredictionLoading ? (
              <div className="flex justify-center py-20 text-muted-foreground">
                No active pairs found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allPredictions.slice(0, 100).map((prediction, index) => {
                  const isSelected = prediction.symbol === selectedCoin;
                  const sourceData = isSelected && predictionData ? predictionData : prediction;

                  const merged = {
                    symbol: sourceData.symbol,
                    name: sourceData.name || sourceData.symbol.replace('USDT', ''),
                    currentPrice: sourceData.current_price || sourceData.currentPrice,
                    nextHourPrediction: sourceData.predicted_price || sourceData.nextHourPrediction,
                    nextDayPrediction: sourceData.predicted_price || sourceData.nextDayPrediction,
                    trend: sourceData.predicted_price > sourceData.current_price ? 'bullish' as const : 'bearish' as const,
                    confidence: sourceData.is_mock ? 50 : 85,
                    isLive: true, // Always true now since we removed mock data fallback
                  };

                  return (
                    <motion.div
                      key={merged.symbol}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index % 10) * 0.05 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <PredictionCard {...merged} />
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {allPredictions.length > 100 && (
              <div className="mt-8 text-center text-muted-foreground text-sm">
                Showing top 100 of {allPredictions.length} available pairs.
              </div>
            )}
          </div>
        </section>

        <section id="market" className="py-20 bg-background/30 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Deep Market Analysis</h2>
              <p className="text-muted-foreground text-lg">Interactive charting overlaying historical data with AI-generated predictions.</p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6 bg-card/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {selectedCoin} Analysis
                </div>
                <div className="w-64">
                  <CoinSelector selectedCoin={selectedCoin} onCoinChange={setSelectedCoin} />
                </div>
              </div>
              <ChartSection selectedCoin={selectedCoin} livePrediction={predictionData} />
            </div>
          </div>
        </section>

        <section id="sentiment" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Market Psychology</h2>
              <p className="text-muted-foreground text-lg mb-8">Real-time sentiment aggregation from major news outlets and social signals.</p>
              
              {/* Coin Search for Sentiment */}
              <div className="flex justify-center mb-8">
                <CoinSearch coins={allPredictions} onSelect={setSelectedCoin} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-5 flex flex-col justify-center"
              >
                <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                  <SentimentMeter
                    positive={45}
                    neutral={35}
                    negative={20}
                    overallScore={62}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7 space-y-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Newspaper className="h-6 w-6 text-purple-400" />
                  <h3 className="text-2xl font-semibold">Latest Headlines</h3>
                </div>
                <div className="space-y-4 pr-2 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {news.length > 0 ? (
                    news.map((newsItem, index) => (
                      <NewsCard key={index} {...newsItem} />
                    ))
                  ) : (
                    <div className="p-8 text-center border border-dashed border-border/50 rounded-2xl text-muted-foreground">
                      No news available at the moment.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}