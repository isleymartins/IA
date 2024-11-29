import React, { useContext, useState } from 'react';
import { fetchModelData } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Box, Button, TextField, Typography } from '@mui/material';
import { ModelPrediction } from "../../../model/model";
import Grid from '@mui/material/Grid2';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableData from '../../Table';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));
interface FormComponentProp {
    modelId: string
    model: ModelPrediction | undefined
}
const PercepthonComponent: React.FC<FormComponentProp> = ({ modelId, model }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [epochs, setEpochs] = useState<number>(0);
    const [learningRate, setLearningRate] = useState<number>(0);

    const authContext = useContext(AuthContext);
    const { formData, modelPrediction, setModelPrediction } = authContext;


    const percepthon = async (epochs: number, learningRate: number) => {
        const data: any[] = [epochs, learningRate];
        setLoading(true);

        try {
            const response = await fetchModelData(data, modelId);

            if (response) {
                const updatedModelPrediction = modelPrediction.map((item: ModelPrediction) =>
                    item.id === model?.id ? response : item
                );
                setModelPrediction(updatedModelPrediction);
            }
        } catch (error) {
            console.error("Erro ao buscar dados do modelo:", error);
        } finally {
            setLoading(false);
        }
    }
    return (

        <Box padding="5px">
            <Item>
                <Grid container={true} spacing={2} display="flex" justifyContent="stretch">
                    <Grid size={4}>
                        <TextField
                            type='number'
                            value={epochs}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setEpochs(Number(event.target.value)) }}
                            variant="outlined"
                            label="Épocas"
                            slotProps={{
                                input: {
                                    inputProps: { min: 0 }
                                },
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={4}>
                        <TextField
                            type='number'
                            value={learningRate}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setLearningRate(Number(event.target.value)) }}
                            variant="outlined"
                            label="Taxa de Aprendizado"
                            slotProps={{
                                input: {
                                    inputProps: { min: 0 }
                                },
                            }}
                            fullWidth
                        />
                    </Grid>
                    <Grid size={4}>
                        <Button
                            variant='contained'
                            disabled={loading}
                            onClick={() => {
                                setLoading(true);
                                percepthon(epochs, learningRate);
                            }}
                        >
                            Aplicar
                        </Button>
                    </Grid>

                </Grid>
            </Item>

        </Box>
    );
};

export default PercepthonComponent;
