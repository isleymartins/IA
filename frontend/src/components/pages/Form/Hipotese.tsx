import React, { useContext, useState, useEffect } from 'react';
import TableData from "../../Table";
import { fetchHypothesisTest } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese } from "../../../model/model";
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


interface FormComponentProp {
    // index?: number
    option?: string
    model: string
}


const HipoteseComponent: React.FC<FormComponentProp> = ({ model }: FormComponentProp) => {
    const authContext = useContext(AuthContext)
    const [metrics, setMetrics] = useState<Hipotese>();
    const [selectedOption, setSelectedOption] = React.useState<string>('');
    const [alphaOption, setAlphaOption] = React.useState<number>(0);
    const [blobUrl, setBlobUrl] = useState<string>("");

    const hypothesisTest = async (model1: string, model2: string, alpha: number) => {
        await fetchHypothesisTest(model1, model2, alpha)
            .then((response: Hipotese | undefined) => {
                if (response) {
                    setMetrics(response)
                }
            })
    }

    useEffect(() => {
        if (metrics?.plots) {
            const url = URL.createObjectURL(metrics.plots);
            setBlobUrl(url);

            // Libera o objeto URL quando o componente é desmontado
            return () => URL.revokeObjectURL(url);
        }
    }, [metrics]);

    const { formData } = authContext;

    const options = [
        { label: "Distancia Minima", value: "minimumdistanceclassifier" },
        { label: "Perceptron Simples", value: "perceptronsimples" },
        { label: "Perceptron com Regra Delta", value: "perceptrondelta" },
        { label: "Classificador de Bayes", value: "bayesclassifier" },
        { label: "Rede Neurais com Backpropagation", value: "neuralnetworks" },
        { label: "Cluster Particional", value: "partitionalcluster" },
        { label: "Maquina de Boltzman", value: "boltzmanmachine" }
    ];

    return (
        <Box padding="5px">
            <Grid container={true} spacing={2} display="flex" justifyContent="stretch" >
                <Grid size={4}>

                    <TextField
                        select={true}
                        disabled={true}
                        value={model}
                        // onChange={handleChange}
                        variant="outlined"
                        label="Escolha o modelo"
                        fullWidth={true}
                    >
                        {
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>))
                        }
                    </TextField>
                </Grid>

                <Grid size={4}>

                    <TextField
                        select={true}
                        value={selectedOption}
                        onChange={(event: any) => { setSelectedOption(event.target.value) }}
                        variant="outlined"
                        label="Escolha o modelo"
                        fullWidth={true}
                    >
                        {
                            options.map((option) => (
                                option.value !== model && <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>))
                        }
                    </TextField>
                </Grid>
                <Grid size={4}>

                    <TextField
                        type='number'
                        value={alphaOption}
                        onChange={(event: any) => { setAlphaOption(+event.target.value) }}
                        variant="outlined"
                        label="Alfa"
                        slotProps={{
                            input: {
                                inputProps: { min: 0, max: 1 }
                            },
                        }}

                        fullWidth={true}
                    >
                        {
                            options.map((option) => (
                                option.value !== model && <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>))
                        }
                    </TextField>
                </Grid>
                <Grid size={12}>
                    <Button
                        variant="contained"
                        //sx={{ marginTop: "8px"}}
                        disabled={!(alphaOption && selectedOption)}
                        fullWidth={true}
                        onClick={() => hypothesisTest(model, selectedOption, alphaOption)}>
                        Calcular
                    </Button>
                </Grid>
            </Grid>

            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                {metrics && <TableData row={metrics.metrics} feature={formData.feature} title="Modelo" />}
                {metrics?.hipotese ? (
                    <>
                        {blobUrl && (
                            <img src={blobUrl} alt="Gráfico de Hipótese" style={{ maxWidth: '100%', marginTop: '16px' }} />
                        )}
                        <Typography> {metrics.hipotese.toString()}</Typography>
                    </>
                    
                ) : (
                    <Typography>{"Hipótese não disponível"}</Typography>
                )}

            </Box>
        </Box>

    );
};

export default HipoteseComponent;
