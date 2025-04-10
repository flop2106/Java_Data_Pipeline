#!/usr/bin/env python
import argparse
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

def create_synthetic_data(num_samples=1000):
    """
    Creates a synthetic dataset for forex trading with columns: open, high, low, close.
    """
    np.random.seed(42)
    data = {
        "open": np.random.rand(num_samples) * 100,
        "high": np.random.rand(num_samples) * 100,
        "low": np.random.rand(num_samples) * 100,
        "close": np.random.rand(num_samples) * 100,
    }
    df = pd.DataFrame(data)
    return df

def create_lstm_model(input_shape):
    """
    Builds a simple LSTM model with one LSTM layer and a Dense output.
    """
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=input_shape))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mse')
    return model

def main():
    parser = argparse.ArgumentParser(description="LSTM Model for Forex Trading")
    parser.add_argument("--train_ratio", type=float, default=0.7, help="Train/Test split ratio (default: 0.7)")
    parser.add_argument("--features", type=str, default="open,high,low", help="Comma-separated list of features (default: open,high,low)")
    parser.add_argument("--target", type=str, default="close", help="Target column (default: close)")
    parser.add_argument("--seasonality", type=str, default="false", help="Enable seasonality (true/false, default: false)")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs (default: 10)")
    args = parser.parse_args()

    # Parse configuration parameters
    features = args.features.split(",")
    target = args.target
    train_ratio = args.train_ratio
    seasonality = args.seasonality.lower() == "true"
    epochs = args.epochs

    print("=== LSTM Model Configuration ===")
    print("Train/Test Ratio:", train_ratio)
    print("Features:", features)
    print("Target:", target)
    print("Seasonality Enabled:", seasonality)
    print("Epochs:", epochs)
    print("================================")

    # Create synthetic forex data
    df = create_synthetic_data(num_samples=1000)
    print("\nSample Data:")
    print(df.head())

    # Optionally add seasonality as an additional feature
    if seasonality:
        t = np.arange(len(df))
        df['seasonality'] = np.sin(2 * np.pi * t / 365)  # approximate yearly seasonality
        features.append('seasonality')

    # Scale features and target values to the range [0, 1]
    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X = scaler_x.fit_transform(df[features])
    y = scaler_y.fit_transform(df[[target]])

    # Reshape input for LSTM: (samples, timesteps, features). Here timesteps=1.
    X = X.reshape((X.shape[0], 1, X.shape[1]))

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=train_ratio, shuffle=False)

    # Build and summarize the LSTM model
    model = create_lstm_model((X_train.shape[1], X_train.shape[2]))
    model.summary()

    # Train the model
    model.fit(X_train, y_train, epochs=epochs, batch_size=32, verbose=1)

    # Evaluate the model on the test set
    loss = model.evaluate(X_test, y_test, verbose=0)
    print("\nTest Loss (MSE):", loss)

    # Generate predictions on the test set
    y_pred = model.predict(X_test)
    # Inverse transform the predictions and actual values for interpretation
    y_pred_inv = scaler_y.inverse_transform(y_pred)
    y_test_inv = scaler_y.inverse_transform(y_test)

    print("\nFirst 5 Predictions vs Actual:")
    for pred, actual in zip(y_pred_inv[:5], y_test_inv[:5]):
        print(f"Prediction: {pred[0]:.2f}, Actual: {actual[0]:.2f}")

if __name__ == "__main__":
    main()
