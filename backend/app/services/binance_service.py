import time
import requests
import pandas as pd
from binance.client import Client

# In-memory cache for tickers and pairs to prevent rate-limiting and timeouts
_cache = {
    "all_tickers": None,
    "all_tickers_time": 0,
    "top_tickers": None,
    "top_tickers_time": 0,
    "exchange_symbols": None,
    "exchange_symbols_time": 0,
    "klines": {}
}

CACHE_TTL = 15  # seconds

# List of endpoints: data-api.binance.vision is unblocked globally on AWS/Vercel
TICKER_24HR_URLS = [
    "https://data-api.binance.vision/api/v3/ticker/24hr",
    "https://api.binance.us/api/v3/ticker/24hr",
    "https://api1.binance.com/api/v3/ticker/24hr",
    "https://api.binance.com/api/v3/ticker/24hr"
]

KLINES_URLS = [
    "https://data-api.binance.vision/api/v3/klines",
    "https://api.binance.us/api/v3/klines",
    "https://api1.binance.com/api/v3/klines",
    "https://api.binance.com/api/v3/klines"
]

PRICE_URLS = [
    "https://data-api.binance.vision/api/v3/ticker/price",
    "https://api.binance.us/api/v3/ticker/price",
    "https://api1.binance.com/api/v3/ticker/price",
    "https://api.binance.com/api/v3/ticker/price"
]

def get_all_tickers():
    now = time.time()
    if _cache["all_tickers"] and (now - _cache["all_tickers_time"] < CACHE_TTL):
        return _cache["all_tickers"]

    for url in PRICE_URLS:
        try:
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                tickers = res.json()
                ticker_dict = {t['symbol']: float(t['price']) for t in tickers}
                _cache["all_tickers"] = ticker_dict
                _cache["all_tickers_time"] = now
                return ticker_dict
        except Exception as e:
            continue

    return _cache["all_tickers"] or {}

def get_top_usdt_tickers(limit=100):
    now = time.time()
    if _cache["top_tickers"] and (now - _cache["top_tickers_time"] < CACHE_TTL):
        return _cache["top_tickers"][:limit]

    excluded_suffixes = ('UPUSDT', 'DOWNUSDT', 'BULLUSDT', 'BEARUSDT')
    
    for url in TICKER_24HR_URLS:
        try:
            res = requests.get(url, timeout=4)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list) and len(data) > 0:
                    usdt_tickers = [
                        d for d in data
                        if d.get('symbol', '').endswith('USDT')
                        and not any(d['symbol'].endswith(ex) for ex in excluded_suffixes)
                        and float(d.get('quoteVolume', 0)) > 50000
                    ]
                    usdt_tickers.sort(key=lambda x: float(x.get('quoteVolume', 0)), reverse=True)
                    if usdt_tickers:
                        _cache["top_tickers"] = usdt_tickers
                        _cache["top_tickers_time"] = now
                        return usdt_tickers[:limit]
        except Exception as e:
            continue

    return _cache["top_tickers"][:limit] if _cache["top_tickers"] else []

def get_usdt_pairs(limit=None):
    now = time.time()
    if _cache["exchange_symbols"] and (now - _cache["exchange_symbols_time"] < 300):
        pairs = _cache["exchange_symbols"]
        return pairs[:limit] if limit else pairs

    top = get_top_usdt_tickers(limit=limit or 200)
    if top:
        symbols = [t['symbol'] for t in top]
        _cache["exchange_symbols"] = symbols
        _cache["exchange_symbols_time"] = now
        return symbols[:limit] if limit else symbols

    return ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT"]

def get_historical_data(symbol, interval="1h", start_str="5 days ago", limit=120):
    cache_key = f"{symbol}_{interval}_{limit}"
    now = time.time()
    if cache_key in _cache["klines"]:
        cached_df, timestamp = _cache["klines"][cache_key]
        if now - timestamp < 20:  # 20 second cache for klines
            return cached_df.copy()

    params = {"symbol": symbol, "interval": interval, "limit": limit}
    
    for url in KLINES_URLS:
        try:
            res = requests.get(url, params=params, timeout=4)
            if res.status_code == 200:
                klines = res.json()
                if klines and len(klines) > 0:
                    df = _format_klines(klines)
                    _cache["klines"][cache_key] = (df, now)
                    return df.copy()
        except Exception:
            continue

    return pd.DataFrame()

def _format_klines(klines):
    df = pd.DataFrame(klines, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_asset_volume", "number_of_trades",
        "taker_buy_base_asset_volume", "taker_buy_quote_asset_volume", "ignore"
    ])
    df = df[["open_time", "open", "high", "low", "close", "volume"]]
    numeric_columns = ["open", "high", "low", "close", "volume"]
    for col in numeric_columns:
        df[col] = df[col].astype(float)
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    return df
