import React, { ChangeEvent, FormEvent, ReactNode } from 'react';

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
    plots?: Blob[];
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
    causal_accuracy: number;
    f_score_1: number;
    f_score_1_2: number;
    f_score_2: number;
    global_accuracy: number;
    kappa_coefficient: number;
    precision: number;
    producer_accuracy: number;
    recall: number;
    user_accuracy: number;
    var_kappa_coefficient: number;
    var_kappa_coefficient_advanced: number;
  }
