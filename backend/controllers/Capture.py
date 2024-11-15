import pandas as pd
from sklearn.model_selection import train_test_split

class Capture:
    def __init__(self):
        self.data = None
        self.feature = None
        self.type = None

    def extract(self, path, file_type):
        # Definindo as extensões permitidas e suas funções de leitura
        extensions = {
            '.txt': lambda p: pd.read_csv(p, delimiter='\t'),
            '.csv': pd.read_csv,
            '.json': pd.read_json,
            '.xlsx': pd.read_excel,
            '.xls': pd.read_excel
        }

        # Verificando se a extensão é permitida
        if file_type not in extensions:
            raise ValueError(f"Extensão {file_type} não suportada.")
        
        # Extraindo dados com base na extensão do arquivo
        data = extensions[file_type](path)
        return data
    
    def shareData(self, feature, testCase):
        # Certifique-se de que self.data é um DataFrame e que feature está presente
        if self.data is None or not isinstance(self.data, pd.DataFrame):
            raise TypeError("self.data não é um DataFrame")
        if feature not in self.data.columns:
            raise ValueError(f"A coluna {feature} não está presente no DataFrame")
                
        # Selecionando todas as colunas exceto classColumn
        x = self.data.loc[:, self.data.columns != feature]
        y, self.classifications = self.replacement(self.data[feature])
        
        # Definindo a limitação de treino e teste
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(x, y, test_size=testCase, random_state=42, stratify=y)

    @staticmethod
    def replacement(dataFeature):
        # Fazendo uma cópia dos dados
        data = dataFeature.copy()
        
        # Obtendo valores únicos
        classifications = data.unique()
        
        # Criação do dicionário de substituições
        substitution = {value: int(idx + 1) for idx, value in enumerate(classifications)}

        # Mapeando os valores de acordo com o dicionário
        data = data.map(substitution)

        transcribe = {value: key for key, value in substitution.items()}

        return data, transcribe


    #substitui a classificação em numero
    def transcribe(self, dataFeature):
        data = dataFeature.copy()
        data = data.astype(int)
        #subs = {value: key for key, value in self.classifications.items()}
        # Mapeamento dos valores na coluna especificada
        data = data.map(self.classifications)
                
        return data

    #Retorna todos os dados
    def getData(self):
        return self.data
    
    def getClassifications(self):
        return self.classifications
    
    def setData(self, path, feature,file_type):
        self.data = self.extract(path, file_type)
        self.feature = feature
        self.type = file_type