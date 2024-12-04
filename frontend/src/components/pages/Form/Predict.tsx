import React, { useContext, useState } from 'react';
import { fetchPredictData } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Box, Button, TextField, Typography } from '@mui/material';
import { ModelPrediction } from "../../../model/model";
import Grid from '@mui/material/Grid2';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

interface FormComponentProp {
    modelId: string;
    model: ModelPrediction | undefined;
}

const PredictComponent: React.FC<FormComponentProp> = ({ modelId, model }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [inputs, setInputs] = useState<{ [key: string]: number }>({});
    const [predict, setPredict] = useState<String>('');

    const authContext = useContext(AuthContext);
    const { fileData } = authContext;

    const predictData = async (data: { [key: string]: number }) => {
        setLoading(true);
        try {
            const predictResult = await fetchPredictData(data, modelId);
            predictResult?setPredict(predictResult):setPredict("Sem predição")
            
            // Processar resposta aqui
        } catch (error) {
            console.error("Erro ao buscar dados do modelo:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (column: string, value: number) => {
        setInputs((prevInputs) => ({ ...prevInputs, [column]: value }));
    };

    return (
        <Box padding="5px">
            <Item>
                <Grid container spacing={2} display="flex" justifyContent="stretch">
                    {fileData.columns.map((column) => (
                        <Grid size={3} key={column}>
                            <TextField
                                type="number"
                                value={inputs[column] || ''}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleInputChange(column, Number(event.target.value))}
                                variant="outlined"
                                label={column}
                                fullWidth
                            />
                        </Grid>
                    ))}

                    <Grid size={12}>
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={() => predictData(inputs)}
                        >
                            Predizer
                        </Button>
                    </Grid>
                </Grid>
                <Grid>
                    <Typography>{predict}</Typography>
                </Grid>
            </Item>
        </Box>
    );
};

export default PredictComponent;
