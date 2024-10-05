#Imports
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.metrics import confusion_matrix

class LinearDiscriminant:
     #agrupando dados
    def __init__(self,x_train, y_train):
        #Dados de treinamento
        self.train = self.train(x_train, y_train)
        # lista de classes definidos no treinamento
        self.typeClass = self.train.index.tolist()

    #agrupando dados
    def train(self, x_train, y_train):
        #agrupando dados de treinamento
        dataGroup = pd.concat([x_train.reset_index(drop=True), y_train.reset_index(drop=True)], axis=1)

        # media dos dados de treinamento
        dataMean = dataGroup.groupby('Species').mean()

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
            for i in self.train.values:
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
            dataResult.loc[_,'Prediction Mean'] = prediction
        
        #Resultado com dados em dataframe
        return dataResult
    
    # Acerto
    def pressure(y_test,result):
        matrixConfusion = confusion_matrix(y_test['Species'], result['Prediction'])
        
        #Resultado em matriz
        return matrixConfusion

    def plot(self, colors, columnX, columnY, x_test):
        #Copia dos dados de teste
        dataResult =  x_test.copy()

        # Criar uma grade de pontos
        x_min, x_max = dataResult[columnX].min() - 1, dataResult[columnX].max() + 1
        y_min, y_max = dataResult[columnY].min() - 1, dataResult[columnY].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.01), np.arange(y_min, y_max, 0.01))

        # Calcular a distância aos centroides
        centroids = self.train[[columnX, columnY]].values
        distances = np.zeros((xx.shape[0], xx.shape[1], centroids.shape[0]))
        for i, centroid in enumerate(centroids):
            distances[:, :, i] = np.sqrt((xx - centroid[0])**2 + (yy - centroid[1])**2)

        # Determinar a classe mais próxima
        Z = np.argmin(distances, axis=2)

        # Plotar resultados
        plt.figure(figsize=(10, 6))

        # Filtrando, colocando legenda com sua classe e sua devida cor
        for index, tipo in enumerate(self.typeClass):
            plt.scatter(
                dataResult[dataResult['Prediction'] == tipo][columnX],
                dataResult[dataResult['Prediction'] == tipo][columnY],
                color=colors[index],
                alpha=0.8,
                label=tipo
            )

        # Plotar a superfície de separação
        plt.contourf(xx, yy, Z, alpha=0.2, colors=colors, levels=[-0.5, 0.5, 1.5, 2.5])

        # Plotar centroides (médias da característica desejada)
        plt.scatter(self.train[columnX], self.train[columnY], c='black', marker='x', s=100, label='Centroides')

        plt.title('Classificação por Distância com 3 Classes')
        plt.xlabel(columnX)
        plt.ylabel(columnY)
        plt.legend()
        plt.grid(True)

        #resultado da imagem
        return plt.show()
    
    def getData(self):
        return self.train
    
    def setData(self,x_train, y_train):
        #Dados de treinamento
        self.train = self.train(x_train, y_train)
        # lista de classes definidos no treinamento
        self.typeClass = self.train.index.tolist()

        return


    # Multiplicação entre as caracteristicas
    def multiplicacao(arrayA, arrayB):
        result = 0
        for i in range(arrayA.size):
            result += arrayA[i] * arrayB[i]
        return result

    # x = caracteristicas ->[x,x,x,x]
    # mean = medias das caracteristicas->[mean,mean,mean,mean]
    # calculo: di(x)=x^t*mean-1/2*mean^t*mean

    def norma_euclidiana(self, x, mean):
        p1 =  self.multiplicacao(x,mean)
        p2 =  -0.5*np.array(self.multiplicacao(mean,mean))
        return p1+p2
    def apresentacao():
        return "oi, LinearDiscriminant"
