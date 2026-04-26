import os
import json
import numpy as np
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import tensorflow as tf

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

MODEL_PATH = 'crop_disease_model.h5'
CLASS_INDICES_PATH = 'class_indices.json'
DISEASE_INFO_PATH = 'disease_info.json'

model = None
class_names = None
disease_info = {}

# Load Disease Info
if os.path.exists(DISEASE_INFO_PATH):
    with open(DISEASE_INFO_PATH, 'r') as f:
        disease_info = json.load(f)

# Try to load model and class names (might not exist yet if still training)
try:
    if os.path.exists(MODEL_PATH) and os.path.exists(CLASS_INDICES_PATH):
        model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASS_INDICES_PATH, 'r') as f:
            class_indices = json.load(f)
        # Invert dictionary to get index -> class_name
        class_names = {v: k for k, v in class_indices.items()}
        print("Model and class mapping loaded successfully.")
    else:
        print("Warning: Model or class indices not found. Using mock predictions for frontend testing.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/analyze')
def analyze():
    return render_template('analyze.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'})
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # If model is loaded, make real prediction
        if model and class_names:
            try:
                img = tf.keras.preprocessing.image.load_img(filepath, target_size=(224, 224))
                img_array = tf.keras.preprocessing.image.img_to_array(img)
                img_array = np.expand_dims(img_array, axis=0) / 255.0
                
                predictions = model.predict(img_array)
                predicted_class_idx = np.argmax(predictions[0])
                confidence = float(predictions[0][predicted_class_idx]) * 100
                
                predicted_class_name = class_names[predicted_class_idx]
                
                # Retrieve info
                info = disease_info.get(predicted_class_name, {
                    "description": "Information not available.",
                    "solution": "Consult an agricultural expert.",
                    "fertilizers": "General NPK fertilizer",
                    "pesticides": "As recommended by local authorities"
                })
                
                quality_score = confidence if 'healthy' not in predicted_class_name.lower() else 100.0
                
                return jsonify({
                    'disease': predicted_class_name.replace('___', ' ').replace('_', ' '),
                    'raw_class': predicted_class_name,
                    'confidence': confidence,
                    'quality': quality_score,
                    'info': info,
                    'image_path': filepath
                })
            except Exception as e:
                return jsonify({'error': str(e)})
        else:
            # MOCK PREDICTION FOR FRONTEND TESTING
            import random
            import time
            time.sleep(1.5) # Simulate processing time
            
            mock_class = random.choice(list(disease_info.keys())) if disease_info else "Tomato___Late_blight"
            mock_info = disease_info.get(mock_class, {
                "description": "Mock description.",
                "solution": "Mock solution.",
                "fertilizers": "Mock Fertilizer",
                "pesticides": "Mock Pesticide"
            })
            
            return jsonify({
                'disease': mock_class.replace('___', ' ').replace('_', ' '),
                'raw_class': mock_class,
                'confidence': random.uniform(85.0, 99.9),
                'quality': random.uniform(20.0, 90.0),
                'info': mock_info,
                'image_path': filepath
            })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
