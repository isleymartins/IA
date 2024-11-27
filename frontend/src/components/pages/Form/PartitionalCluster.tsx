import React, { useContext, useState } from 'react';
import TableData from "../../Table";
import { fetchPartitionalCluster } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese } from "../../../model/model";
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stepper from './Stepper';


interface FormComponentProp {

}


const PartiticionalCLusterComponent: React.FC<FormComponentProp> = ({ }: FormComponentProp) => {

    const [metrics, setMetrics] = useState<any>();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [kOption, setKOption] = React.useState<number>(0);

    const partitionalCluster = async (k: number) => {
        await fetchPartitionalCluster(k)
            .then((response: any | undefined) => {
                if (response) {
                    console.log("@", response.metrics)
                    setMetrics(response)
                }
            })
            .finally(()=>{setLoading(false)})
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

           { /*<Stepper item={metrics} />**/}
        </Box>

    );
};

export default PartiticionalCLusterComponent;
