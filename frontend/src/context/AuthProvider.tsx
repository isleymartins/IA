import React, { useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { Form, ModelPrediction, FileInformation } from "../model/model";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<Form>({ file: null, testCase: 0, feature: '' });
  const [fileData, setFileData] = useState<FileInformation>( {data: 0, test: 0, models:[]})
  const [directory, setDirectory] = useState<string[]>([]);
  const [modelPrediction, setModelPrediction] = useState<ModelPrediction[]>([]);

  return (
    <AuthContext.Provider value={{fileData, setFileData, formData, setFormData, directory, setDirectory, modelPrediction, setModelPrediction }}>
      {children}
    </AuthContext.Provider>
  );
};
