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

const FormComponent: React.FC = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [value, setValue] = useState(0);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.log("Deu ruim");
    return null;
  }

  const { fileData, setFileData,formData, directory, setDirectory, modelPrediction, setModelPrediction } = authContext;

  const handleChangeBar = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (directory) {
      getModel();
      setIsClicked(false);
    }
  }, [directory]);

  const getModel = async () => {
    try {
      for (const model of directory) {
        const modelData: ModelPrediction | undefined = await fetchModel(model);

        if (modelData) {
          setModelPrediction((prevState: ModelPrediction[]): ModelPrediction[] => {
            const existingModelIndex = prevState.findIndex((models: ModelPrediction) => models.name === modelData.name);

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
      console.log(modelPrediction);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ borderImageSlice: 'red', width: '70vw' }}>
      <AppBar position="relative">
        <Tabs
          value={value}
          onChange={handleChangeBar}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
          centered
        >
          {modelPrediction.map((item, index) => (
            <Tab label={item.name} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
      </AppBar>
      {modelPrediction.map((item, index) => (
        <TabPanel value={value} index={index} key={index}>
          <div className="container-table">
            <div className="tables">
              {item.model?.length > 0 && <TableData row={item.model} feature={formData.feature} title="Modelo" />}
            </div>
            <div className="tables">
              {item.confusionMatrix?.length > 0 && <TableData row={item.confusionMatrix} feature={formData.feature} title="Matriz de confusão" />}
            </div>
            <div className="tables">
              {item.test?.length > 0 && <TableData row={item.test} feature={formData.feature} title="Dados de Teste" />}
            </div>
            <div id={`images-${index}`}>
              {item.plots?.map((blob, imgIndex) => {
                const url = URL.createObjectURL(blob);
                return <img key={imgIndex} src={url} alt="Plot Image" style={{ width: '30vw' }} />;
              })}
            </div>
          </div>
        </TabPanel>
      ))}
    </Box>
  );
};

export default FormComponent;
