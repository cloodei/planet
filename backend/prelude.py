import joblib
import numpy as np
import pandas as pd
import keras.backend as K
from keras.models import load_model
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("GlobalTemperatures.csv", parse_dates=["dt"])
df["year"] = df["dt"].dt.year
df = df[df["year"] >= 1850]
df = df.drop(columns="dt")
group = df.groupby("year")[df.drop(columns="year").columns].mean()

def r2_score(y_true, y_pred):
  ss_res = K.sum(K.square(y_true - y_pred))
  ss_tot = K.sum(K.square(y_true - K.mean(y_true)))
  return 1 - ss_res / (ss_tot + K.epsilon())

years_arr: np.ndarray = np.load('last5.npy')
scaler: StandardScaler = joblib.load('scaler.pkl')
model = load_model('model.keras', custom_objects={'r2_score': r2_score})

if years_arr.ndim == 2 and years_arr.shape == (5, 8):
  years_arr = years_arr.reshape(1, 5, 8)

def predict(year: int):
  if year < 2015:
    if year in group.index:
      res = group.loc[year].to_dict()
      res.pop("year")
      res.pop("LandAverageTemperatureUncertainty")
      res.pop("LandMaxTemperatureUncertainty")
      res.pop("LandMinTemperatureUncertainty")
      res.pop("LandAndOceanAverageTemperatureUncertainty")

      return res
    else:
      return {"error": "Unprojectable year"}
  else:
    current_input = years_arr.copy()

    for _ in range(2015, year + 1):
      t = model.predict(current_input)
      current_input = np.roll(current_input, -1, axis=1)
      current_input[0, -1, :] = t

    final_prediction_scaled = current_input[0, -1, :].reshape(1, -1)
    final_prediction = scaler.inverse_transform(final_prediction_scaled)
    
    return {
      'LandAverageTemperature': final_prediction[0][0],
      'LandMaxTemperature': final_prediction[0][2],
      'LandMinTemperature': final_prediction[0][4],
      'LandAndOceanAverageTemperature': final_prediction[0][6]
    }
  
# while True:
#   year = int(input())
#   start = time.time()
#   pred = predict(year)
#   end = time.time()
#   print("Time: ", end - start)
#   print(pred)
