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
    
    def train(self, data, test_k, folder):
        calinski_scores = []
        
        # Treinamento dos modelos KMeans para cada número de clusters
        for i in range(1, test_k + 1):
            kmeans = KMeans(n_clusters=i, init='k-means++', random_state=0).fit(data)
            self.values_k.append(i)
            self.kmeans_k.append(kmeans)
        
        # Calcular o Calinski-Harabasz Score para cada número de clusters >= 2
        for kmeans in self.kmeans_k[1:]:  # Comece do modelo com k=2
            score = calinski_harabasz_score(data, kmeans.labels_)
            calinski_scores.append(score)
        
        print("¨¨", calinski_scores)

        # Plotar os scores
        fig, ax = plt.subplots()
        ax.plot(range(2, test_k + 1), calinski_scores)
        ax.set_title("Calinski-Harabasz Score vs Número de Clusters")
        ax.set_xlabel("Número de Clusters (k)")
        ax.set_ylabel("Calinski-Harabasz Score")
        
        # Salvar a figura e fechar para liberar memória
        image_path = f'{folder}/plot_{test_k + 1}.png'
        plt.savefig(image_path)
        plt.close(fig)
        
        # Retorna o número de clusters com o maior score e o caminho da imagem
        return np.argmax(calinski_scores) + 2, image_path

    
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


