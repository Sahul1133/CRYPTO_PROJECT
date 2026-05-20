from binance.client import Client
import pandas as pd

client = Client()

def get_usdt_pairs(limit=None):

    exchange_info = client.get_exchange_info()

    symbols = exchange_info['symbols']

    usdt_pairs = []

    for symbol in symbols:

        if (
            symbol['quoteAsset'] == 'USDT'
            and symbol['status'] == 'TRADING'
        ):
            usdt_pairs.append(symbol['symbol'])

    if limit:
        return usdt_pairs[:limit]
    return usdt_pairs

def get_all_tickers():
    tickers = client.get_all_tickers()
    return {t['symbol']: float(t['price']) for t in tickers}


def get_historical_data(
    symbol,
    interval="1h",
    start_str="1 Jan, 2017"
):

    klines = client.get_historical_klines(
        symbol,
        interval,
        start_str
    )

    df = pd.DataFrame(klines, columns=[
        "open_time",
        "open",
        "high",
        "low",
        "close",
        "volume",
        "close_time",
        "quote_asset_volume",
        "number_of_trades",
        "taker_buy_base_asset_volume",
        "taker_buy_quote_asset_volume",
        "ignore"
    ])

    df = df[[
        "open_time",
        "open",
        "high",
        "low",
        "close",
        "volume"
    ]]

    numeric_columns = [
        "open",
        "high",
        "low",
        "close",
        "volume"
    ]

    for col in numeric_columns:
        df[col] = df[col].astype(float)

    df["open_time"] = pd.to_datetime(
        df["open_time"],
        unit="ms"
    )

    return df
