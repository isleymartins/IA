import React, { useContext, useEffect, useState } from 'react';
import TableData from "../../Table";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { QualityMetrics } from "../../../model/model";
import { Box, Button, MenuItem, Paper, styled, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';


interface FormComponentProp {
    // index?: number
    option?: string
    model: string
}


const HipoteseComponent: React.FC<FormComponentProp> = ({model}:FormComponentProp) => {
    const authContext = useContext(AuthContext)
    const [metrics, setMetrics] = useState<QualityMetrics>();

    const { formData } = authContext;

    const options = [
        { label: "Distancia Minima", value: "minimumdistanceclassifier" },
        { label: "Perceptron Simples", value: ""},
        { label: "Perceptron com Regra Delta", value: "" },
        { label: "Classificador de Bayes", value:"bayesclassifier" },
        { label: "Rede Neurais com Backpropagation", value: ""},
        { label: "Cluster Particional", value: "" },
        { label: "Maquina de Boltzman", value: "" },
        { label: "Teste de Hipoteses", value: "" },
    ];
    const [selectedOption, setSelectedOption] = React.useState('');
    const handleChange = (event: any) => { setSelectedOption(event.target.value); };

    return (
        <Box padding="5px">
            <Grid container={true} spacing={2} display="flex">
                <Grid>

                    <TextField
                        select={true}
                        disabled={true}
                        value={model}
                      // onChange={handleChange}
                        variant="outlined"
                        label="Escolha o modelo"
                        fullWidth={true}
                        style={{ minWidth: "200px" }}
                    >
                        {
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>))
                        }
                    </TextField>


                </Grid>

                <Grid>

                    <TextField
                        select={true}
                        value={selectedOption}
                        onChange={handleChange}
                        variant="outlined"
                        label="Escolha o modelo"
                        fullWidth={true}
                        style={{ minWidth: "200px" }}
                    >
                        {
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>))
                        }
                    </TextField>


                </Grid>
            </Grid>
            <Button
                variant="contained"
                sx={{marginTop:"5px"}}
                fullWidth={true}
                onClick={() => { }}>
                Calcular
            </Button>
            {metrics && <TableData row={metrics.metrics} feature={formData.feature} title="Modelo" />}
            <Typography>
                {/*metrics?.hipotese
                    ? typeof metrics.hipotese === 'object'
                        ? JSON.stringify(metrics.hipotese) // Converte para string se for objeto
                        : metrics.hipotese // Exibe diretamente se for texto ou número
                    : "Hipótese não disponível"*/}
            </Typography>
        </Box>

    );
};

export default HipoteseComponent;
