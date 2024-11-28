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
            if(divider>0):
              accuracy.append(ok / divider)
            else:
                return 0
        return accuracy

    @staticmethod
    def global_accuracy(matrix_confusion):
        #Calcula a acurácia global.
        
        ok = np.trace(matrix_confusion)
        divider = np.sum(matrix_confusion)
        if(divider>0):
              return ok / divider
        else:
         return 0

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

        # Total de elementos na matriz de confusão
        m = np.sum(matrix_confusion)

        # Dimensões da matriz de confusão
        lines, columns = matrix_confusion.shape

        # Cálculo de φ₃
        phi3_sum = 0
        for i in range(lines):
            a_i_plus = np.sum(matrix_confusion[i, :])  # Soma da linha i
            a_plus_i = np.sum(matrix_confusion[:, i])  # Soma da coluna i
            phi3_sum += a_i_plus * a_plus_i
        phi3 = phi3_sum / (m ** 2)

        # Cálculo de φ₄
        phi4_sum = 0
        for i in range(lines):
            for j in range(columns):
                a_j_plus = np.sum(matrix_confusion[j, :])  # Soma da linha j
                a_plus_i = np.sum(matrix_confusion[:, i])  # Soma da coluna i
                phi4_sum += matrix_confusion[i, j] * (a_j_plus + a_plus_i)
        phi4 = phi4_sum / (m ** 3)

        # Evitar divisões por zero
        if po == 1 or pe == 1:
            return 0

        # Componentes da variância avançada
        p1 = (po * (1 - po)) / (m * ((1 - pe) ** 2))
        p2 = (2 * (1 - po) * ((2 * po * pe) - phi3)) / (m * ((1 - pe) ** 3))
        p3 = (((1 - po) ** 2) * (phi4 - 4 * (pe ** 2))) / (m * ((1 - pe) ** 4))

        # Variância avançada
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
    def significanceTest(k1, k2, sigma1, sigma2, alpha, folder):
        #Realiza o teste de significância para dois índices e gera a interpretação textual.
        hipotese = (
            "Teste de significância\n"
            "Hipótese nula (H0): Os índices não são significativamente diferentes.\n"
            "Hipótese alternativa (H1): Os índices são significativamente diferentes.\n"
        )
        
        # Cálculo do valor de z
        z = (k1 - k2) / math.sqrt(sigma1 + sigma2)
        
        # Valor crítico para um teste bilateral
        z_critical = stats.norm.ppf(1 - alpha / 2)
        
        # Decisão do teste
        if abs(z) > z_critical:
            mensagem = "Rejeitamos a hipótese nula. Os índices são significativamente diferentes."
        else:
            mensagem = "Não rejeitamos a hipótese nula. Os índices não são significativamente diferentes."
        
        # Formatação da saída
        resultado = (
            f"{hipotese}"
            f"Decisão: {mensagem}"
        )
        '''
            f"Estatística do teste z: {z:.4f}\n"
            f"Valor crítico (±z): ±{z_critical:.4f}\n"
            f"Nível de significância: {alpha}\n"'''
        return resultado, QualityMetrics.plotSignificance(alpha, z, z_critical, folder)
    
    @staticmethod
    def plotSignificance(alpha, z_statistic, z_critical, folder):
        # Gera o gráfico de região crítica com base no nível de significância.
        title = 'Região Crítica de um Teste Bilateral'
        # Parâmetros para o gráfico
        mean = 0  # Média sob H0
        std = 1  # Desvio padrão
        x = np.linspace(-4, 4, 1000)  # Valores no eixo x
        y = stats.norm.pdf(x, mean, std)  # Densidade da normal

        # Criar o gráfico
        plt.figure(figsize=(10, 6))
        plt.plot(x, y, label='Distribuição Normal (H0)', color='blue')
        plt.fill_between(
            x, y, where=(x <= -z_critical) | (x >= z_critical),
            color='red', alpha=0.3, label=f'Região Crítica (α = {alpha})'
        )
        plt.axvline(x=z_critical, color='red', linestyle='--', label=f'Z crítico: +{z_critical:.2f}')
        plt.axvline(x=-z_critical, color='red', linestyle='--', label=f'Z crítico: -{z_critical:.2f}')
        plt.axvline(x=z_statistic, color='green', linestyle='--', label=f'Estatística z: {z_statistic:.2f}')

        # Configurações do gráfico
        plt.title(title)
        plt.xlabel('Estatística de Teste (z)')
        plt.ylabel('Densidade')
        plt.legend(loc='upper right')  # Legenda no canto superior direito
        plt.grid(True)

        image_path = f'{folder}/plot.png'
        plt.savefig(image_path)
        plt.close()
        return image_path

    
    @staticmethod
    def tau_coefficient( matrix_confusion):
        #Calcula o coeficiente Tau.
        
        po = QualityMetrics.global_accuracy(matrix_confusion)
        c = len(matrix_confusion)

        return (po - (1/c) / (1 - (1/c)))

    @staticmethod
    def var_tau_coefficient(matrix_confusion):
        #Calcula a variância do coeficiente Tau.
        po = QualityMetrics.global_accuracy(matrix_confusion)
        c = len(matrix_confusion)

        # Total de elementos na matriz de confusão
        m = np.sum(matrix_confusion)
        return (1/m)*((po*(1-po))/((1-(1/c))**2))
    
    @staticmethod
    def matthews_coefficient(matrix_confusion):
        # Definir o número de classes
        n = len(matrix_confusion)
        
        # Soma total de todos os elementos na matriz de confusão
        total = np.sum(matrix_confusion)
        
        # Inicializar as somas para VP, FP, FN e VN
        VP = FP = FN = VN = 0

        for k in range(n):
            # Verdadeiros Positivos (VP)
            vp_k = matrix_confusion[k, k]
            
            # Falsos Positivos (FP) - soma da coluna k exceto o VP
            fp_k = np.sum(matrix_confusion[:, k]) - vp_k
            
            # Falsos Negativos (FN) - soma da linha k exceto o VP
            fn_k = np.sum(matrix_confusion[k, :]) - vp_k
            
            # Verdadeiros Negativos (VN) - soma total da matriz - (FP + FN + VP)
            vn_k = total - (np.sum(matrix_confusion[:, k]) + np.sum(matrix_confusion[k, :]) - vp_k)
            
            # Acumulando os valores de VP, FP, FN e VN
            VP += vp_k
            FP += fp_k
            FN += fn_k
            VN += vn_k

        # Cálculo do numerador
        part1 = (VP * VN) - (FP * FN)
        
        # Cálculo do denominador
        part2 = np.sqrt((VP + FP) * (VP + FN) * (VN + FP) * (VN + FN))
        
        # Evitar divisão por zero
        if part2 == 0:
            return 0
        
        return part1 / part2


