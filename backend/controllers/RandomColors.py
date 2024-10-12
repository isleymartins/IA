import numpy as np

class RandomColors:
    def __init__(self):
        self.colors = []

    def randomColors(self, numColor):
        colors = []
        for _ in range(numColor):
            # Gera uma cor aleatória em RGB
            color = np.random.rand(3,)
            # Converte uma cor RGB para o formato hexadecimal
            hex_color = '#{:02x}{:02x}{:02x}'.format(int(color[0]*255), int(color[1]*255), int(color[2]*255))
            colors.append(hex_color)
        return colors

    def getData(self):
        return self.colors

    def setData(self, numColor):
        self.colors = self.randomColors(numColor)
