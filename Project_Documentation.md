# CropScan AI - Project Documentation

This document outlines all the requirements, tools, and libraries used to build the CropScan AI platform. This will be very helpful for your PBL (Project-Based Learning) report!

## 1. Hardware Requirements
* **Processor**: Intel Core i5 / AMD Ryzen 5 (or higher)
* **RAM**: 8 GB minimum (16 GB highly recommended for model training)
* **Storage**: At least 5 GB of free disk space (to store the 38-class dataset and the trained model file)
* **GPU**: Any standard integrated graphics card is sufficient to *run* the web app. However, an NVIDIA GPU with CUDA support is recommended if you wish to re-train the model quickly.

## 2. Software Requirements
* **Operating System**: Windows 10/11, macOS, or Linux
* **Python**: Python 3.8, 3.9, 3.10, or 3.11 installed
* **Web Browser**: Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari)

## 3. Tools & Technologies Used
* **Backend Framework**: Flask (A lightweight Python web server)
* **Frontend Technologies**: HTML5, CSS3, and Vanilla JavaScript
* **Deep Learning Architecture**: MobileNetV2 (Transfer Learning via TensorFlow)
* **UI Design Pattern**: Glassmorphism (CSS Backdrop-filter)
* **Icons**: FontAwesome (Free tier)
* **3D Animations**: Vanilla-Tilt.js
* **Development Environment / IDE**: (Your preferred editor, e.g., VS Code or Cursor)

## 4. Python Libraries Used
If you need to install these on another computer, you can use the command: `pip install tensorflow flask numpy werkzeug`

* **`tensorflow` / `keras`**: Used for building, training, and predicting with the MobileNetV2 Convolutional Neural Network.
* **`flask`**: Used to build the web server and route pages (Home, Shop, Analyze).
* **`werkzeug`**: Used securely handle user image uploads.
* **`numpy`**: Used for array manipulations and preprocessing the images before passing them to the model.
* **`os`**: (Built-in) Used for file and directory management.
* **`json`**: (Built-in) Used to load and manage the disease database (`disease_info.json`).
