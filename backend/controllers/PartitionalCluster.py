from sklearn.cluster import KMeans
import pandas as pd
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from sklearn.metrics import calinski_harabasz_score
import numpy as np
  
class ParticionalCluster:
     #agrupando dados
    def __init__(self, test_value=2,data=[]):
        #Dados de treinamento
        self.data=[]
        self.test_k = test_value
        self.values_k=[]
        self.kmeans_k=[]
        self.calinski_score=[]
    
    def kmeans(self,data):
        for i in range(2, self.test_k):
            kmeans = KMeans(n_clusters=i, init='k-means++', random_state=0).fit(data)
            self.values_k.append(i)
            self.kmeans_k.append(kmeans)

            # Calcular índice de Calinski-Harabasz
            score = calinski_harabasz_score(data, kmeans.labels_)
            self.calinski_scores.append(score)
        return np.argmax(self.calinski_scores)
   
    def plot(self,data):
        fig, ax = plt.subplots(nrows=1, ncols=self.test_k-1, figsize=(18, 5))
        colors = [ 'b','g', 'r', 'c', 'y','k','m', 'w']

        for i in range(2, len(self.kmeans_k)):
            labels = self.kmeans_k[i-1].labels_
            centroids = self.kmeans_k[i-1].cluster_centers_
            ax[i-1].scatter(data['Petal length'], data['Petal width'], c=[colors[label] for label in labels])
            ax[i-1].scatter(centroids[:, 0], centroids[:, 1], c='black', marker='x')
            ax[i-1].set_title(f'k={i}')
        print(self.calinski_scores)
        plt.tight_layout()
        plt.show()
    