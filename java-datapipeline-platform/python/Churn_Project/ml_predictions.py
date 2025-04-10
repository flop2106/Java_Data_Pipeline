
import pandas as pd
import pickle
import argparse


parser = argparse.ArgumentParser(description="ML Predictions Run for Churn Prediction Demo")
parser.add_argument("--folder_path", type= str, default = r"python\Churn_Project")
parser.add_argument("--prediction_columns", type= str, default='predicted_churn')
args = parser.parse_args()

folder_path = args.folder_path
prediction_columns = args.prediction_columns
# Load the transformed data
transformed_path = fr"{folder_path}\transformed_data.csv"
X = pd.read_csv(transformed_path)

# Load original data for reference
original_data = pd.read_csv(fr"{folder_path}\mock_customer_data.csv")

# Load the model
with open(fr"{folder_path}\random_forest_churn_model.pkl", "rb") as f:
    model = pickle.load(f)

# Make predictions
predictions = model.predict(X)
original_data[prediction_columns] = predictions

# Save predictions
results_path = fr"{folder_path}\customer_churn_predictions.csv"
original_data.to_csv(results_path, index=False)
print(f"Predictions saved to: {results_path}")
