#Imports
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.metrics import confusion_matrix
from flask import send_file, jsonify
import io

class MinimumDistanceClassifier:
     #agrupando dados
    def __init__(self):
        #Dados de treinamento
        self.model = None
        # lista de classes definidos no treinamento
        self.typeClass = None

    #agrupando dados
    def train(self, x_train, y_train, feature):
        #agrupando dados de treinamento
        dataGroup = pd.concat([x_train.reset_index(drop=True), y_train.reset_index(drop=True)], axis=1)

        # media dos dados de treinamento
        dataMean = dataGroup.groupby(feature).mean()

        # Criando array com as medias numPy
        # mean = np.array(dataMean)

        #Medias em dataframe
        return dataMean
    
    #Predizer
    def fit(self,x_test):
        # tabela extraida do teste 30% sem Species
        dataResult =  x_test.copy()

        # captura de dados por linhas da tabela teste
        for _, row in dataResult.iterrows():

            # resultado da norma euclidiana por tipo
            results = []

            # tirando Species
            x = np.array(row)
            
            # captura das medias do treinamento
            for i in self.model.values:
                prediction = self.norma_euclidiana(x, i)
                results.append(prediction)

            # Definir as classes com base em da norma euclidiana
            if results[0] - results[1] >= 0:
                index = 0 # Classe 1
            else:
                if(results[1] - results[2]>=0):
                    index = 1 # Classe 2
                else:
                    index = 2 # Classe 3

            # acrescentando novas colunas com a suposta Species
            dataResult.loc[_,'Prediction'] = self.typeClass[index]
            #dataResult.loc[_,'Prediction Mean'] = prediction
        
        #Resultado com dados em dataframe
        return dataResult
    
    # Acerto
    @staticmethod
    def pressure(y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'Prediction' não encontrada em result"
        matrixConfusion = confusion_matrix(y_test.to_frame(name=feature), result['Prediction'])
        return matrixConfusion

    def plot(self, colors, columnX, columnY, x_test, index):
        dataResult = x_test.copy()
        
        # Verifique se 'Prediction' está presente no DataFrame
        if 'Prediction' not in dataResult.columns:
            raise KeyError("A coluna 'Prediction' não está presente em dataResult")

        # Use o backend "Agg" para evitar problemas de GUI
        plt.switch_backend('Agg')

        # Criar uma grade de pontos
        x_min, x_max = dataResult[columnX].min() - 1, dataResult[columnX].max() + 1
        y_min, y_max = dataResult[columnY].min() - 1, dataResult[columnY].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.01), np.arange(y_min, y_max, 0.01))

        # Calcular a distância aos centroides
        centroids = self.model[[columnX, columnY]].values
        distances = np.zeros((xx.shape[0], xx.shape[1], centroids.shape[0]))
        for i, centroid in enumerate(centroids):
            distances[:, :, i] = np.sqrt((xx - centroid[0])**2 + (yy - centroid[1])**2)

        # Determinar a classe mais próxima
        Z = np.argmin(distances, axis=2)

        # Plotar resultados
        plt.figure(figsize=(10, 6))

        for idx, tipo in enumerate(self.typeClass):
            plt.scatter(
                dataResult[dataResult['Prediction'] == tipo][columnX],
                dataResult[dataResult['Prediction'] == tipo][columnY],
                color=colors[idx],
                alpha=0.8,
                label=tipo
            )

        plt.contourf(xx, yy, Z, alpha=0.2, colors=colors, levels=[-0.5, 0.5, 1.5, 2.5])
        plt.scatter(self.model[columnX], self.model[columnY], c='black', marker='x', s=100, label='Centroides')

        plt.title(f'Classificação por Distância com 3 Classes - Plot {index}')
        plt.xlabel(columnX)
        plt.ylabel(columnY)
        plt.legend()
        plt.grid(True)

        directory = 'minimumDistanceClassifier'
    
        image_path = f'{directory}/plot_{index}.png'
        plt.savefig(image_path)
        plt.close()
        return image_path

        '''/*img = io.BytesIO()
        plt.savefig(img, format='png')
        plt.close()  # Fecha a figura para liberar memória
        img.seek(0)

        return send_file(img, mimetype='image/png')'''

    
    def getData(self):
        return self.model
    
    def setData(self,x_train, y_train, feature):
        #Dados de treinamento
        self.model = self.train(x_train, y_train, feature)
        # lista de classes definidos no treinamento
        self.typeClass = self.model.index.tolist()


    # Multiplicação entre as caracteristicas
    @staticmethod
    def multiplicacao(arrayA, arrayB):
        result = 0
        for i in range(len(arrayA)):
            result += arrayA[i] * arrayB[i]
        return result

    # x = caracteristicas ->[x,x,x,x]
    # mean = medias das caracteristicas->[mean,mean,mean,mean]
    # calculo: di(x)=x^t*mean-1/2*mean^t*mean

    def norma_euclidiana(self, x, mean):
        # Substitui NaNs por 0.0
        x = np.nan_to_num(x)  
        mean = np.nan_to_num(mean)  

        p1 =  self.multiplicacao(x,mean)
        p2 =  -0.5*np.array(self.multiplicacao(mean,mean))
        return p1+p2
