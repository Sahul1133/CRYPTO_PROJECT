import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from app.services.binance_service import get_historical_data

SEQUENCE_LENGTH = 60

def train_model(symbol):
    print(f"\n--- Training model for {symbol} ---")
    
    # Create necessary directories
    os.makedirs("data/raw", exist_ok=True)
    os.makedirs("data/models", exist_ok=True)
    
    # 1. Fetch 1h historical data
    print("Fetching historical data...")
    # Fetching about 60 days of hourly data for a fast training
    df = get_historical_data(symbol, interval="1h", start_str="60 days ago")
    
    if len(df) < SEQUENCE_LENGTH * 2:
        print(f"Not enough data for {symbol}.")
        return
    
    file_path = f"data/raw/{symbol}_1h.csv"
    df.to_csv(file_path, index=False)
    
    # 2. Preprocess data
    print("Preprocessing data...")
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
    print("Building model...")
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
    model.add(Dropout(0.2))
    model.add(LSTM(units=50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(units=25))
    model.add(Dense(units=1))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    # 4. Train Model
    print("Training model (this may take a minute)...")
    model.fit(x_train, y_train, batch_size=32, epochs=5, verbose=1)
    
    # 5. Save Model
    model_path = f"data/models/{symbol}_1h_model.h5"
    model.save(model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"]
    for symbol in symbols:
        try:
            train_model(symbol)
        except Exception as e:
            print(f"Failed to train {symbol}: {e}")
    
    print("\nAll models trained successfully!")
