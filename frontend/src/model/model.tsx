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
}

export interface FileInformation {
    data: number;
    test: number;
    models: string[];
}