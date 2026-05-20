import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface Coin {
  symbol: string;
  name?: string;
}

interface CoinSearchProps {
  coins: Coin[];
  onSelect: (symbol: string) => void;
}

export const CoinSearch: React.FC<CoinSearchProps> = ({ coins, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredCoins = coins.filter(coin => {
    if (!query) return true;
    const q = query.toLowerCase();
    return coin.symbol.toLowerCase().includes(q) || (coin.name && coin.name.toLowerCase().includes(q));
  }).slice(0, 8); // Limit suggestions to 8

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md z-[100]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search over 400+ coins (e.g., BTC, ETH)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/80 backdrop-blur-md text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-lg text-lg"
        />
      </div>

      {isOpen && query && (
        <div className="absolute w-full mt-2 py-2 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-[100]">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => {
                  onSelect(coin.symbol);
                  setQuery(coin.symbol);
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-blue-500/20 hover:text-blue-400 transition-colors flex items-center justify-between group border-b border-border/10 last:border-0"
              >
                <span className="font-bold text-lg">{coin.symbol}</span>
                {coin.name && <span className="text-sm text-muted-foreground group-hover:text-blue-400/80">{coin.name}</span>}
              </button>
            ))
          ) : (
             <div className="px-5 py-4 text-muted-foreground text-center">
               No coins found matching "{query}"
             </div>
          )}
        </div>
      )}
    </div>
  );
};
