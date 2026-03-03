from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from io import BytesIO
from PIL import Image
import base64
import datetime

app = Flask(__name__)

# Absolute path for project directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Folder to save uploaded images
UPLOAD_FOLDER = os.path.join(BASE_DIR, "images")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to serve uploaded images
@app.route('/images/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Home page
@app.route('/')
def index():
    return render_template("index.html")

# Save photo from camera
@app.route('/save-image', methods=['POST'])
def save_image():
    data = request.get_json()
    image_data = data['imageData'].split(",")[1]
    camera_type = data.get("camera", "unknown")  # front or back

    # Format filename as DD+MM+YYYY_front.jpg
    timestamp = datetime.datetime.now().strftime(""%d+%m+%Y+%I+%M+%S%p"")
    filename = f"{timestamp}_{camera_type}.jpg"

    img = Image.open(BytesIO(base64.b64decode(image_data)))
    img.save(os.path.join(UPLOAD_FOLDER, filename))

    return jsonify({"message": "Saved", "filename": filename})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="4000", debug=True)
