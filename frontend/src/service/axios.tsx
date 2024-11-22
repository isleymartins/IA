import { apiUrl } from '../../config'
import { Form, ModelPrediction, FileInformation, QualityMetrics } from "../model/model";
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
  }
};

export const fetchQualityMetrics = async (model1: string, model2: string): Promise<QualityMetrics[] | undefined> => {
  try {
    const response = await axios.get(`${apiUrl}/api/metrics/${model1}/${model2}`);
    const { Metrics } = response.data;

    const parsedMetrics = Metrics.map((metric: any): QualityMetrics => ({
      causal_accuracy: metric.causal_accuracy,
      f_score_1: metric.f_score_1,
      f_score_1_2: metric["f_score_1/2"],
      f_score_2: metric.f_score_2,
      global_accuracy: metric.global_accuracy,
      kappa_coefficient: metric.kappa_coefficient,
      precision: metric.precision,
      producer_accuracy: metric.producer_accuracy,
      recall: metric.recall,
      user_accuracy: metric.user_accuracy,
      var_kappa_coefficient: metric.var_kappa_coefficient,
      var_kappa_coefficient_advanced: metric.var_kappa_coefficient_advanced,
    }));

    return parsedMetrics;
  } catch (error) {
    console.error("Erro ao buscar métricas de qualidade:", error);
    return undefined;
  }
};


export const fetchUpload = async (fileData: FormData): Promise<FileInformation | undefined> => {

  try {
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: fileData,
    });

    if (response.ok) {
      const result: any = await response.json()
      return result

    } else {
      console.error('Erro ao submeter os dados:', response.statusText);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}
