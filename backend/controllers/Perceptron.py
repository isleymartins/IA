import numpy as np

class Perceptron:
    def __init__(self, input_size=0, learning_rate=0.01, epochs=100):
        # Inicializa os pesos e o viés com valores aleatórios
        self.weights = np.random.rand(input_size)
        self.bias = np.random.rand()
        self.learning_rate = learning_rate
        self.epochs = epochs

    def activation_function(self, x):
        # Função de ativação (degrau)
        return 1 if x >= 0 else 0

    def predict(self, x):
        # Calcula a soma ponderada e aplica a função de ativação
        linear_output = np.dot(x, self.weights) + self.bias
        return self.activation_function(linear_output)

    def train(self, X, y):
        # X é a matriz de entradas e y são os rótulos esperados
        for _ in range(self.epochs):
            for xi, target in zip(X, y):
                # Faz a predição
                prediction = self.predict(xi)
                # Calcula o erro
                error = target - prediction
                # Atualiza os pesos e o viés
                self.weights += self.learning_rate * error * xi
                self.bias += self.learning_rate * error

