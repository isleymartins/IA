import React, { useContext, useState } from 'react';
import TableData from "../../Table";
import { fetchPartitionalCluster } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Hipotese, ModelPrediction } from "../../../model/model";
import { Box, Button, CircularProgress, MenuItem, Paper, styled, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stepper from './Stepper';


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
        <Grid container={true} spacing={2} display="flex" justifyContent="stretch" >

            <Grid size={12}>
                <Item >
                    <Box display="flex" >
                        <TextField
                            margin='dense'
                            size='small'
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

                        <Button
                            sx={{ marginLeft: "1%", paddingBlock: "1%" }}
                            size='small'
                            variant='contained'
                            disabled={loading}
                            fullWidth={true}
                            onClick={() => {
                                setLoading(true)
                                partitionalCluster(kOption)
                            }}
                        >
                            Definir Maximo
                        </Button>
                    </Box>
                </Item>
            </Grid>

            {
                loading ?<Grid size={12}> <CircularProgress color='secondary'/></Grid>
                :<>
                    <Grid>
                        {
                            metrics?.plots && <Item>
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
                                    <Typography variant='h6' color='textSecondary'>Calinski_harabasz: {metrics?.model[0]}</Typography>
                                </Paper>
                                {metrics?.plots.length ? <img
                                    key={metrics?.plots.length}
                                    src={URL.createObjectURL(metrics?.plots[metrics?.plots.length - 1])}
                                    alt="Plot Image"
                                    style={{ width: '23vw' }}
                                />
                                    : "Erro ao carregar"
                                }

                            </Item>}
                    </Grid>
                    {metrics?.plots ?
                        <Grid>
                            <Item>
                                <Stepper item={metrics?.plots} />
                            </Item>
                        </Grid> :
                        <Grid>
                            <Item>
                                <Typography>"Não contem imagens"</Typography>
                            </Item>
                        </Grid>
                    }

                </>
            }
        </Grid>


    );
};

export default PartiticionalCLusterComponent;
