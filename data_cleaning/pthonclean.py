import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Load dataset
df = pd.read_csv("fishiko_augmented_dataset.csv")

le_season = LabelEncoder()
df['season_encoded'] = le_season.fit_transform(df['season'])

X = df[['temperature_degree_c', 'season_encoded']]
y = df['fishing_zone']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

print("Model Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

joblib.dump(model, "fishiko_model.pkl")
joblib.dump(le_season, "season_encoder.pkl")

print("Model and encoder saved: fishiko_model.pkl, season_encoder.pkl")
