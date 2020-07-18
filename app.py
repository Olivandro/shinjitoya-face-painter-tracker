from flask import Flask, render_template, Response
from facetracker.Webcam import Webcam


app = Flask(__name__, static_url_path='/static')


@app.route('/')
def home():
    return render_template('canvas.html')

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
    return Response(genmesh(Webcam()),
                    mimetype='multipart/x-mixed-replace; boundary=frame')