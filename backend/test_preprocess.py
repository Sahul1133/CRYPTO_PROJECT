from app.ml.preprocess import preprocess_coin_data

(
    x_train,
    y_train,
    x_test,
    y_test,
    scaler
) = preprocess_coin_data(
    "data/raw/BTCUSDT_1h.csv"
)

print("X Train:", x_train.shape)
print("Y Train:", y_train.shape)

print("X Test:", x_test.shape)
print("Y Test:", y_test.shape)
