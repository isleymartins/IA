import React, { useContext, useState } from 'react';
import TableData from "../../Table";
import { fetchPartitionalCluster } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese, ModelPrediction } from "../../../model/model";
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stepper from './Stepper';


interface FormComponentProp {

}


const PartiticionalCLusterComponent: React.FC<FormComponentProp> = ({ }: FormComponentProp) => {

    const [metrics, setMetrics] = useState<ModelPrediction>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [kOption, setKOption] = React.useState<number>(0);

    const partitionalCluster = async (k: number) => {
        await fetchPartitionalCluster(k)
            .then((response: ModelPrediction| undefined) => {
                if (response) {
                    console.log("@", response)
                    setMetrics(response)
                }
            })
            .finally(()=>{setLoading(false)})
    }

    console.log("$$",metrics)
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

          {metrics?.plots? <Stepper item={metrics?.plots} />: "Não contem imagens"}  
        </Box>

    );
};

export default PartiticionalCLusterComponent;
