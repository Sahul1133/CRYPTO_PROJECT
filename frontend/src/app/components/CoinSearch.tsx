import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

export interface CoinItem {
  symbol: string;
  name?: string;
  price?: number;
  current_price?: number;
  currentPrice?: number;
}

interface CoinSearchProps {
  coins: CoinItem[];
  onSelect: (symbol: string) => void;
}

const DEFAULT_POPULAR_COINS: CoinItem[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'XRPUSDT', name: 'XRP' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'AVAXUSDT', name: 'Avalanche' },
  { symbol: 'SUIUSDT', name: 'Sui' },
  { symbol: 'SHIBUSDT', name: 'Shiba Inu' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'LINKUSDT', name: 'Chainlink' },
  { symbol: 'PEPEUSDT', name: 'Pepe' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol' },
  { symbol: 'UNIUSDT', name: 'Uniswap' },
  { symbol: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'APTUSDT', name: 'Aptos' },
  { symbol: 'ICPUSDT', name: 'Internet Computer' },
  { symbol: 'TRXUSDT', name: 'TRON' },
  { symbol: 'FETUSDT', name: 'ASI Alliance' },
  { symbol: 'RENDERUSDT', name: 'Render' },
  { symbol: 'TAOUSDT', name: 'Bittensor' },
  { symbol: 'ATOMUSDT', name: 'Cosmos' },
  { symbol: 'XLMUSDT', name: 'Stellar' },
  { symbol: 'BCHUSDT', name: 'Bitcoin Cash' },
  { symbol: 'FILUSDT', name: 'Filecoin' },
  { symbol: 'INJUSDT', name: 'Injective' },
  { symbol: 'KASUSDT', name: 'Kaspa' },
  { symbol: 'OPUSDT', name: 'Optimism' },
  { symbol: 'ARBUSDT', name: 'Arbitrum' },
  { symbol: 'MATICUSDT', name: 'Polygon' },
  { symbol: 'POLUSDT', name: 'Polygon (POL)' },
  { symbol: 'AAVEUSDT', name: 'Aave' },
  { symbol: 'FTMUSDT', name: 'Fantom' },
  { symbol: 'RUNEUSDT', name: 'THORChain' },
  { symbol: 'TIAUSDT', name: 'Celestia' },
  { symbol: 'SEIUSDT', name: 'Sei' },
  { symbol: 'HBARUSDT', name: 'Hedera' },
  { symbol: 'VETUSDT', name: 'VeChain' },
  { symbol: 'ALGOUSDT', name: 'Algorand' },
  { symbol: 'FLOKIUSDT', name: 'Floki' },
  { symbol: 'BONKUSDT', name: 'Bonk' },
  { symbol: 'WIFUSDT', name: 'dogwifhat' },
  { symbol: 'JUPUSDT', name: 'Jupiter' },
  { symbol: 'ENAUSDT', name: 'Ethena' },
  { symbol: 'ONDOUSDT', name: 'Ondo' },
];

export const CoinSearch: React.FC<CoinSearchProps> = ({ coins, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Combine live coins with defaults to guarantee rich instant search
  const coinMap = new Map<string, CoinItem>();
  DEFAULT_POPULAR_COINS.forEach(c => coinMap.set(c.symbol, c));
  if (coins && coins.length > 0) {
    coins.forEach(c => {
      if (c.symbol) {
        const existing = coinMap.get(c.symbol);
        coinMap.set(c.symbol, { ...existing, ...c });
      }
    });
  }
  const allCoins = Array.from(coinMap.values());

  const filteredCoins = allCoins.filter(coin => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    const symbolClean = coin.symbol.toLowerCase();
    const baseClean = coin.symbol.toLowerCase().replace('usdt', '');
    const nameClean = (coin.name || '').toLowerCase();
    return symbolClean.includes(q) || baseClean.includes(q) || nameClean.includes(q);
  }).slice(0, 12); // Show top 12 matches

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCoin = (symbol: string) => {
    onSelect(symbol);
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (filteredCoins.length > 0) {
        handleSelectCoin(filteredCoins[0].symbol);
      } else if (query.trim()) {
        const customSymbol = query.trim().toUpperCase().endsWith('USDT') 
          ? query.trim().toUpperCase() 
          : `${query.trim().toUpperCase()}USDT`;
        handleSelectCoin(customSymbol);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-[100]">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search 400+ coins (e.g. BTC, Solana, Doge)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-border/60 bg-background/90 backdrop-blur-xl text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-xl text-base transition-all placeholder:text-muted-foreground/70"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && query.trim() && (
        <div className="absolute w-full mt-2 py-2 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.6)] overflow-hidden z-[100] max-h-[380px] overflow-y-auto">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => {
              const price = coin.price ?? coin.current_price ?? coin.currentPrice;
              return (
                <button
                  key={coin.symbol}
                  onClick={() => handleSelectCoin(coin.symbol)}
                  className="w-full text-left px-5 py-3 hover:bg-blue-500/15 hover:text-blue-400 transition-colors flex items-center justify-between group border-b border-border/10 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-bold text-base text-foreground group-hover:text-blue-400">
                        {coin.symbol}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {coin.name || coin.symbol.replace('USDT', '')}
                      </div>
                    </div>
                  </div>
                  {price !== undefined && price > 0 && (
                    <div className="font-mono text-sm font-semibold text-foreground/90">
                      ${price < 1 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">No coins found matching "{query}"</p>
              <button
                onClick={() => {
                  const custom = query.trim().toUpperCase().endsWith('USDT')
                    ? query.trim().toUpperCase()
                    : `${query.trim().toUpperCase()}USDT`;
                  handleSelectCoin(custom);
                }}
                className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
              >
                Search {query.trim().toUpperCase()} on Binance →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
