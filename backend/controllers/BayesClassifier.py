#Imports
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.metrics import confusion_matrix
from math import exp, pi,sqrt,log
from numpy.linalg import inv, det
#import statsmodels.stats.inter_rater as irr

class BayesClassifier:
     #agrupando dados
    def __init__(self):
        #Dados de treinamento
        self.model = None
        # lista de classes definidos no treinamento
        self.typeClass = None

    #agrupando dados
    def train(self, x_train, y_train):
        # Responsável por guardar média, desvio padrão e probabilidade
        trainingMatrix = []

        # DataFrame que combina x_train e y_train
        dataGroup = pd.concat([x_train.reset_index(drop=True), y_train.reset_index(drop=True)], axis=1)

        # Agrupando o DataFrame com base nos valores da coluna 'Species'
        grouped = dataGroup.groupby('Species')

        # Tamanho da amostra total
        tamanho_amostra_total = len(dataGroup)

        # Iterando sobre cada grupo
        for species, group in grouped:
            # Obtendo o número de linhas e colunas
            lin, col = group.shape

            # Inicializando listas para guardar média
            media = []

            # Iterando sobre cada característica (coluna)
            for feature in range(col-1):  # -1 para não incluir a coluna 'Species'
                feature_values = group.iloc[:, feature]  # Obtemos todos os valores da coluna da característica
                media.append(feature_values.mean())  # Calculando a média

            matriz_cov = np.cov(group.iloc[:, :-1], rowvar=False)

            # Tamanho da amostra do grupo atual
            tamanho_amostra = len(group)
            probClasse = tamanho_amostra / tamanho_amostra_total

            # Adicionando os resultados à matriz de treinamento
            trainingMatrix.append([media, probClasse, matriz_cov])

        # Exibindo a matriz de treinamento
        print(trainingMatrix)
        return trainingMatrix
    
    #Predizer
    def fit(self,x_test):
        # tabela extraida do teste 30% sem Species
        data =  x_test.copy()

       #Predizer
    def fit(self, x_test):
        # tabela extraida do teste 30% sem Species
        data = x_test.copy()
        # Função de predição
        def prediction(x_test, trainingMatrix):
            results = []
            for x in x_test:
                discriminants = []
                for class_params in trainingMatrix:
                    mean, prior, cov = class_params
                    d = discriminant(x, prior, np.array(mean), cov)
                    discriminants.append(d)
                results.append(np.argmax(discriminants) + 1)
            return results
        # Fazendo a predição
        predData = prediction(np.array(data), self.model)
        result = pd.DataFrame(np.column_stack((np.array(data), predData)), columns=["Sepal length","Sepal width","Petal length","Petal width","Prediction"])
        #Resultado com dados em dataframe
        return result
    
    # Acerto
    @staticmethod
    def pressure(y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'Prediction' não encontrada em result"
        matrixConfusion = confusion_matrix(y_test.to_frame(name=feature), result['Prediction'])
        return matrixConfusion

    def plot(self, colors, columnX, columnY, x_test, index):
        result = x_test.copy()

        # Verifique se 'Prediction' está presente no DataFrame
        if 'Prediction' not in result.columns:
            raise KeyError("A coluna 'Prediction' não está presente em dataResult")

        # Use o backend "Agg" para evitar problemas de GUI
        plt.switch_backend('Agg')

        # Agrupando por 'Species'
        groupedPred = result.groupby('Prediction')

        # Criando o gráfico
        plt.figure(figsize=(10, 6))

        tipos = list(substituicoes.keys())

        # Iterando sobre cada grupo e plotando
        for species, group in groupedPred:
            media = group['Sepal length'].mean()
            desvio_padrao = group['Sepal length'].std()

            # Plotando a distribuição
            plt.hist(group['Sepal length'], density=True, alpha=0.6, label=f'{tipos[int(species)-1]} (μ={media:.2f}, σ={desvio_padrao:.2f})')

            # Adicionando a curva da distribuição normal
            xmin, xmax = plt.xlim()
            x = np.linspace(xmin, xmax, 100)

            # Padrão gaussiano
            p = np.exp(-0.5 * ((x - media) / desvio_padrao)**2) / (desvio_padrao * np.sqrt(2 * np.pi))

            plt.plot(x, p, linewidth=2)

        plt.xlabel('Sepal length')
        plt.ylabel('Density')
        plt.legend()
        plt.grid(True)

        directory = 'bayesClassifier'
    
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
    
    def setData(self,x_train, y_train):
        #Dados de treinamento
        self.model = self.train(x_train, y_train)
        # lista de classes definidos no treinamento
        self.typeClass = self.model.index.tolist()


    # Função para calcular a distância discriminante dj(x) para a classe j
    def discriminant(x, prior, mean, cov):
        # Calcular a ln(P(Cj)) - logaritmo da probabilidade a priori da classe
        term1 = log(prior)

        # Calcular -1/2 * |Σj| - Determinante da matriz de covariância
        term2 = -0.5 * log(det(cov))

        # Calcular -1/2 * (x - mj)^T Σj^-1 (x - mj) - Distância de Mahalanobis
        diff = x - mean
        term3 = -0.5 * np.dot(np.dot(diff.T, inv(cov)), diff)

        # Retornar o valor da função discriminante
        return term1 + term2 + term3

    # x = caracteristicas ->[x,x,x,x]
    # mean = medias das caracteristicas->[mean,mean,mean,mean]
    # calculo: di(x)=x^t*mean-1/2*mean^t*mean

    '''def norma_euclidiana(self, x, mean):
        # Substitui NaNs por 0.0
        x = np.nan_to_num(x)  
        mean = np.nan_to_num(mean)  

        p1 =  self.multiplicacao(x,mean)
        p2 =  -0.5*np.array(self.multiplicacao(mean,mean))
        return p1+p2

    # Multiplicação entre as caracteristicas
    @staticmethod
    def multiplicacao(arrayA, arrayB):
        result = 0
        for i in range(len(arrayA)):
            result += arrayA[i] * arrayB[i]
        return result'''
    