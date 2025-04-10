
import pandas as pd
import argparse

# Load the mock input data
parser = argparse.ArgumentParser(description="Data Transformation for Churn Prediction Demo")
parser.add_argument("--folder_path", type= str, default = r"python\Churn_Project")
parser.add_argument("--drop_columns", type= str, default='customer_id,churned')
args = parser.parse_args()

folder_path = args.folder_path
drop_columns = args.drop_columns.split(',')
mock_data_path = fr"{folder_path}\mock_customer_data.csv"
data = pd.read_csv(mock_data_path)

# Preprocess the data
data_encoded = pd.get_dummies(data, columns=['contract_type'], drop_first=True)

# Drop columns not used in training
X = data_encoded.drop(drop_columns, axis=1)

# Save the transformed data
transformed_path = fr"{folder_path}\transformed_data.csv"
X.to_csv(transformed_path, index=False)
print(f"Transformed data saved to: {transformed_path}")
