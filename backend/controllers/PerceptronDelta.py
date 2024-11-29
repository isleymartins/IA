import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix
from flask import Flask, request, jsonify
from itertools import combinations

class PerceptronDelta:
    def __init__(self, learning_rate=0.01, epochs=100):
        #Objeto com o modelo
        self.models = []
        #Taxa de aprendizado
        self.learning_rate = learning_rate
        #Epocas
        self.epochs = epochs
        #Inicializa com None
        self.matrixConfusion = None

    def activation_function(self, x):
        # Ativação da sigmoid
        return 1 / (1 + np.exp(-x))

    def activation_derivative(self, x):
        # Funcao derivada de 1 / (1 + np.exp(-x))
        sigmoid = self.activation_function(x)
        return sigmoid * (1 - sigmoid)

    def predict(self, x):
        predictions = []

        for xi in x.values:
            class_scores = [np.dot(xi, model["weights"]) + model["bias"] for model in self.models]
            #Pegar a classe com maior pontuacao
            predicted_class = self.classes[np.argmax(class_scores)]
            predictions.append(predicted_class)

        x = x.copy()
        x['Prediction'] = predictions
        return x

    def train(self, x_train, y_train, class_label):
        #Inicialização dos pesos e bias
        weights = np.zeros(x_train.shape[1])
        bias = 0

        for _ in range(self.epochs):
            for xi, target in zip(x_train.values, y_train):
                binary_target = 1 if target == class_label else 0

                # Previsão e gradiente
                net_input = np.dot(xi, weights) + bias
                output = self.activation_function(net_input)
                error = binary_target - output
                gradient = error * self.activation_derivative(net_input)

                # Atualização dos pesos e viés
                weights += self.learning_rate * gradient * xi
                bias += self.learning_rate * gradient

        return {"weights": weights, "bias": bias}

    def train_multiclass(self, x_train, y_train):
        self.models = []
        self.classes = np.unique(y_train)

        for class_label in self.classes:
            model = self.train(x_train, y_train, class_label)
            self.models.append(model)

    def fit(self, x_test):
        return self.predict(x_test)

    def pressure(self, y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'Prediction' não está presente em result"

        self.matrixConfusion = confusion_matrix(y_test, result['Prediction'])
        classes = sorted(set(y_test) | set(result['Prediction']))
        df_matrixConfusion = pd.DataFrame(self.matrixConfusion, index=classes, columns=classes)

        formatted_matrix = [
            {feature: row, **{col: int(df_matrixConfusion.at[row, col]) for col in classes}} for row in classes
        ]

        return formatted_matrix

    def plot(self, colors, columnX, columnY, x_test, classifications, index, folder):
        result = x_test.copy()
        plt.switch_backend('Agg')

        # Criar uma grade de pontos
        x_min, x_max = result[columnX].min() - 1, result[columnX].max() + 1
        y_min, y_max = result[columnY].min() - 1, result[columnY].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.01), np.arange(y_min, y_max, 0.01))

        # Plotar resultados
        plt.figure(figsize=(10, 6))

        for idx, (key, tipo) in enumerate(classifications.items()):
            plt.scatter(
                result[result['Prediction'] == tipo][columnX],
                result[result['Prediction'] == tipo][columnY],
                color=colors[idx],
                alpha=0.8,
                label=tipo
            )

        plt.title(f'Classificação por Perceptron com {len(colors)} Classes - Plot {index}')
        plt.xlabel(columnX)
        plt.ylabel(columnY)
        plt.legend()
        plt.grid(True)

        image_path = f'{folder}/plot_{index}.png'
        plt.savefig(image_path)
        plt.close()
        return image_path

    def getData(self):
        return self.models

    def setData(self, x_train, y_train):
        self.train_multiclass(x_train, y_train)

    def getMatrizConfusion(self):
        return self.matrixConfusion

