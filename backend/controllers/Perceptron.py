import numpy as np
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix

class Perceptron:
    def __init__(self, input_size=0, learning_rate=0.01, epochs=100):
        self.model = {
            "weights": None,
            "bias": None,
            "learning_rate": learning_rate,
            "epochs": epochs
        }

    def activation_function(self, x):
        return 1 if x >= 0 else 0

    def fit(self, x):
        #print("x",x, "weights",self.model["weights"])
        linear_output = np.dot(x, self.model["weights"]) + self.model["bias"]
        return self.activation_function(linear_output)

    def train(self, x_train, y_train):
        #Pesos e bias
        self.model["weights"] = np.zeros(x_train.shape[1])
        self.model["bias"] = np.zeros(1)
        
        for _ in range(self.model["epochs"]):
            for xi, target in zip(x_train.values, y_train):
                #print("xi ",xi)
                prediction = self.fit(xi)
                error = target - prediction
                self.model["weights"] += self.model["learning_rate"] * error * xi
                self.model["bias"] += self.model["learning_rate"] * error
        
        return self.model

    def pressure(self, y_test, result, feature):
        if 'Prediction' not in result.columns:
            return "Coluna 'Prediction' não encontrada em result"
        
        matrixConfusion = confusion_matrix(y_test, result['Prediction'])
        self.matrixConfusion = matrixConfusion

        classes = sorted(set(y_test) | set(result['Prediction']))
        df_matrixConfusion = pd.DataFrame(matrixConfusion, index=classes, columns=classes)
        
        formatted_matrix = [
            {feature: row, **{col: int(df_matrixConfusion.at[row, col]) for col in classes}} for row in classes
        ]
        
        return formatted_matrix

    def plot(self, colors, columnX, columnY, x_test, classifications, index, folder):
        dataResult = x_test.copy()
        
        if 'Prediction' not in dataResult.columns:
            raise KeyError("A coluna 'Prediction' não está presente em dataResult")

        plt.switch_backend('Agg')

        x_min, x_max = dataResult[columnX].min() - 1, dataResult[columnX].max() + 1
        y_min, y_max = dataResult[columnY].min() - 1, dataResult[columnY].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.01), np.arange(y_min, y_max, 0.01))

        centroids = np.array([self.model["weights"]])
        distances = np.zeros((xx.shape[0], xx.shape[1], centroids.shape[0]))
        for i, centroid in enumerate(centroids):
            distances[:, :, i] = np.sqrt((xx - centroid[0])**2 + (yy - centroid[1])**2)

        Z = np.argmin(distances, axis=2)

        plt.figure(figsize=(10, 6))

        for idx, (key, tipo) in enumerate(classifications.items()):
            plt.scatter(
                dataResult[dataResult['Prediction'] == tipo][columnX],
                dataResult[dataResult['Prediction'] == tipo][columnY],
                color=colors[idx],
                alpha=0.8,
                label=tipo
            )

        plt.contourf(xx, yy, Z, alpha=0.2, colors=colors, levels=[-0.5, 0.5, 1.5, 2.5])
        plt.scatter(self.model["weights"][columnX], self.model["weights"][columnY], c='black', marker='x', s=100, label='Centroides')

        plt.title(f'Classificação por Distância Minima com {len(colors)} Classes - Plot {index}')
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
        print("Cheguei data")
        self.model = self.train(x_train, y_train)
        self.typeClass = list(set(y_train))

    def getMatrizConfusion(self):
        return self.matrixConfusion