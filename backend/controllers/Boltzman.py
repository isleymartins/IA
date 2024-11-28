import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix
from flask import Flask, request, jsonify
from itertools import combinations

app = Flask(__name__)

from sklearn.preprocessing import MinMaxScaler

class Boltzman:
    def __init__(self, n_visible=None, n_hidden=None, learning_rate=0.1, epochs=100):
        # Inicialização conforme descrito
        self.model = None
        self.matrixConfusion = None
        self.n_visible = n_visible
        self.n_hidden = n_hidden
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.weights = None
        self.hidden_bias = None
        self.visible_bias = None
        self.training_history = {'weights': [], 'hidden_bias': [], 'visible_bias': []}
        self.scaler = MinMaxScaler()  # Usando o MinMaxScaler

    def initialize_parameters(self, n_visible):
        self.n_visible = n_visible
        self.n_hidden = self.n_hidden or n_visible
        self.weights = np.zeros((self.n_visible, self.n_hidden))
        self.hidden_bias = np.zeros(self.n_hidden)
        self.visible_bias = np.zeros(self.n_visible)

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def propagar_frente(self, v):
        hidden_probs = self.sigmoid(np.dot(v, self.weights) + self.hidden_bias)
        return hidden_probs
    
    def propagar_tras(self, h):
        visible_probs = self.sigmoid(np.dot(h, self.weights.T) + self.visible_bias)
        return visible_probs

    def train(self, x_train, y_train, feature):
        dataGroup = pd.concat([x_train.reset_index(drop=True), y_train.reset_index(drop=True)], axis=1).values
        dataGroup = self.scaler.fit_transform(dataGroup)  # Normalizando os dados de treino

        if self.weights is None or self.hidden_bias is None or self.visible_bias is None or self.n_hidden is None:
            self.initialize_parameters(dataGroup.shape[1])

        for epoch in range(self.epochs):
            h_prob = self.propagar_frente(dataGroup)
            h_states = (h_prob > np.random.rand(h_prob.shape[0], h_prob.shape[1])).astype(float)

            v_rec_prob = self.propagar_tras(h_states)
            h_rec_prob = self.propagar_frente(v_rec_prob)

            positive_grad = np.dot(dataGroup.T, h_prob)
            negative_grad = np.dot(v_rec_prob.T, h_rec_prob)

            self.weights += self.learning_rate * (positive_grad - negative_grad)
            self.hidden_bias += self.learning_rate * np.mean(h_prob - h_rec_prob, axis=0)
            self.visible_bias += self.learning_rate * np.mean(dataGroup - v_rec_prob, axis=0)

            self.training_history['weights'].append(self.weights.copy())
            self.training_history['hidden_bias'].append(self.hidden_bias.copy())
            self.training_history['visible_bias'].append(self.visible_bias.copy())

        return {'weights': self.weights, 'hidden_bias': self.hidden_bias, 'visible_bias': self.visible_bias}

    def fit(self, X_test, y_test):
        data = pd.concat([X_test.reset_index(drop=True), y_test.reset_index(drop=True)], axis=1)
        # data = pd.concat([X_test.reset_index(drop=True), pd.Series([0] * len(X_test), name='Extra_Column')], axis=1)
        dataGroup = data.values
        # Normalizar dados de teste
        X_test_normalized = (dataGroup - dataGroup.min()) / (dataGroup.max() - dataGroup.min()) # Normalizando os dados de teste

        #print("*#",len(X_test_normalized ))
        hidden_probs = self.propagar_frente(X_test_normalized)
        
        output_df = pd.DataFrame(X_test,  columns=[i for i in X_test.columns] + ['Prediction'])
        # print("*",output_df)
        output_df['Prediction'] = np.argmax(hidden_probs, axis=1)+1
        
        return output_df

    def pressure(self, y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'prediction' não está presente em result"
        
        self.matrixConfusion = confusion_matrix(y_test, result['Prediction'])
        classes = sorted(set(y_test) | set(result['Prediction']))
        df_matrixConfusion = pd.DataFrame(self.matrixConfusion, index=classes, columns=classes)
        
        formatted_matrix = [
            {feature: row, **{col: int(df_matrixConfusion.at[row, col]) for col in classes}} for row in classes
        ]
        
        return formatted_matrix


    def plot(self, colors, columnX, columnY, x_test, classifications, index, folder):
        result = x_test.copy()
        # Use o backend "Agg" para evitar problemas de GUI
        plt.switch_backend('Agg')

        # Plotar resultados
        plt.figure(figsize=(10, 6))

        for idx, (key, tipo) in enumerate(classifications.items()):
            # print("model",idx, "tipo", tipo, "Key",key)
            plt.scatter(
                result[result['Prediction'] == tipo][columnX],
                result[result['Prediction'] == tipo][columnY],
                color=colors[idx],
                alpha=0.8,
                label=tipo
            )

        plt.title(f'Classificação Bolzman {len(colors)} Classes - Plot {index}')
        plt.xlabel(columnX)
        plt.ylabel(columnY)
        plt.legend()
        plt.grid(True)
        
        image_path = f'{folder}/plot_{index}.png'
        plt.savefig(image_path)
        plt.close()
        return image_path
    
    def getData(self):
        return self.model
    
    def setData(self, x_train, y_train, feature):
        #Dados de treinamento
        self.model = self.train(x_train, y_train, feature)

    def getMatrizConfusion(self):
        return self.matrixConfusion
