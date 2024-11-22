from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from controllers import MinimumDistanceClassifier, BayesClassifier, RandomColors, Capture, QualityMetrics  # Importando diretamente do pacote controllers
import os
import shutil
from itertools import combinations
import pandas as pd

# Porta do localhost
port = os.getenv('PORT', 5000)

app = Flask(__name__)

# Habilita CORS para todas as rotas
CORS(app)  

# Variáveis globais
capture = Capture()
colors = RandomColors()
minimumDistanceClassifier = MinimumDistanceClassifier()
bayesClassifier = BayesClassifier()
directory = 'image/'

# Mapeamento de strings para objetos
model_map = { 
    'minimumdistanceclassifier': minimumDistanceClassifier, 
    'bayesclassifier': bayesClassifier
    }
#Cria/remove a pasta do diretorio e seus elementos
def prepare_directory(directory):
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory)

#Nescessario para ser possivel passar dados via json
def convert_to_serializable(model, capture,attributes):
    for item in model:
        # Converte os valores de `mean` em um dicionário de atributos
        item['mean'] = {attributes[i]: float(value) for i, value in enumerate(item['mean'])}
        item['matrix_cov'] = item['matrix_cov'].tolist()
        item[capture.feature] = capture.transcribe(pd.Series([item[capture.feature]]))[0]
    
    return model


# Rotas

#Rotas iniciais
@app.route('/api', methods=['GET'])
def home():
    return jsonify({"message": "Bem-vindo à API!"})

@app.route('/api/data', methods=['GET'])
def getData():
    global capture
    if capture.getData() is None:
        return jsonify({"message": "No data available"}), 400
    return jsonify(capture.getData().to_dict(orient='records'))

#Captura os dados da request
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

        # Captura os valores de classColumn e testSize
        feature = request.form['feature']
        # Converte para um valor de 0 a 1
        testCase = float(request.form['testCase']) / 100  

        # Inicializa a instância da classe `Capture` e usar setData e shareData
        capture.setData(file, feature, file_extension)
        capture.shareData(feature, testCase)
        colors.setData(len(capture.y_train.unique()))

        models = ["minimumdistanceclassifier", "bayesclassifier"]
        return jsonify({"message": "O arquivo foi passado corretamente", "data": len(capture.getData().to_dict(orient='records')),"test": len(capture.y_test), "models": models}), 200
    else:
        return jsonify({"message": "Invalid file type"}), 400
    
#Rotas de prediçoes

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

        model = [
            {f"{capture.feature}": species, **features}
            for species, features in minimumDistanceClassifierModel.transpose().items()
        ]
        
        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ]
        folder = f'{directory}minimumDistanceClassifier'
        prepare_directory(folder)

        #Matriz de confusao
        precision = minimumDistanceClassifier.pressure(capture.transcribe(capture.y_test), predictions, capture.feature)

        columns = list(capture.x_test.columns)
        plots = []

        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = minimumDistanceClassifier.plot(colors.getData(), col1, col2, predictions, capture.getClassifications(), f'{idx}', folder)
            plots.append(plot_path)

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

        #Modelo
        model =  convert_to_serializable(bayesClassifier.getData(),capture,capture.getData().columns)
      
        train = [
            {**features}
            for species, features in predictions.transpose().items()
        ]

        folder = f'{directory}bayesClassifier'
        prepare_directory(folder)

        precision =bayesClassifier.pressure(capture.transcribe(capture.y_test), predictions, capture.feature)

        #Possibilidade de itens para combinação
        columns = list(capture.x_test.columns)
        plots = []

        #combinação dos atributos
        for idx, (col1, col2) in enumerate(combinations(columns, 2)):
            plot_path = bayesClassifier.plot(colors.getData(), col1, col2, predictions, capture.getClassifications(), f'{idx}', folder)
            plots.append(plot_path)

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
    
#Rotas utils

#Rotas de vizualizacao de plots
@app.route('/api/plots/<model>/<path:path>', methods=['GET'])
def send_plot(model, path):
    return send_from_directory(model, path)

@app.route('/api/metrics/<model1>/<model2>', methods=['GET'])
def metrics_model(model1, model2):
    # Verificar se os modelos passados existem no mapeamento
    if model1.lower() not in model_map or model2.lower() not in model_map:
        return jsonify({"error": "Model not found"}), 400 
    
    # Obter os objetos correspondentes
    model_1 = model_map[model1.lower()]
    model_2 = model_map[model2.lower()]

    # Obter matrizes de confusão
    matrix_confusion1 = model_1.getMatrizConfusion()
    matrix_confusion2 = model_2.getMatrizConfusion()

    # Função para calcular todas as métricas
    def calcular_metricas(matrix_confusion):
        
        if capture.getClassifications() is not None and len(matrix_confusion) > 0:
            # Obter a lista de classes traduzidas (ex: nomes originais das classes)
            classes = capture.getClassifications()
            # Obter acurácias do produtor e usuário
            producer_accuracies = QualityMetrics.producer_accuracy(matrix_confusion)
            user_accuracies = QualityMetrics.user_accuracy(matrix_confusion)

            # Criar dicionários para associar classes aos valores
            producer_accuracy = {classes[i+1]: producer_accuracies[i] for i in range(len(producer_accuracies))}
            user_accuracy = {classes[i+1]: user_accuracies[i] for i in range(len(user_accuracies))}
            
            return {
                "Producer accuracy": producer_accuracy,
                "User accuracy": user_accuracy,
                "Global accuracy": QualityMetrics.global_accuracy(matrix_confusion),
                "Causal accuracy": QualityMetrics.causal_accuracy(matrix_confusion),
                "Kappa coefficient": QualityMetrics.kappa_coefficient(matrix_confusion),
                "Var kappa coefficient": QualityMetrics.var_kappa_coefficient(matrix_confusion),
                "Var kappa coefficient_advanced": QualityMetrics.var_kappa_coefficient_advanced(matrix_confusion),
                "Precision": QualityMetrics.precision(matrix_confusion),
                "Recall": QualityMetrics.recall(matrix_confusion),
                "F Score 1/2": QualityMetrics.f_score(0.5, matrix_confusion),
                "F Score 1": QualityMetrics.f_score(1, matrix_confusion),
                "F Score 2": QualityMetrics.f_score(2, matrix_confusion)
            }
        else:
            return None
    
    # Calcular métricas para os dois modelos
    metrics1 = calcular_metricas(matrix_confusion1)
    metrics2 = calcular_metricas(matrix_confusion2)

    # Ajustar a estrutura das métricas para o formato desejado
    metrics_output = [
        {"Quality Metrics": metric, f"{model1}": metrics1[metric], f"{model2}": metrics2[metric]}
        for metric in metrics1
    ]
    # Calcular hipótese
    alpha = 0.05
    hipotese = {"Hipotese": QualityMetrics.significanceTest(
        metrics1["Kappa coefficient"],
        metrics2["Kappa coefficient"],
        metrics1["Var kappa coefficient"],
        metrics2["Var kappa coefficient"],
        len(capture.x_test),
        alpha
    )}
        
    # Criar resposta
    response_data = {
        "message": "Modelo LinearDiscriminant criado",
        "Name": "Distancia Minima",
        "Metrics": metrics_output,
        "Hipotese": hipotese
    }
        
    return jsonify(response_data)




if __name__ == '__main__':
    app.run(debug=True)