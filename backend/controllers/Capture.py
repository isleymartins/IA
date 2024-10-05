import pandas as pd

class Capture:
    def __init__(self):
        self.data = None
        self.type = None

    def extract(self, path, file_type):
        # Definindo as extensões permitidas e suas funções de leitura
        extensions = {
            '.txt': lambda p: pd.read_csv(p, delimiter='\t'),
            '.csv': pd.read_csv,
            '.json': pd.read_json,
            '.xlsx': pd.read_excel
        }

        # Verificando se a extensão é permitida
        if file_type not in extensions:
            raise ValueError(f"Extensão {file_type} não suportada.")
        
        # Extraindo dados com base na extensão do arquivo
        data = extensions[file_type](path)
        return data

    def getData(self):
        return self.data
    
    def setData(self, path, file_type):
        self.data = self.extract(path, file_type)
        self.type = file_type