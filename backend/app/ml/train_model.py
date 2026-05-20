import numpy as np

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    LSTM,
    Dense,
    Dropout
)

# Load processed datasets
x_train = np.load("data/processed/x_train.npy")
y_train = np.load("data/processed/y_train.npy")

x_test = np.load("data/processed/x_test.npy")
y_test = np.load("data/processed/y_test.npy")

print("Datasets loaded successfully")

print("X Train Shape:", x_train.shape)
print("Y Train Shape:", y_train.shape)

# Create Sequential model
model = Sequential()

# First LSTM layer
model.add(
    LSTM(
        units=64,
        return_sequences=True,
        input_shape=(x_train.shape[1], 1)
    )
)

# Prevent overfitting
model.add(
    Dropout(0.2)
)

# Second LSTM layer
model.add(
    LSTM(
        units=64
    )
)

model.add(
    Dropout(0.2)
)

# Output layer
model.add(
    Dense(1)
)

# Compile model
model.compile(
    optimizer="adam",
    loss="mean_squared_error"
)

print("\nStarting model training...\n")

# Train model
history = model.fit(
    x_train,
    y_train,
    epochs=5,
    batch_size=32,
    validation_data=(x_test, y_test)
)

# Save trained model
model.save(
    "data/models/btc_lstm_model.h5"
)

print("\nModel trained successfully!")
print("Model saved to data/models/")
