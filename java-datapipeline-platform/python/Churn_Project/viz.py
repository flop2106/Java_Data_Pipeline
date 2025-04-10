
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import argparse

parser = argparse.ArgumentParser(description="Viz Run for Churn Prediction Demo")
parser.add_argument("--folder_path", type= str, default = r"python\Churn_Project")
args = parser.parse_args()

folder_path = args.folder_path
# Load prediction results
data = pd.read_csv(fr"{folder_path}\customer_churn_predictions.csv")

# Count predictions
counts = data['predicted_churn'].value_counts().sort_index()
labels = ['Not Churned (0)', 'Churned (1)']
values = [counts.get(0, 0), counts.get(1, 0)]

# Compute percentages
total = sum(values)
percentages = [f'{(v/total)*100:.1f}%' for v in values]

# Create pie chart
colors = ['#4CAF50', '#F44336']
plt.figure(figsize=(6, 6))
plt.pie(values, labels=[f"{l} - {p}" for l, p in zip(labels, percentages)], autopct='%1.1f%%', startangle=140, colors=colors)
plt.title("Customer Churn Prediction Breakdown")

# Save and show plot
plot_path = fr"{folder_path}\churn_pie_chart.png"
plt.savefig(plot_path)
plt.show()
print(f"Plot saved to: {plot_path}")
