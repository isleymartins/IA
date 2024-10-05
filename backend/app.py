from flask import Flask, jsonify, request
from dotenv import load_dotenv
from controllers import LinearDiscriminant, RandomColors, Capture  # Importando diretamente do pacote controllers
import os
import pandas as pd

# Carregar variáveis de ambiente
load_dotenv()

# Porta do localhost
port = os.getenv('PORT', 5000)

app = Flask(__name__)

# Variáveis globais
capture = Capture()  # Inicialize como instância da classe Capture
colors = RandomColors
linearDiscriminant = LinearDiscriminant

# Rotas
@app.route('/api', methods=['GET'])
def home():
    return jsonify({"message": "Bem-vindo à API!"})

@app.route('/api/data', methods=['GET'])
def getData():
    global capture
    if capture.getData() is None:
        return jsonify({"message": "No data available"}), 400
    return jsonify(capture.getData().to_dict(orient='records'))

@app.route('/api/lineardiscriminant', methods=['GET'])
def get_linear_discriminant():
    return jsonify({"message": "Modelo LinearDiscriminant criado"})

# Definir a pasta de upload
UPLOAD_FOLDER = 'files/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    global capture
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    # Obtenha a extensão do arquivo
    file_extension = os.path.splitext(file.filename)[1]
    allowed_extensions = {'.txt', '.csv', '.json', '.xlsx'}

    if file and file_extension in allowed_extensions:
        # Defina o nome fixo e preserve a extensão do arquivo
        fixed_filename = 'data' + file_extension  
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], fixed_filename)
        file.save(filepath)

        # Inicializar a instância da classe `Capture` e usar setData
        capture.setData(filepath, file_extension)

        return jsonify({"message": "File successfully uploaded", "filename": fixed_filename, "data": capture.getData().to_dict(orient='records')}), 200
    else:
        return jsonify({"message": "Invalid file type"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=port)
