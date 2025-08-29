import pandas as pd
import numpy as np

df = pd.read_csv('fishiko_augmented_dataset.csv')

np.random.seed(42)  
def generate_salinity(temp, season):
    base_salinity = 32.5  
    if season == 'Spring':
        salinity = np.random.normal(base_salinity - 1, 0.5)  
    elif season == 'Winter':
        salinity = np.random.normal(base_salinity + 0.5, 0.5)  
    else: 
        salinity = np.random.normal(base_salinity, 0.5)
    salinity -= (temp - 15) * 0.05  
    return round(max(30, min(35, salinity)), 2)  

df['salinity_psu'] = df.apply(lambda row: generate_salinity(row['temperature_degree_c'], row['season']), axis=1)

df.to_csv('fishiko_halifax_dataset.csv', index=False)

print(df[['temperature_degree_c', 'salinity_psu', 'season', 'fishing_zone']].describe())
print(df['season'].value_counts())
print(df['fishing_zone'].value_counts())

import boto3
s3 = boto3.client('s3')
bucket = 'fishiko-model-bucket'
s3.upload_file('fishiko_halifax_dataset.csv', bucket, 'data/fishiko_halifax_dataset.csv')
print("Uploaded dataset to s3://fishiko-model-bucket/data/fishiko_halifax_dataset.csv")