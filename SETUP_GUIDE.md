# 🛠️ CropScan AI - Setup & Installation Guide

If you have downloaded or cloned the **CropScan AI** repository, follow these simple steps to get the project running smoothly on your local machine!

## Prerequisites
Before you begin, ensure you have the following installed on your computer:
1. **Python**: Version 3.8 to 3.11 (Make sure Python is added to your system PATH).
2. **Git** (Optional, for cloning the repo).

---

## Step 1: Download the Code
If you haven't already, clone the repository to your local machine:
```bash
git clone https://github.com/your-username/CropScan-AI.git
cd CropScan-AI
```
*(If you downloaded the ZIP file instead, simply extract it and open the folder in your terminal).*

## Step 2: Set Up a Virtual Environment (Recommended)
It is always best practice to create a virtual environment so you don't mess up your global Python packages.
```bash
python -m venv venv
```
Activate the virtual environment:
* **On Windows:**
  ```bash
  venv\Scripts\activate
  ```
* **On macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

## Step 3: Install Required Libraries
The project requires several libraries to run the Web Server and the AI Model. We have provided a `requirements.txt` file for easy installation.

Run the following command in your terminal:
```bash
pip install -r requirements.txt
```
*(This will automatically install TensorFlow, Flask, Numpy, and Gunicorn).*

## Step 4: Run the Application!
Once everything is installed, you can start the Flask web server by running:
```bash
python app.py
```

## Step 5: Open in Your Browser
You will see output in your terminal indicating that the server is running. Open your favorite web browser (Chrome, Firefox, etc.) and go to:
👉 **http://127.0.0.1:5000**

---

### Troubleshooting
* **ModuleNotFoundError**: If you get an error saying a module is missing (e.g., `No module named 'flask'`), make sure your virtual environment is activated and try running `pip install -r requirements.txt` again.
* **Model Not Found**: Ensure that the `crop_disease_model.h5` and `class_indices.json` files are present in the main directory. If they are missing, you will need to run `python crop.py` to train the model from scratch.
