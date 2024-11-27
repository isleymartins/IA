import React, { useContext, useState } from 'react';
import TableData from "../../Table";
import { fetchPartitionalCluster } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese } from "../../../model/model";
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stepper from './Stepper';


interface FormComponentProp {
    // index?: number
    option?: string
    model: string
}


const HipoteseComponent: React.FC<FormComponentProp> = ({ model }: FormComponentProp) => {
    const authContext = useContext(AuthContext)
    const [metrics, setMetrics] = useState<any>();
    const [selectedOption, setSelectedOption] = React.useState<string>('');
    const [kOption, setKOption] = React.useState<number>(0);

    const partitionalCluster = async (k: number) => {
        await fetchPartitionalCluster(k)
            .then((response: any | undefined) => {
                if (response) {
                    console.log("@", response.metrics)
                    setMetrics(response)
                }
            })
    }

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
                        type='number'
                        value={kOption}
                        onChange={(event: any) => { setKOption(+event.target.value) }}
                        variant="outlined"
                        label="K Maximo"
                        slotProps={{
                            input: {
                                inputProps: { min: 0 }
                            },
                        }}

                        fullWidth={true}
                    >
                    </TextField>
                </Grid>
            </Grid>

            {<Stepper item={metrics} />}
            <Typography>
                {metrics?.train ? metrics.train.toString() // Exibe diretamente se for texto ou número
                    : "Hipótese não disponível"}
            </Typography>
        </Box>

    );
};

export default HipoteseComponent;
