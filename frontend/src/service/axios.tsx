import { apiUrl } from '../../config'
import { ModelPrediction } from "../model/model";
import axios from 'axios'

export const fetchImage = async (path: string): Promise<Blob | undefined> => {
    try {
        console.log("fetchImage", path);
        const response = await axios.get(`${apiUrl}/api/plots/${path}`, { responseType: 'blob' });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error(`Erro ao buscar o blob: Status ${response.status}`);
            return undefined;
        }
    } catch (error) {
        console.error('Erro ao buscar o blob:', error);
        return undefined;
    }
};

export const fetchModel = async (model: string): Promise<ModelPrediction | undefined> => {
    try {
        const response = await axios.get(`${apiUrl}/api/${model}`);
        const { Name, Model, Precision, Train, Plots } = response.data;
        
        const blobs: Blob[] = [];
        for (const imagePath of Plots) {
            const blob = await fetchImage(imagePath);
            if (blob) {
                blobs.push(blob);
            } else {
                console.warn(`Imagem não encontrada: ${imagePath}`);
            }
        }

        const modelPrediction: ModelPrediction = {
            name: Name,
            model: Model,
            test: Train,
            plots: blobs,
            confusionMatrix: Array.isArray(Precision) ? [...Precision] : [],
        };
        return modelPrediction;
    } catch (error) {
        console.error('Erro ao buscar o modelo:', error);
        return undefined;
    }
};


/*const handleFormSubmit = async () => {
    try {
      const data = new FormData();
      for (const key in formData) {
        if (formData[key as keyof FormData] !== null) {
          data.append(key, formData[key as keyof FormData] as string | Blob);
        }
      }
  
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        body: data,
      });
  
      if (response.ok) {
        const result = await response.json()
        console.log('Form Data Submitted:', formData);
        setDirectoryData(result.models);
        console.log('Response Data:', directoryData);
        // Atualize seu estado ou passe os dados para os componentes necessários
      } else {
        console.error('Erro ao submeter os dados:', response.statusText);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };  */