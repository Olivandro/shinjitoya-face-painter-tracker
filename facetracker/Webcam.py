import sys
import cv2
from facetracker.mark_detector import MarkDetector


sys.path.append("/Users/Olivandro/Sites/face_landmark_factory-master")


# Import nn model
current_model = "/Users/Olivandro/Sites/face_landmark_factory-master/model/facial_landmark_SqueezeNet.pb"
CNN_INPUT_SIZE = 64
# VIDEO_PATH = 0


class Webcam(object):
    def __init__(self):
        self.vs = cv2.VideoCapture(0)
        # self.time.sleep(2.0)

    def __del__(self):
        # releasing camera
        self.vs.release()

    def webcam_mesh(self):
        mark_detector = MarkDetector(current_model, CNN_INPUT_SIZE)
        if current_model.split(".")[-1] == "pb":
            run_model = 0
        elif current_model.split(".")[-1] == "hdf5" or current_model.split(".")[-1] == "h5":
            run_model = 1
        else:
            print("input model format error !")
            return

        _, frame = self.vs.read()

        if frame is None:
            return "No frame data"

        faceboxes = mark_detector.extract_cnn_facebox(frame)

        if faceboxes is not None:
            for facebox in faceboxes:
                # Detect landmarks from image of 64X64 with grayscale.
                face_img = frame[facebox[1]: facebox[3], facebox[0]: facebox[2]]
                cv2.rectangle(frame, (facebox[0], facebox[1]), (facebox[2], facebox[3]), (0, 255, 0), 2)
                face_img = cv2.resize(face_img, (CNN_INPUT_SIZE, CNN_INPUT_SIZE))
                face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2GRAY)
                face_img0 = face_img.reshape(1, CNN_INPUT_SIZE, CNN_INPUT_SIZE, 1)

                if run_model == 1:
                    marks = mark_detector.detect_marks_keras(face_img0)
                else:
                    marks = mark_detector.detect_marks_tensor(face_img0, 'input_2:0', 'output/BiasAdd:0')
                
                marks *= facebox[2] - facebox[0]
                marks[:, 0] += facebox[0]
                marks[:, 1] += facebox[1]

                # Draw Predicted Landmarks
                mark_detector.draw_marks(frame, marks, color=(255, 255, 255), thick=2)

        # do a bit of cleanup
        cv2.destroyAllWindows()

        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()

    def webcam_clean(self):
        _, frame = self.vs.read()
        
        # do a bit of cleanup
        cv2.destroyAllWindows()

        _, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
