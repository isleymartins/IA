import React, { useEffect, useState, useContext } from 'react';
import TableData from '../../Table';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { QualityMetrics } from "../../../model/model";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Stepper from './Stepper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
interface FormComponentProp {
  index: number
  model: string
}
const FormComponent: React.FC<FormComponentProp> = ({ index, model }: FormComponentProp) => {
  const [value, setValue] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [loadingModel, setLoadingModel] = useState<boolean>(false);

  const authContext = useContext(AuthContext);

  const { fileData, setFileData, formData, directory, setDirectory, modelPrediction, setModelPrediction } = authContext;

  const handleChangeBar = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(index, "!", modelPrediction[index],"!",modelPrediction)
  return (
    <Box sx={{ borderImageSlice: 'red', width: '70vw' }}>


      <Grid container spacing={2}>
        <Grid >
          <Item key={index}>
            {modelPrediction[index]?.model?.length > 0 && <TableData row={modelPrediction[index]?.model} feature={formData.feature} title="Modelo" />}
          </Item>
        </Grid>
        <Grid >
          <Item key={index}>
            {modelPrediction[index]?.confusionMatrix?.length > 0 && <TableData row={modelPrediction[index]?.confusionMatrix} feature={formData.feature} title="Matriz de confusão" />}
          </Item>
        </Grid>
        <Grid >
          <Item key={index}>
            {modelPrediction[index]?.test?.length > 0 && <TableData row={modelPrediction[index]?.test} feature={formData.feature} title="Dados de Teste" />}
          </Item>
        </Grid>
        <Grid>
          <Item key={index}>
            {modelPrediction[index] && <Stepper item={modelPrediction[index]?.plots} />}
          </Item>
        </Grid>
        <Grid>
          <Item key={index}>
            {modelPrediction[index] && <TableData row={modelPrediction[index].qualityMetrics} feature={formData.feature} title="Metricas de Quallidade" />}
            {/*<Typography>
              {metrics?.hipotese
                ? typeof metrics.hipotese === 'object'
                  ? JSON.stringify(metrics.hipotese) // Converte para string se for objeto
                  : metrics.hipotese // Exibe diretamente se for texto ou número
                : "Hipótese não disponível"}
            </Typography>*/}
          </Item>
        </Grid>
      </Grid>

    </Box>
  );
};

export default FormComponent;
