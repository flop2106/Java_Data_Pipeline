#!/usr/bin/env python
import argparse
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, recall_score, f1_score

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
    # Optionally, you could also add an argument for the CSV path if you want to override the default location.
    parser.add_argument("--csv_path", type=str, default="src/main/resources/static/temp.csv", help="Path to the CSV file")
    args = parser.parse_args()

    # Parse parameters
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
    print("CSV Path:", args.csv_path)
    print("================================")

    # Read CSV data from provided path
    try:
        df = pd.read_csv(args.csv_path)
    except Exception as e:
        print("Error reading CSV. Using synthetic data instead.")
        df = create_synthetic_data(num_samples=1000)
    
    # Optionally add seasonality as an additional feature
    if seasonality:
        t = np.arange(len(df))
        df['seasonality'] = np.sin(2 * np.pi * t / 365)  # approximate yearly seasonality
        features.append('seasonality')

    # Scale features and target to [0, 1]
    scaler_x = MinMaxScaler()
    scaler_y = MinMaxScaler()
    X = scaler_x.fit_transform(df[features])
    y = scaler_y.fit_transform(df[[target]])

    # Reshape input for LSTM: (samples, timesteps, features)
    X = X.reshape((X.shape[0], 1, X.shape[1]))

    # Split into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, train_size=train_ratio, shuffle=False)

    # Build and train the LSTM model
    model = create_lstm_model((X_train.shape[1], X_train.shape[2]))
    model.summary()
    model.fit(X_train, y_train, epochs=epochs, batch_size=32, verbose=1)

    # Evaluate the model on test set
    loss = model.evaluate(X_test, y_test, verbose=0)
    print("\nTest Loss (MSE):", loss)

    # Generate predictions on test set
    y_pred = model.predict(X_test)
    y_pred_inv = scaler_y.inverse_transform(y_pred)
    y_test_inv = scaler_y.inverse_transform(y_test)

    print("\nFirst 5 Predictions vs Actual:")
    for pred, actual in zip(y_pred_inv[:5], y_test_inv[:5]):
        print(f"Prediction: {pred[0]:.2f}, Actual: {actual[0]:.2f}")

    # Convert regression predictions to binary classification by thresholding at the median
    median_val = np.median(y_test_inv)
    y_pred_binary = (y_pred_inv >= median_val).astype(int)
    y_test_binary = (y_test_inv >= median_val).astype(int)

    accuracy = accuracy_score(y_test_binary, y_pred_binary)
    recall = recall_score(y_test_binary, y_pred_binary)
    f1 = f1_score(y_test_binary, y_pred_binary)

    print("\nClassification Metrics:")
    print(f"Accuracy: {accuracy:.2f}")
    print(f"Recall: {recall:.2f}")
    print(f"F1 Score: {f1:.2f}")

    # Save prediction results to CSV
    results_df = pd.DataFrame({
        "Actual": y_test_inv.flatten(),
        "Predicted": y_pred_inv.flatten()
    })
    csv_output_path = "src/main/resources/static/predictions.csv"
    results_df.to_csv(csv_output_path, index=False)
    print(f"\nPredictions saved to {csv_output_path}")

    # Plot actual vs predicted values and save as PNG
    plt.figure(figsize=(10, 6))
    plt.plot(y_test_inv, label="Actual", color="blue")
    plt.plot(y_pred_inv, label="Predicted", color="red")
    plt.title("LSTM Model: Actual vs Predicted")
    plt.xlabel("Sample Index")
    plt.ylabel(target)
    plt.legend()
    png_output_path = "src/main/resources/static/prediction_graph.png"
    plt.savefig(png_output_path)
    plt.close()
    print(f"Graph saved to {png_output_path}")

if __name__ == "__main__":
    main()
