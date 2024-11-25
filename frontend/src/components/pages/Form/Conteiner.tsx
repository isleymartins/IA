import React, { useEffect, useState, useContext } from 'react';
import TableData from '../../Table';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ModelPrediction } from "../../../model/model";
import { fetchModel } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Stepper from './Stepper';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
};

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
interface FormComponentProp{
  index: number
}
const FormComponent: React.FC<FormComponentProp> = ({ index }: FormComponentProp) => {
  const [value, setValue] = useState(0);

  const authContext = useContext(AuthContext);

  const { fileData, setFileData, formData, directory, setDirectory, modelPrediction, setModelPrediction } = authContext;

  const handleChangeBar = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (formData) {
      getModel()
    }
  }, [formData]);

  const getModel = async () => {
    try {
      for (const model of directory) {
        const modelData: ModelPrediction | undefined = await fetchModel(model);

        if (modelData) {
          setModelPrediction((prevState: ModelPrediction[]): ModelPrediction[] => {
            const existingModelIndex = prevState.findIndex(
              (models) => models.name === modelData.name
            );

            if (existingModelIndex !== -1) {
              const updatedModels = [...prevState];
              updatedModels[existingModelIndex] = modelData;
              return updatedModels;
            } else {
              return [...prevState, modelData];
            }

          });
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log(index,"!", modelPrediction[index])
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
           { modelPrediction[index]&&<Stepper item={modelPrediction[index]?.plots} />}
          </Item>
        </Grid>
      </Grid>

    </Box>
  );
};

export default FormComponent;
