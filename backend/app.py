from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
#from dotenv import load_dotenv
from controllers import MinimumDistanceClassifier, BayesClassifier, RandomColors, Capture  # Importando diretamente do pacote controllers
import os
import shutil
from itertools import combinations
import pandas as pd

# Carregar variáveis de ambiente
#load_dotenv()

# Porta do localhost
port = os.getenv('PORT', 5000)

app = Flask(__name__)

CORS(app)  # Habilita CORS para todas as rotas

# Variáveis globais
capture = Capture()
colors = RandomColors()
minimumDistanceClassifier = MinimumDistanceClassifier()
bayesClassifier = BayesClassifier()

def prepare_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

def convert_to_serializable(model):
    for item in model:
        item['mean'] = [float(x) for x in item['mean']]
        item['matrix_cov'] = item['matrix_cov'].tolist()
    return model
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

@app.route('/api/minimumdistanceclassifier', methods=['GET'])
def get_linear_discriminant():
    global capture, minimumDistanceClassifier, colors

    if capture.data is not None:
        minimumDistanceClassifier.setData(capture.x_train, capture.y_train, capture.feature)
        predictions = minimumDistanceClassifier.fit(capture.x_test)

        model = [
            {f"{capture.feature}": species, **features}
            for species, features in minimumDistanceClassifier.model.transpose().items()
        ]

        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ]

        directory = 'minimumDistanceClassifier'
        prepare_directory(directory)

        precision = minimumDistanceClassifier.pressure(capture.y_test, predictions, capture.feature).tolist()

        columns = list(capture.x_test.columns)
        plots = []

        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = minimumDistanceClassifier.plot(colors.getData(), col1, col2, predictions, f'{idx}')
            plots.append(f'{directory}/{os.path.basename(plot_path)}')

        response_data = {
            "message": "Modelo LinearDiscriminant criado",
            "Name": "Distancia Minima",
            "Model": model,
            "Train": train,
            "Precision": precision,
            "Plots": plots
        }

        return jsonify(response_data)
    else:
        return jsonify({"message": "Invalid data"}), 400
    
@app.route('/api/bayesclassifier', methods=['GET'])


def get_bayesClassifier():
    global capture, bayesClassifier, colors

    if capture.data is not None:
        bayesClassifier.setData(capture.x_train, capture.y_train, capture.feature)
        predictions = bayesClassifier.fit(capture.x_test)

        model =  convert_to_serializable(bayesClassifier.model)

        print("model",model)
        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ]
        print("train",train)
        directory = 'bayesClassifier'
        prepare_directory(directory)

        precision = bayesClassifier.pressure(capture.y_test, predictions, capture.feature).tolist()

        columns = list(capture.x_test.columns)
        plots = []

        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = bayesClassifier.plot(colors.getData(), col1, col2, predictions, f'{idx}')
            plots.append(f'{directory}/{os.path.basename(plot_path)}')

        response_data = {
            "message": "Modelo bayesClassifier criado",
            "Name": "Classificador de Bayes",
            "Model": model,
            "Train": train,
            "Precision": precision,
            "Plots": plots
        }

        return jsonify(response_data)
    else:
        return jsonify({"message": "Invalid data"}), 400

@app.route('/api/plots/<model>/<path:path>', methods=['GET'])
def send_plot(model, path):
    return send_from_directory(model, path)


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
        colors.setData(len(capture.y_train.unique()))
        
        models =["minimumdistanceclassifier","bayesclassifier"]
        return jsonify({"message": "File successfully uploaded", "filename": fixed_filename, "data": capture.getData().to_dict(orient='records'), "models": models}), 200
    else:
        return jsonify({"message": "Invalid file type"}), 400

if __name__ == '__main__':
    #app.run(debug=True, port=port)
    app.run(debug=True)