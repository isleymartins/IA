from sklearn.cluster import KMeans
import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.metrics import calinski_harabasz_score
import numpy as np

class PartitionalCluster:
    def __init__(self):
        self.model= None

    def train(self, data, test_k, folder):
        self.model = {
            "values_k": [],
            "kmeans_k": [],
            "calinski_scores": []
        }
        # Treinamento dos modelos KMeans para cada número de clusters
        for i in range(1, test_k + 1):
            kmeans = KMeans(n_clusters=i, init='k-means++', random_state=0).fit(data)
            self.model["values_k"].append(i)
            self.model["kmeans_k"].append(kmeans)
        
        # Calcular o Calinski-Harabasz Score para cada número de clusters >= 2
        '''A métrica avalia a qualidade da separação dos clusters, 
        comparando a dispersão interna dos clusters com a dispersão entre clusters.
        Valores maiores indicam clusters mais definidos.'''

        for kmeans in self.model["kmeans_k"][1:]:  # Comece do modelo com k=2
           
            # Verificação do número de clusters distintos >1
            if len(np.unique(kmeans.labels_)) > 1: 
                score = calinski_harabasz_score(data, kmeans.labels_)
                self.model["calinski_scores"].append(score)
                
        return np.argmax(self.model["calinski_scores"]) + 2

    def calinski_score(self,folder):

        # Plotar os scores
        fig, ax = plt.subplots()
        ax.plot(range(2, 2 + len(self.model["calinski_scores"])), self.model["calinski_scores"])
        ax.set_title("Calinski-Harabasz Score vs Número de Clusters")
        ax.set_xlabel("Número de Clusters (k)")
        ax.set_ylabel("Calinski-Harabasz Score")
        
        # Salvar a figura e fechar para liberar memória
        image_path = f'{folder}/plot_{len(self.model["calinski_scores"]) + 2}.png'
        plt.savefig(image_path)
        plt.close(fig)
        
        # Retorna o número de clusters com o maior score e o caminho da imagem
        return  image_path

    
    def plot(self,colors, index, folder,data):
    
        # Criar uma nova figura para cada valor de k
        fig, ax = plt.subplots(figsize=(10, 6))
            
         # Obter labels e centroides do modelo atual
        labels = self.model["kmeans_k"][index].labels_
        centroids = self.model["kmeans_k"][index].cluster_centers_
            
        # Plotar os pontos com cores de acordo com os labels
        ax.scatter(
            data.iloc[:, 0],
            data.iloc[:, 1],
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
        return self.model
    
    def setData(self, data, k, folder):
        self.model = self.train(data, k, folder)


