import { Search } from 'lucide-react';

interface CoinSelectorProps {
  selectedCoin: string;
  onCoinChange: (coin: string) => void;
}

const coins = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
];

export function CoinSelector({ selectedCoin, onCoinChange }: CoinSelectorProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <select
        value={selectedCoin}
        onChange={(e) => onCoinChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-foreground appearance-none cursor-pointer hover:border-border/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {coins.map((coin) => (
          <option key={coin.symbol} value={coin.symbol}>
            {coin.symbol} - {coin.name}
          </option>
        ))}
      </select>
    </div>
  );
}
