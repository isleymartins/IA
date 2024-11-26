import { ChangeEvent, ReactNode } from 'react';

export interface Form {
    file: File | null;
    testCase: number;
    feature: string;
}
export interface ModelPrediction {
    name: string;
    model: any[];
    test: any[];
    confusionMatrix: number[];
    plots: Blob[];
    id: string,
    qualityMetrics: any
}

export interface FileInformation {
    data: number;
    test: number;
    models: string[];
}
export interface CardComponentProps {
    handleClose: () => void;
    handleFormChange: (formData: Form) => void;
    handleFormSubmit: () => void;
    formData?: Form;
    children: ReactNode;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
export interface QualityMetrics{
    metrics: any[]
}
export interface Hipotese{
    metrics: any[]
    hipotese: string
}
