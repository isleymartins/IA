import { createContext } from "react";
import { Form,ModelPrediction } from "../model/model";

interface AuthContextType {
  formData: Form ;
  setFormData: (formData: Form) => void;
  
  directory: string[];
  setDirectory: (directory: string[]) => void;
 
  modelPrediction: ModelPrediction[];
  setModelPrediction: (modelPrediction: ModelPrediction[]) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
