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

#Cria/remove a pasta do diretorio e seus elementos
def prepare_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

#Nescessario para ser possivel passar dados via json
def convert_to_serializable(model, capture):
    for item in model:
        item['mean'] = [float(x) for x in item['mean']]
        item['matrix_cov'] = item['matrix_cov'].tolist()
        item[capture.feature] = capture.transcribe(pd.Series([item[capture.feature]]))[0]
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

#Rota do algoritmo distancia minima
@app.route('/api/minimumdistanceclassifier', methods=['GET'])
def get_linear_discriminant():
    global capture, minimumDistanceClassifier, colors
    #Verifica se tem dados
    if capture.data is not None:
        #Faz o modelo com os dados
        minimumDistanceClassifier.setData(capture.x_train, capture.y_train, capture.feature)
        #Predicao
        predictions = minimumDistanceClassifier.fit(capture.x_test)

        #Passar as classes em nome original
        predictions["Prediction"] = capture.transcribe(predictions["Prediction"])
        
        #Passar as classes em nome original sem afetar o modelo
        modelTradution = capture.transcribe(pd.Series(minimumDistanceClassifier.getData().index))
        minimumDistanceClassifierModel = minimumDistanceClassifier.getData().copy()
        minimumDistanceClassifierModel.index = modelTradution

        print(modelTradution)
        model = [
            {f"{capture.feature}": species, **features}
            for species, features in minimumDistanceClassifierModel.transpose().items()
        ]
        # Aplicando a tradução reversa ao modelo for item in model: item["Species"] = obj.reverse_transcribe(pd.Series([item["Species"]]))[0]

        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ]

        directory = 'minimumDistanceClassifier'
        prepare_directory(directory)

        #Matriz de comfusao
        precision = minimumDistanceClassifier.pressure(capture.transcribe(capture.y_test), predictions, capture.feature)

        columns = list(capture.x_test.columns)
        plots = []

        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = minimumDistanceClassifier.plot(colors.getData(), col1, col2, predictions, capture.getClassifications(), f'{idx}')
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

#Rota do algoritmo do classificador de Bayes
@app.route('/api/bayesclassifier', methods=['GET'])

def get_bayesClassifier():
    global capture, bayesClassifier, colors
    #Verifica se tem dados
    if capture.data is not None:
        #Faz o modelo com os dados
        bayesClassifier.setData(capture.x_train, capture.y_train, capture.feature)
        #Predicao
        predictions = bayesClassifier.fit(capture.x_test)
        predictions["Prediction"]=capture.transcribe(predictions["Prediction"])


        model =  convert_to_serializable(bayesClassifier.getData(),capture)
      
        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ] 
        
        directory = 'bayesClassifier'
        prepare_directory(directory)

        precision = bayesClassifier.pressure(capture.transcribe(capture.y_test), predictions, capture.feature)

        #Possibilidade de itens para combinação
        columns = list(capture.x_test.columns)
        plots = []

        #combinação dos atributos
        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = bayesClassifier.plot(colors.getData(), col1, col2, predictions, capture.getClassifications(), f'{idx}')
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

#Rotas de vizualizacao de plots
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