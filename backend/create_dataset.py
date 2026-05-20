from app.services.binance_service import (
    get_usdt_pairs,
    get_historical_data
)

import os

# Create folder if not exists
os.makedirs("data/raw", exist_ok=True)

print("Fetching USDT pairs...")

pairs = get_usdt_pairs()

# First 100 coins
pairs = pairs[:100]

print(f"Found {len(pairs)} pairs")

for pair in pairs:

    try:

        print(f"\nFetching {pair} daily data...")

        df = get_historical_data(
            symbol=pair,
            interval="1d",
            start_str="1 Jan, 2017"
        )

        file_path = f"data/raw/{pair}_1d.csv"

        df.to_csv(file_path, index=False)

        if pair == "BTCUSDT":
            df.to_csv("data/raw/btc_1d_full.csv", index=False)

        print(f"{pair} saved successfully")

    except Exception as e:

        print(f"Error fetching {pair}")
        print(e)

print("\nAll daily datasets downloaded")
