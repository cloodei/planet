import joblib
import numpy as np
import keras.backend as K
from keras.models import load_model
from sklearn.preprocessing import StandardScaler

def r2_score(y_true, y_pred):
    ss_res = K.sum(K.square(y_true - y_pred))
    ss_tot = K.sum(K.square(y_true - K.mean(y_true)))
    return 1 - ss_res / (ss_tot + K.epsilon())

arr: np.ndarray = np.load('last5.npy')
scaler: StandardScaler = joblib.load('scaler.pkl')
model = load_model('planetheat_model.keras', custom_objects={'r2_score': r2_score})

if arr.ndim == 2 and arr.shape == (5, 8):
    X_input = arr.reshape(1, 5, 8)
else:
    X_input = arr
# Run prediction
pred = model.predict(X_input)

print('Predictions shape:', pred.shape)
print('Predictions:', pred)
print('Predicted transformed:', scaler.inverse_transform(pred))
