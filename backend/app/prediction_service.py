import os
import numpy as np
import pandas as pd

from sklearn.preprocessing import MinMaxScaler
from app.services.binance_service import get_historical_data

SEQUENCE_LENGTH = 60

def predict_next_price(symbol, live_price=None):
    try:
        from tensorflow.keras.models import load_model  # type: ignore
        tf_available = True
    except ModuleNotFoundError:
        tf_available = False

    model_path = f"data/models/{symbol}_1h_model.h5"

    current_price = live_price
    use_mock = True
    df = None

    model_exists = os.path.exists(model_path)

    # Only fetch historical data if we have a model and need the 60 data points, 
    # OR if we don't have a live_price passed in and need to get the current price.
    if (tf_available and model_exists) or (current_price is None):
        try:
            df = get_historical_data(symbol, interval="1h", start_str="5 days ago")
            if "close" in df.columns and len(df) >= SEQUENCE_LENGTH:
                if current_price is None:
                    current_price = float(df["close"].values[-1])
                use_mock = False
            elif len(df) > 0:
                if current_price is None:
                    current_price = float(df["close"].values[-1])
        except Exception as e:
            print(f"Error fetching live data for prediction: {e}")

    fallback_prices = {"BTCUSDT": 68420.0, "ETHUSDT": 3542.0, "SOLUSDT": 152.34}
    if current_price is None:
        current_price = fallback_prices.get(symbol, 100.0)

    predicted_price = current_price
    
    if tf_available and model_exists and not use_mock and df is not None:
        try:
            close_prices = df["close"].values.reshape(-1, 1)
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_data = scaler.fit_transform(close_prices)

            model = load_model(model_path)
            last_sequence = scaled_data[-SEQUENCE_LENGTH:]
            x_input = np.reshape(last_sequence, (1, SEQUENCE_LENGTH, 1))
            predicted_scaled = model.predict(x_input, verbose=0)
            predicted_price_unscaled = scaler.inverse_transform(predicted_scaled)
            predicted_price = float(predicted_price_unscaled[0][0])
            
            return {
                "symbol": symbol,
                "current_price": current_price,
                "predicted_price": predicted_price,
                "is_mock": False,
            }
        except Exception as e:
            print(f"Model prediction error: {e}")
            use_mock = True

    # Fallback mock prediction
    offsets = {"BTCUSDT": 0.005, "ETHUSDT": 0.006, "SOLUSDT": -0.007}
    pct = offsets.get(symbol, 0.01)
    predicted_price = current_price * (1.0 + pct)

    return {
        "symbol": symbol,
        "current_price": current_price,
        "predicted_price": predicted_price,
        "is_mock": True,
    }
