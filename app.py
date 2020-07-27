import os
from flask import Flask, render_template, Response, jsonify, flash, request, redirect, url_for
from flask_cors import CORS
from facetracker.Webcam import Webcam

UPLOAD_FOLDER = 'static/temp-images/'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'JPG', 'JPEG'])

app = Flask(__name__, static_url_path='/static')
CORS(app, resources={r"/*": {"origins": "*"}})
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return render_template('landing.html')

@app.route('/uploader', methods = ['GET', 'POST'])
def uploader():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return "No File part..."
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return "No selected file"
        if file:
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return "Upload complete"


@app.route('/webcam')
def webcam():
    return render_template('webcam.html')

def genmesh(camera):
    while True:
        #get camera frame
        frame = camera.webcam_mesh()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/mesh_feed')
def mesh_feed():
    return Response(genmesh(Webcam()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

def genclean(camera):
    while True:
        # get camera frame
        frame = camera.webcam_clean()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/clean_feed')
def clean_feed():
    return Response(genclean(Webcam()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# New experimental routes for saving iage for painting.... currently not working...
def genimg(camera):
    while True:
        frame = camera.capture_img()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

@app.route('/canvas')
def canvas():
    return render_template('canvas.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0")

