import os
import sys
import time
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.services.binance_service import get_historical_data

SEQUENCE_LENGTH = 60

def train_model(symbol):
    print(f"\n==========================================")
    print(f"Training LSTM Model for {symbol}")
    print(f"==========================================")
    
    # Create necessary directories
    raw_dir = BASE_DIR / "data" / "raw"
    models_dir = BASE_DIR / "data" / "models"
    raw_dir.mkdir(parents=True, exist_ok=True)
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. Fetch real historical 1h data from Binance
    print(f"Fetching real Binance 1h historical data for {symbol}...")
    start_time = time.time()
    try:
        df = get_historical_data(symbol, interval="1h", start_str="60 days ago")
    except Exception as e:
        print(f"Error fetching data from Binance: {e}")
        return False
        
    if df is None or len(df) < SEQUENCE_LENGTH * 2:
        print(f"Insufficient historical data for {symbol}: {len(df) if df is not None else 0} rows.")
        return False
        
    print(f"Fetched {len(df)} hourly candles in {time.time() - start_time:.2f}s.")
    print(f"Price range: ${df['close'].min():.2f} - ${df['close'].max():.2f} | Latest: ${df['close'].iloc[-1]:.2f}")
    
    # Save raw data
    raw_csv = raw_dir / f"{symbol}_1h.csv"
    df.to_csv(raw_csv, index=False)
    
    # 2. Preprocess data
    close_prices = df["close"].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(close_prices)
    
    x_train, y_train = [], []
    for i in range(SEQUENCE_LENGTH, len(scaled_data)):
        x_train.append(scaled_data[i-SEQUENCE_LENGTH:i, 0])
        y_train.append(scaled_data[i, 0])
        
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))
    
    # 3. Build LSTM Model
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, LSTM, Dropout, Input
    
    model = Sequential([
        Input(shape=(x_train.shape[1], 1)),
        LSTM(units=50, return_sequences=True),
        Dropout(0.2),
        LSTM(units=50, return_sequences=False),
        Dropout(0.2),
        Dense(units=25, activation='relu'),
        Dense(units=1)
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
    
    # 4. Train Model
    print("Training LSTM network...")
    train_start = time.time()
    history = model.fit(
        x_train, 
        y_train, 
        batch_size=32, 
        epochs=6, 
        validation_split=0.1, 
        verbose=1
    )
    print(f"Training completed in {time.time() - train_start:.2f}s.")
    
    # 5. Save Model
    model_path = models_dir / f"{symbol}_1h_model.h5"
    model.save(str(model_path))
    print(f"Successfully saved trained model to: {model_path}")
    
    # 6. Verify prediction test
    last_seq = scaled_data[-SEQUENCE_LENGTH:]
    x_test = np.reshape(last_seq, (1, SEQUENCE_LENGTH, 1))
    pred_scaled = model.predict(x_test, verbose=0)
    pred_unscaled = scaler.inverse_transform(pred_scaled)[0][0]
    last_real = float(df['close'].iloc[-1])
    diff_pct = ((pred_unscaled - last_real) / last_real) * 100
    print(f"Test verification -> Real Price: ${last_real:.2f} | 1H Predicted: ${pred_unscaled:.2f} ({diff_pct:+.2f}%)")
    return True

if __name__ == "__main__":
    symbols_to_train = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "XRPUSDT", "DOGEUSDT"]
    print(f"Starting training for {len(symbols_to_train)} cryptocurrency models...")
    
    success_count = 0
    for sym in symbols_to_train:
        try:
            ok = train_model(sym)
            if ok:
                success_count += 1
        except Exception as ex:
            print(f"Failed to train {sym}: {ex}")
            
    print(f"\n==========================================")
    print(f"Training Complete! {success_count}/{len(symbols_to_train)} models trained and saved.")
    print(f"==========================================")
