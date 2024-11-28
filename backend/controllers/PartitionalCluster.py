from sklearn.cluster import KMeans
import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.metrics import calinski_harabasz_score
import numpy as np

class PartitionalCluster:
    def __init__(self):
        self.data = None
        self.values_k = []
        self.kmeans_k = []
    
    def train(self, data, test_k):
        calinski_scores = []   
        
        for i in range(1, test_k+1):
            kmeans = KMeans(n_clusters=i, init='k-means++', random_state=0).fit(data)
            self.values_k.append(i)
            self.kmeans_k.append(kmeans)
        
        for i in range(2, test_k):
            score = calinski_harabasz_score(data, kmeans.labels_)
            calinski_scores.append(score)
            
        return np.argmax(calinski_scores) + 2
    
    def plot(self,colors, index, folder):
    
        # Criar uma nova figura para cada valor de k
        fig, ax = plt.subplots(figsize=(10, 6))
            
         # Obter labels e centroides do modelo atual
        labels = self.kmeans_k[index].labels_
        centroids = self.kmeans_k[index].cluster_centers_
            
        # Plotar os pontos com cores de acordo com os labels
        ax.scatter(
            self.data.iloc[:, 0],
            self.data.iloc[:, 1],
            c=[colors[label % len(colors)] for label in labels]
        )
        # Plotar os centroides
        ax.scatter(centroids[:, 0], centroids[:, 1], c='black', marker='x')
            
        # Definir título para o gráfico
        ax.set_title(f'k={index+1}')
            
        # Salvar a figura e fechar para liberar memória
        image_path = f'{folder}/plot_{index}.png'
        plt.savefig(image_path)
        plt.close(fig)
            
        
        return image_path  # Retorna o caminho da imagem geradas

    
    def getData(self):
        return self.data
    
    def setData(self, data, k):
        self.test_k = k
        self.data = data


