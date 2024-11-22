import React, { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { Form, ModelPrediction } from "../model/model";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<Form>({ file: null, testCase: 0, feature: '' });
  const [directory, setDirectory] = useState<string[]>([]);
  const [modelPrediction, setModelPrediction] = useState<ModelPrediction[]>([]);

  return (
    <AuthContext.Provider value={{ formData, setFormData, directory, setDirectory, modelPrediction, setModelPrediction }}>
      {children}
    </AuthContext.Provider>
  );
};
