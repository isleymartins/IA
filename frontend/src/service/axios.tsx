import { apiUrl } from '../../config'
import { ModelPrediction, FileInformation, QualityMetrics, Hipotese } from "../model/model";
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
    const { Name, Model, Precision, Train, Plots, Id } = response.data;

    const blobs: Blob[] = [];
    for (const imagePath of Plots) {
      const blob = await fetchImage(imagePath);
      if (blob) {
        blobs.push(blob);
      } else {
        console.warn(`Imagem não encontrada: ${imagePath}`);
      }
    }
    const qualityMetrics = await fetchQualityMetrics(model)

    const modelPrediction: ModelPrediction = {
      name: Name,
      model: Model,
      test: Train,
      plots: blobs,
      id: Id,
      confusionMatrix: Array.isArray(Precision) ? [...Precision] : [],
      qualityMetrics: qualityMetrics
    };
    return modelPrediction;
  } catch (error) {
    console.error('Erro ao buscar o modelo:', error);
  }
};

export const fetchQualityMetrics = async (model: string): Promise<QualityMetrics | undefined> => {
  try {
    const response = await axios.get(`${apiUrl}/api/metrics/${model}`);
    const { Metrics } = response.data;

    return Metrics

  } catch (error) {
    console.error("Erro ao buscar métricas de qualidade:", error);
  }
};


export const fetchUpload = async (fileData: FormData): Promise<FileInformation | undefined> => {

  const response = await fetch(`${apiUrl}/upload`, {
    method: 'POST',
    body: fileData,
  });

  if (response.ok) {
    const result: any = await response.json()
    return result

  }
  console.error('Erro ao submeter os dados:', response.statusText);
  return undefined
}

export const fetchHypothesisTest = async (model1: string, model2: string, alpha: number): Promise<Hipotese | undefined> => {
  try {
    const response = await axios.post(`${apiUrl}/api/metrics/${model1}/${model2}`, {
      alpha: alpha  // Remova o 'method' do corpo da requisição
    }, {
      headers: { 'Content-Type': 'application/json' }  // O cabeçalho para indicar o tipo de conteúdo
    });

    const { Metrics, Hipotese } = response.data;
    console.log(response);

    return {
      metrics: Metrics,
      hipotese: Hipotese
    };

  } catch (error) {
    console.error("Erro ao buscar métricas de qualidade:", error);
  }
};
