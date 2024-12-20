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
        self.matrixConfusion = None

    #agrupando dados
    def train(self, x_train, y_train, feature):
        # Responsável por guardar média, desvio padrão e probabilidade
        trainingMatrix = []
        # DataFrame que combina x_train e y_train
        dataGroup = pd.concat([x_train.reset_index(drop=True), y_train.reset_index(drop=True)], axis=1)
        # Agrupando o DataFrame com base nos valores da coluna 'Species'
        grouped = dataGroup.groupby(feature)
        # Tamanho da amostra total
        tamanho_amostra_total = len(dataGroup)
        # Iterando sobre cada grupo
        for species, group in grouped:
            # Obtendo o número de linhas e colunas
            lin, col = group.shape
            # Inicializando listas para guardar média
            media = []
            # Iterando sobre cada característica (coluna)
            for feature_index in range(col-1):  # -1 para não incluir a coluna 'Species'
                feature_values = group.iloc[:, feature_index]  # Obtemos todos os valores da coluna da característica
                media.append(feature_values.mean())  # Calculando a média
            matriz_cov = np.cov(group.iloc[:, :-1], rowvar=False)
            # Tamanho da amostra do grupo atual
            tamanho_amostra = len(group)
            probClasse = tamanho_amostra / tamanho_amostra_total
            # Adicionando os resultados à matriz de treinamento
            trainingMatrix.append({
                "mean": media,
                "probClass": probClasse,
                "matrix_cov": matriz_cov,
                feature: species
            })
        # Exibindo a matriz de treinamento
        return trainingMatrix

    #Predizer
    def fit(self, x_test):
        # tabela extraida do teste
        data = x_test.copy()
        
        # Função de predição
        def prediction(x_test, trainingMatrix):
            results = []
            for x in x_test:
                discriminants = []
                for class_params in trainingMatrix:
                    mean = class_params["mean"]
                    prior = class_params["probClass"]
                    cov = class_params["matrix_cov"]
                    d = self.discriminant(x, prior, np.array(mean), cov)
                    discriminants.append(d)
                results.append(np.argmax(discriminants) + 1)
            return results
        
        # Fazendo a predição
        predData = prediction(np.array(data), self.model)
        
        # Extrair colunas de x_test e adicionar "Prediction"
        columns = list(data.columns) + ["Prediction"]
        
        # Resultado com dados em dataframe
        result = pd.DataFrame(np.column_stack((np.array(data), predData)), columns=columns)

        return result

    
    # Acerto
    def pressure(self,y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'Prediction' não encontrada em result"
        
        # Calcular a matriz de confusão
        matrixConfusion = confusion_matrix(y_test.to_frame(name=feature), result['Prediction'])

        self.matrixConfusion = matrixConfusion
        
        # Obter os tipos de classes
        classes = sorted(set(y_test.to_frame(name=feature)[feature]) | set(result['Prediction']))
        
        # Criar um DataFrame com rótulos nas linhas e colunas
        df_matrixConfusion = pd.DataFrame(matrixConfusion, index=classes, columns=classes)
        
        # Converter o DataFrame para um dicionário onde cada item na lista é um dicionário com as classes como chaves
        formatted_matrix = [
            {feature: row, **{col: int(df_matrixConfusion.at[row, col]) for col in classes}} for row in classes
        ]
        
        return formatted_matrix




    def plot(self, colors, columnX, columnY, x_test, classifications, index, folder):
        result = x_test.copy()
        '''if 'Prediction' not in result.columns:
            raise KeyError("A coluna 'Prediction' não está presente em result")

        plt.switch_backend('Agg')
        
        groupedPred = result.groupby('Prediction')
        
        plt.figure(figsize=(10, 6))
        tipos = list(groupedPred.groups.keys())  # Pegando os valores únicos em 'Prediction'
        
        for species, group in groupedPred:
            media = group['Sepal length'].mean()
            desvio_padrao = group['Sepal length'].std()
            
            plt.hist(group['Sepal length'], density=True, alpha=0.6, label=f'{tipos[int(species)-1]} (μ={media:.2f}, σ={desvio_padrao:.2f})')
            
            xmin, xmax = plt.xlim()
            x = np.linspace(xmin, xmax, 100)
            
            p = np.exp(-0.5 * ((x - media) / desvio_padrao)**2) / (desvio_padrao * np.sqrt(2 * np.pi))
            plt.plot(x, p, linewidth=2)
        
        plt.xlabel('Sepal length')
        plt.ylabel('Density')
        plt.legend()
        plt.grid(True)'''


        result = x_test.copy()
        # Use o backend "Agg" para evitar problemas de GUI
        plt.switch_backend('Agg')

        # Criar uma grade de pontos
        x_min, x_max = result[columnX].min() - 1, result[columnX].max() + 1
        y_min, y_max = result[columnY].min() - 1, result[columnY].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.01), np.arange(y_min, y_max, 0.01))

        # Plotar resultados
        plt.figure(figsize=(10, 6))

        for idx, (key, tipo) in enumerate(classifications.items()):
            #print("model",idx, "tipo", tipo)
            plt.scatter(
                result[result['Prediction'] == tipo][columnX],
                result[result['Prediction'] == tipo][columnY],
                color=colors[idx],
                alpha=0.8,
                label=tipo
            )

        plt.title(f'Classificação por Bayes com {len(colors)} Classes - Plot {index}')
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

    def setData(self,x_train, y_train, feature):
        #Dados de treinamento
        self.model = self.train(x_train, y_train, feature)
        # lista de classes definidos no treinamento
        self.typeClass = self.model

    def getMatrizConfusion(self):
        return self.matrixConfusion


    @staticmethod
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

    
    