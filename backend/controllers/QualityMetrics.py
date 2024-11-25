import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.metrics import confusion_matrix
import scipy.stats as stats
import math

class QualityMetrics:
    #Classe para calcular várias métricas de qualidade baseadas na matriz de confusão.

    @staticmethod
    def producer_accuracy(matrix_confusion):
        #Calcula a acurácia do produtor para cada classe.
        accuracy = []
        for index in range(len(matrix_confusion)):
            ok = matrix_confusion[index][index]
            divider = np.sum(matrix_confusion[index])
            accuracy.append(ok / divider)
        return accuracy

    @staticmethod
    def user_accuracy(matrix_confusion):
        #Calcula a acurácia do usuário para cada classe.
        accuracy = []
        for column in range(len(matrix_confusion)):
            ok = matrix_confusion[column][column]
            divider = np.sum(matrix_confusion[:, column])
            accuracy.append(ok / divider)
        return accuracy

    @staticmethod
    def global_accuracy(matrix_confusion):
        #Calcula a acurácia global.
        
        ok = np.trace(matrix_confusion)
        divider = np.sum(matrix_confusion)
        return ok / divider

    @staticmethod
    def causal_accuracy(matrix_confusion):
        #Calcula o acordo esperado (Pe) para o coeficiente Kappa.
        
        pe = 0
        total = np.sum(matrix_confusion)
        for column in range(len(matrix_confusion)):
            n_column = np.sum(matrix_confusion[:, column])
            n_index = np.sum(matrix_confusion[column])
            pe += (n_index * n_column) / total**2
        return pe
    @staticmethod
    def kappa_coefficient( matrix_confusion):
        #Calcula o coeficiente Kappa.
        
        po = QualityMetrics.global_accuracy(matrix_confusion)
        pe = QualityMetrics.causal_accuracy(matrix_confusion)
        return (po - pe) / (1 - pe)

    @staticmethod
    def var_kappa_coefficient(matrix_confusion):
        #Calcula a variância do coeficiente Kappa.
        
        po = QualityMetrics.global_accuracy(matrix_confusion)
        pe = QualityMetrics.causal_accuracy(matrix_confusion)
        m = np.sum(matrix_confusion)
        return (po * (1 - po)) / (m * ((1 - pe) ** 2))

    @staticmethod
    def var_kappa_coefficient_advanced(matrix_confusion):
        #Calcula a variância do coeficiente Kappa avançada com φ₃ e φ₄.
        
        po = QualityMetrics.global_accuracy(matrix_confusion)
        pe = QualityMetrics.causal_accuracy(matrix_confusion)
        m = np.sum(matrix_confusion)

        phi3_sum = 0
        phi4_sum = 0
        lines, columns = matrix_confusion.shape

        for i in range(lines):
            a_i_plus = np.sum(matrix_confusion[i, :])
            a_plus_i = np.sum(matrix_confusion[:, i])
            phi3_sum += matrix_confusion[i, i] * (a_i_plus + a_plus_i)

        phi3 = (1 / m**2) * phi3_sum

        for i in range(lines):
            for j in range(columns):
                a_j_plus = np.sum(matrix_confusion[j, :])
                a_plus_i = np.sum(matrix_confusion[:, i])
                phi4_sum += matrix_confusion[i, j] * (a_j_plus + a_plus_i)

        phi4 = (1 / m**3) * phi4_sum

        if po == 1 or pe == 1:
            return 0

        p1 = (po * (1 - po)) / (m * ((1 - pe) ** 2))
        p2 = (2 * (1 - po) * ((2 * po * pe) - phi3)) / (m * ((1 - pe) ** 3))
        p3 = (((1 - po) ** 2) * (phi4 - 4 * pe)) / (m * ((1 - pe) ** 4))

        return p1 + p2 + p3


    @staticmethod
    def precision(matrix_confusion):
        #Calcula a precisão (média das precisões para cada classe).

        pr = 0
        for i in range(len(matrix_confusion)):
            pr += matrix_confusion[i][i] / np.sum(matrix_confusion[i])
        return pr / len(matrix_confusion)

    @staticmethod
    def recall(matrix_confusion):
        #Calcula a revocação/sensibilidade (média das revocações para cada classe).

        rev = 0
        for i in range(len(matrix_confusion)):
            rev += matrix_confusion[i][i] / np.sum(matrix_confusion[:, i])
        return rev / len(matrix_confusion)

    @staticmethod
    def f_score(b, matrix_confusion):
        #Calcula o F-Score.
        
        prec = QualityMetrics.precision(matrix_confusion)
        rev = QualityMetrics.recall(matrix_confusion)
        return ((1 + b**2) * prec * rev) / ((b**2 * prec) + rev)
    
    @staticmethod
    def significanceTest(k1, k2, sigma1, sigma2, amostra, alpha):
        print("sigma1:", sigma1, "\nsigma2:", sigma2)

        z = (k1 - k2) / math.sqrt(sigma1 + sigma2)
        print("z:", z)

        graus_de_liberdade = amostra - 1
        pontoCritico = stats.t.ppf(1 - alpha/2, graus_de_liberdade)
        
        menssege =""
        # Tomar a decisão
        if abs(z) > pontoCritico:
            menssege = "Rejeitamos a hipotese nula"
        else:
            menssege = "Nao rejeitamos a hipotese nula"

        return f" Estatistica de teste z: {z} Valor critico: {pontoCritico} {menssege}"

