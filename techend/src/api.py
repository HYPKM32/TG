from flask import Flask, request, jsonify, send_file, make_response
import os
import io
import subprocess
import base64
import pandas as pd
from werkzeug.utils import secure_filename

app = Flask(__name__)

# 업로드된 파일을 저장할 폴더 설정
UPLOAD_FOLDER = '/data'  # 로컬 환경의 data 폴더로 수정
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 업로드 가능한 파일 확장자 설정
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

# 파일 확장자 확인 함수
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# /data 폴더가 존재하지 않으면 생성
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/snap', methods=['POST'])
def handle_image_upload():
    # 'file' 키로 파일을 받아오는 부분
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format. Only JPG, JPEG, PNG, GIF are allowed."}), 400

    # 파일명 안전하게 처리
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # 파일 저장
    file.save(file_path)
    print(f"File saved to: {file_path}")  # 디버깅용 출력

    # 커맨드 실행 (여기서 파일 경로를 인자로 넘겨서 모델이 이미지를 처리하도록 함)
    command = [
        "python", "/usr/src/app/detect.py",  # 이 경로가 실제로 존재하는지 확인
        "--weights", "/app/src/weights/best.pt",  # 이 경로가 실제로 존재하는지 확인
        "--img", "416",
        "--conf", "0.1",
        "--save-csv",
        "--project","/data/Output",
        "--exist-ok",
        "--name", "result",
        "--source", file_path
    ]

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        image_path = "/data/Output/result/carrot.jpeg"
        
    # JSON 형식으로 반환

        
        return send_file(image_path, mimetype='image/jpeg')
    
    except subprocess.CalledProcessError as e:
        return jsonify({
            "message": "Error occurred during processing.",
            "error": e.stderr,
            "output": e.stdout  # subprocess에서 발생한 stdout도 함께 확인
        }), 500
        
@app.route('/api/get_list', methods=['GET'])
def get_list():
    csv_path = '/data/Output/result/predictions.csv'
    
    csv = pd.read_csv(csv_path,names=['filename','label','conf'])
    label = csv['label']
    label_val = label.values
    label_list = label_val.tolist()
    os.remove(csv_path)
    
    return jsonify(label_list), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=2000)
