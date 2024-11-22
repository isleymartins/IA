import { createContext } from "react";
import { Form, ModelPrediction,FileInformation } from "../model/model";

interface AuthContextType {
  formData: Form 
  setFormData: (formData: Form) => void

  fileData: FileInformation ;
  setFileData: (fileData: FileInformation) => void
  
  directory: string[]
  setDirectory: (directory: string[]) => void
 
  modelPrediction: ModelPrediction[]
  setModelPrediction: (modelPrediction: ModelPrediction[]) => void;
}

export const AuthContext = createContext<AuthContextType >(null!);
