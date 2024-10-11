from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from controllers import LinearDiscriminant, RandomColors, Capture  # Importando diretamente do pacote controllers
import os
import shutil
from itertools import combinations
import pandas as pd

# Carregar variáveis de ambiente
load_dotenv()

# Porta do localhost
port = os.getenv('PORT', 5000)

app = Flask(__name__)

CORS(app)  # Habilita CORS para todas as rotas

# Variáveis globais
capture = Capture()
colors = RandomColors
linearDiscriminant = LinearDiscriminant()

def prepare_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)


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
    global capture, linearDiscriminant
    if capture.data is not None:
        linearDiscriminant.setData(capture.x_train, capture.y_train)
        predictions = linearDiscriminant.fit(capture.x_test)
        model = [
            {f"{capture.feature}": species, **features} 
            for species, features in linearDiscriminant.model.transpose().items()
            ]
        train =   [
            {**features} 
            for species, features in predictions.transpose().items()
            ]
        directory = 'linearDiscriminant'
        # Prepare o diretório para salvar os plots
        prepare_directory(directory)

        precision = linearDiscriminant.pressure(capture.y_test, predictions, capture.feature).tolist()

        # Gera plots para cada par de colunas
        '''columns = list(capture.x_test.columns)
        plots = []
        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = linearDiscriminant.plot(['#FF0000', '#00FF00', '#0000FF'], col1, col2, predictions, f'{idx}',directory)
            plots.append(f'{plot_path}')'''
        
        response_data = {
            "message": "Modelo LinearDiscriminant criado",
            "Model": model,
            "Train": train,
            "Pressicion": precision,
            # "Plots": plots
            # "Plots": linearDiscriminant.plot()
        }

        print("Response Data:", model)
        return jsonify(response_data)
    else:
        return jsonify({"message": "Invalid data"}), 400
    
'''@app.route('/api/lineardiscriminant', methods=['POST'])
def get_linear_discriminant_image():
    global capture, linearDiscriminant

    if capture.data is not None:
        predictions = linearDiscriminant.fit(capture.x_test)

        # Gera plots para cada par de colunas
        columns = list(capture.x_test.columns)
        plots = []
        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = linearDiscriminant.plot(['#FF0000', '#00FF00', '#0000FF'], col1, col2, predictions, f'{idx}')
            plots.append(plot_path)

        return {plots}
    else:
        return jsonify({"message": "Invalid data"}), 400'''

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
    
    # Pega a extensão do arquivo
    file_extension = os.path.splitext(file.filename)[1]
    allowed_extensions = {'.txt', '.csv', '.json', '.xlsx', '.xls'}

    if file and file_extension in allowed_extensions:
        # Define o nome fixo e preserve a extensão do arquivo
        fixed_filename = 'data' + file_extension  
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], fixed_filename)
        file.save(filepath)

        # Captura os valores de classColumn e testSize
        feature = request.form['feature']
        # Converte para um valor de 0 a 1
        testCase = float(request.form['testCase']) / 100  

        # Inicializa a instância da classe `Capture` e usar setData e shareData
        capture.setData(filepath, feature, file_extension)
        capture.shareData(feature, testCase)

        return jsonify({"message": "File successfully uploaded", "filename": fixed_filename, "data": capture.getData().to_dict(orient='records')}), 200
    else:
        return jsonify({"message": "Invalid file type"}), 400

if __name__ == '__main__':
    #app.run(debug=True, port=port)
    app.run(debug=True)