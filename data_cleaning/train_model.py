import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import boto3

s3 = boto3.client('s3')
bucket = 'fishiko-model-bucket'
s3.download_file(bucket, 'data/fishiko_halifax_dataset.csv', 'fishiko_halifax_dataset.csv')

df = pd.read_csv('fishiko_halifax_dataset.csv')
season_encoder = LabelEncoder()
df['season_encoded'] = season_encoder.fit_transform(df['season'])

X = df[['temperature_degree_c', 'salinity_psu', 'season_encoded']]
y = df['fishing_zone']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight='balanced' 
)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

joblib.dump(model, 'fishiko_model_updated.pkl')
joblib.dump(season_encoder, 'season_encoder.pkl')

s3.upload_file('fishiko_model_updated.pkl', bucket, 'fishiko_model_updated.pkl')
s3.upload_file('season_encoder.pkl', bucket, 'season_encoder.pkl')
print("Uploaded model and encoder to s3://fishiko-model-bucket/")