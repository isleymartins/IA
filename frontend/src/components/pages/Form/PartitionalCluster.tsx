import React, { useContext, useState } from 'react';
import TableData from "../../Table";
import { fetchPartitionalCluster } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese, ModelPrediction } from "../../../model/model";
import { Box, Button, MenuItem, Paper, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stepper from './Stepper';


interface FormComponentProp {

}


const PartiticionalCLusterComponent: React.FC<FormComponentProp> = ({ }: FormComponentProp) => {

    const [metrics, setMetrics] = useState<ModelPrediction>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [kOption, setKOption] = React.useState<number>(0);

    const authContext = useContext(AuthContext);
    const { formData } = authContext;

    const partitionalCluster = async (k: number) => {
        await fetchPartitionalCluster(k)
            .then((response: ModelPrediction | undefined) => {
                if (response) {
                    setMetrics(response)
                }
            })
            .finally(() => { setLoading(false) })
    }

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
                <Grid size={4}>
                    <Button
                        variant='contained'
                        disabled={loading}
                        onClick={() => {
                            partitionalCluster(kOption)
                            setLoading(true)
                        }}
                    >
                        Definir Maximo
                    </Button>
                </Grid>
            </Grid>

            <Box display="flex" paddingBlock="2%">
                {
                    metrics?.plots && <Paper>
                        <Paper
                            square
                            elevation={0}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                height: 50,
                                padding: 1,
                                bgcolor: 'background.default',
                            }}
                        >
                            <Typography variant='h6'>Calinski_harabasz: {metrics?.model[0]}</Typography>
                        </Paper>
                        {metrics?.plots.length ? <img
                            key={metrics?.plots.length}
                            src={URL.createObjectURL(metrics?.plots[metrics?.plots.length - 1])}
                            alt="Plot Image"
                            style={{ width: '23vw' }}
                        />
                            : "Erro ao carregar"
                        }

                    </Paper>}
                {metrics?.plots ? <Stepper item={metrics?.plots} /> : "Não contem imagens"}
            </Box>
        </Box>

    );
};

export default PartiticionalCLusterComponent;
