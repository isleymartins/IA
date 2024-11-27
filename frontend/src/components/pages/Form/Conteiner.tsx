import React, {  useContext } from 'react';
import TableData from '../../Table';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ModelPrediction } from "../../../model/model";
import { AuthContext } from "../../../context/AuthContext";
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Stepper from './Stepper';
import HipoteseComponent from './Hipotese';
import { Warning } from '@mui/icons-material';
import PartiticionalCLusterComponent from './PartitionalCluster';

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
const FormComponent: React.FC<FormComponentProp> = ({ modelId, model }: FormComponentProp) => {

  const authContext = useContext(AuthContext);

  const { formData } = authContext;

 console.log("@",modelId)
  return (
    <Box sx={{ borderImageSlice: 'red', width: '70vw' }}>


      <Grid container spacing={2} >
        {
          !model?.id? <Grid size={12}>
            <Item key={`${modelId}_0`}>
              <Warning />
              <Typography> Adicione os dados</Typography>
            </Item>
          </Grid> :
            <>
              {
                model?.model?.length > 0 && <Grid >
                  <Item key={`${modelId}_1`}>
                    <TableData row={model?.model} feature={formData.feature} title="Modelo" />
                  </Item>

                </Grid>
              }
              {
                model?.confusionMatrix?.length > 0 && <Grid >
                  <Item key={`${modelId}_2`}>
                    <TableData row={model?.confusionMatrix} feature={formData.feature} title="Matriz de confusão" />
                  </Item>
                </Grid>
              }
              {
                model?.test?.length > 0 && <Grid >
                  <Item key={`${modelId}_3`}>
                    <TableData row={model?.test} feature={formData.feature} title="Dados de Teste" />
                  </Item>
                </Grid>
              }
              {
                model?.plots && <Grid>
                  <Item key={`${modelId}_4`}>
                    <Stepper item={model?.plots} />
                  </Item>
                </Grid>
              }
              {
                model?.qualityMetrics && <Grid>
                  <Item key={`${modelId}_5`}>
                    <TableData row={model.qualityMetrics} feature={formData.feature} title="Metricas de Quallidade" />
                  </Item>
                </Grid>
              }
              {
                model && <Grid>
                  <Item key={`${modelId}_6`}>
                    <HipoteseComponent model={modelId} />
                  </Item>
                </Grid>
              }
              {
                model && <Grid>
                <Item key={`${modelId}_6`}>
                  <PartiticionalCLusterComponent/>
                </Item>
              </Grid>
              }
            </>
        }
      </Grid>

    </Box>
  );
};

export default FormComponent;
