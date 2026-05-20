import pandas as pd
import numpy as np

from sklearn.preprocessing import MinMaxScaler

SEQUENCE_LENGTH = 60

def preprocess_coin_data(file_path):

    df = pd.read_csv(file_path)

    close_prices = df["close"].values.reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0, 1))

    scaled_data = scaler.fit_transform(close_prices)

    x = []
    y = []

    for i in range(SEQUENCE_LENGTH, len(scaled_data)):

        x.append(
            scaled_data[i-SEQUENCE_LENGTH:i]
        )

        y.append(
            scaled_data[i]
        )

    x = np.array(x)
    y = np.array(y)

    split_index = int(len(x) * 0.8)

    x_train = x[:split_index]
    y_train = y[:split_index]

    x_test = x[split_index:]
    y_test = y[split_index:]

    return (
        x_train,
        y_train,
        x_test,
        y_test,
        scaler
    )
