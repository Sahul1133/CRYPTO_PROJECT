import time
import requests
import pandas as pd
from binance.client import Client

client = Client()

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

CACHE_TTL = 20  # seconds

def get_all_tickers():
    now = time.time()
    if _cache["all_tickers"] and (now - _cache["all_tickers_time"] < CACHE_TTL):
        return _cache["all_tickers"]

    try:
        res = requests.get("https://api.binance.com/api/v3/ticker/price", timeout=5)
        if res.status_code == 200:
            tickers = res.json()
            ticker_dict = {t['symbol']: float(t['price']) for t in tickers}
            _cache["all_tickers"] = ticker_dict
            _cache["all_tickers_time"] = now
            return ticker_dict
    except Exception as e:
        print(f"Direct ticker request failed, trying client: {e}")

    try:
        tickers = client.get_all_tickers()
        ticker_dict = {t['symbol']: float(t['price']) for t in tickers}
        _cache["all_tickers"] = ticker_dict
        _cache["all_tickers_time"] = now
        return ticker_dict
    except Exception as e:
        print(f"Error fetching tickers: {e}")
        return _cache["all_tickers"] or {}

def get_top_usdt_tickers(limit=100):
    now = time.time()
    if _cache["top_tickers"] and (now - _cache["top_tickers_time"] < CACHE_TTL):
        return _cache["top_tickers"][:limit]

    try:
        res = requests.get("https://api.binance.com/api/v3/ticker/24hr", timeout=6)
        if res.status_code == 200:
            data = res.json()
            excluded_suffixes = ('UPUSDT', 'DOWNUSDT', 'BULLUSDT', 'BEARUSDT')
            usdt_tickers = [
                d for d in data
                if d['symbol'].endswith('USDT')
                and not any(d['symbol'].endswith(ex) for ex in excluded_suffixes)
                and float(d.get('quoteVolume', 0)) > 50000
            ]
            usdt_tickers.sort(key=lambda x: float(x.get('quoteVolume', 0)), reverse=True)
            _cache["top_tickers"] = usdt_tickers
            _cache["top_tickers_time"] = now
            return usdt_tickers[:limit]
    except Exception as e:
        print(f"Error fetching 24hr tickers: {e}")

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

    try:
        exchange_info = client.get_exchange_info()
        symbols = exchange_info['symbols']
        usdt_pairs = [
            s['symbol'] for s in symbols
            if s['quoteAsset'] == 'USDT' and s['status'] == 'TRADING'
        ]
        _cache["exchange_symbols"] = usdt_pairs
        _cache["exchange_symbols_time"] = now
        return usdt_pairs[:limit] if limit else usdt_pairs
    except Exception as e:
        print(f"Error in get_usdt_pairs: {e}")
        return ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "DOGEUSDT", "ADAUSDT"]

def get_historical_data(symbol, interval="1h", start_str="5 days ago", limit=120):
    cache_key = f"{symbol}_{interval}_{start_str}_{limit}"
    now = time.time()
    if cache_key in _cache["klines"]:
        cached_df, timestamp = _cache["klines"][cache_key]
        if now - timestamp < 30:  # 30 second cache for klines
            return cached_df.copy()

    # Try fast direct REST API first (fastest, lightweight)
    try:
        params = {"symbol": symbol, "interval": interval, "limit": limit}
        res = requests.get("https://api.binance.com/api/v3/klines", params=params, timeout=5)
        if res.status_code == 200:
            klines = res.json()
            if klines and len(klines) > 0:
                df = _format_klines(klines)
                _cache["klines"][cache_key] = (df, now)
                return df.copy()
    except Exception as e:
        print(f"Fast klines fetch error for {symbol}: {e}")

    # Fallback to python-binance client
    try:
        klines = client.get_historical_klines(symbol, interval, start_str)
        if klines and len(klines) > 0:
            df = _format_klines(klines)
            _cache["klines"][cache_key] = (df, now)
            return df.copy()
    except Exception as e:
        print(f"Client klines fetch error for {symbol}: {e}")

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
