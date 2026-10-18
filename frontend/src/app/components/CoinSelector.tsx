import { Search } from 'lucide-react';

export interface CoinOption {
  symbol: string;
  name?: string;
  current_price?: number;
}

interface CoinSelectorProps {
  selectedCoin: string;
  onCoinChange: (coin: string) => void;
  coins?: CoinOption[];
}

const DEFAULT_COINS: CoinOption[] = [
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

export function CoinSelector({ selectedCoin, onCoinChange, coins }: CoinSelectorProps) {
  // Merge prop coins with default coins, ensuring no duplicates
  const coinMap = new Map<string, CoinOption>();
  
  DEFAULT_COINS.forEach(c => coinMap.set(c.symbol, c));
  if (coins && coins.length > 0) {
    coins.forEach(c => {
      if (c.symbol) coinMap.set(c.symbol, c);
    });
  }

  // Ensure selectedCoin is present
  if (!coinMap.has(selectedCoin)) {
    coinMap.set(selectedCoin, {
      symbol: selectedCoin,
      name: selectedCoin.replace('USDT', '')
    });
  }

  const allAvailableCoins = Array.from(coinMap.values());

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <select
        value={selectedCoin}
        onChange={(e) => onCoinChange(e.target.value)}
        className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-card/80 backdrop-blur-md border border-border text-foreground appearance-none cursor-pointer hover:border-blue-500/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm font-medium shadow-sm"
      >
        {allAvailableCoins.map((coin) => (
          <option key={coin.symbol} value={coin.symbol} className="bg-background text-foreground py-1">
            {coin.symbol} {coin.name ? `— ${coin.name}` : ''}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
        ▼
      </div>
    </div>
  );
}
