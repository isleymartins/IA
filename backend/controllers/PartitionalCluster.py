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
    
    def kmeans(self, test_k):
        calinski_scores = []
        
        for i in range(2, test_k):
            kmeans = KMeans(n_clusters=i, init='k-means++', random_state=0).fit(self.data)
            self.values_k.append(i)
            self.kmeans_k.append(kmeans)

            score = calinski_harabasz_score(self.data, kmeans.labels_)
            calinski_scores.append(score)
            
        return np.argmax(calinski_scores) + 2
   
    def plot(self, index, folder):
        fig, ax = plt.subplots(nrows=1, ncols=self.test_k - 1, figsize=(18, 5))
        colors = ['b', 'g', 'r', 'c', 'y', 'k', 'm', 'w']

        for i in range(2, len(self.kmeans_k) + 2):
            labels = self.kmeans_k[i - 2].labels_
            centroids = self.kmeans_k[i - 2].cluster_centers_
            ax[i - 2].scatter(self.data.iloc[:, 0], self.data.iloc[:, 1], c=[colors[label] for label in labels])
            ax[i - 2].scatter(centroids[:, 0], centroids[:, 1], c='black', marker='x')
            ax[i - 2].set_title(f'k={i}')
            
        plt.tight_layout()
        image_path = f'{folder}/plot_{index}.png'
        plt.savefig(image_path)
        plt.close()
        return image_path
    
    def getData(self):
        return self.data
    
    def setData(self, data, k):
        self.test_k = k
        self.data = data


