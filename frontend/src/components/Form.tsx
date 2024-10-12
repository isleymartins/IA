import { useEffect, useState } from 'react';
import axios from "axios";
import { apiUrl } from '../../config.ts';
import TableData from './Table.tsx';
import { makeStyles } from '@mui/styles';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface Form {
  file: File | null;
  testCase: number;
  feature: string;
}

interface ModelPrediction {
  name: string
  model: any[]
  test: any[]
  confusionMatrix: number[]
  plots: string[]
}

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: number
  value: number
}

/*const useStyles = makeStyles({
  bar: {
    background: 'red',
    color: 'rgba(255, 255, 255, 0.87)',
    fontWeight: 'bold'
  }
});*/

function TabPanel(props: TabPanelProps) {
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
          <Typography component="div">{children}</Typography> {/* Mudar para `component="div"` */}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const FormComponent = () => {
  const [formData, setFormData] = useState<Form>({
    file: null,
    testCase: 0,
    feature: ''
  });
  const [isClicked, setIsClicked] = useState(false);
  const [modelPrediction, setModelPrediction] = useState<ModelPrediction[]>([])
  const [value, setValue] = React.useState(0);


  const handleChangeBar = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isClicked) {
      fetchModel()
      setIsClicked(false)
    }
  }, [isClicked])

  //Pega todos os dados do modelo espercifico no backEnd
  const fetchModel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lineardiscriminant`)
      const { Model, Pressicion, Train, Plots } = response.data

      setModelPrediction((prevState: ModelPrediction[]) => {
        const existingModelIndex = prevState.findIndex(models => models.name === "Distancia Minima")
        if (existingModelIndex !== -1) {
          // Substituir o modelo existente
          const updatedModels = [...prevState]
          updatedModels[existingModelIndex] = {
            name: "Distancia Minima",
            model: Model,
            test: Train,
            plots: Plots,
            confusionMatrix: Array.isArray(Pressicion) ? [...Pressicion] : []
          }
          return updatedModels;
        } else {
          // Adicionar novo modelo
          return [
            ...prevState,
            {
              name: "Distancia Minima",
              model: Model,
              test: Train,
              plots: Plots,
              confusionMatrix: Array.isArray(Pressicion) ? [...Pressicion] : []
            }
          ]
        }
      })
      fetchImage(Plots)
      console.log(modelPrediction)
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const fetchImage = async (paths: String[]) => {
    try {
      const imagesDiv = document.getElementById('images');
      if (imagesDiv) {
        imagesDiv.innerHTML = '';  // Limpa as imagens existentes

        for (const path of paths) {
          const response = await axios.get(`${apiUrl}/api/plots/${path}`, { responseType: 'blob' });
          const blob = response.data;
          const img = document.createElement('img');
          const url = URL.createObjectURL(blob);

          img.src = url;
          img.alt = 'Plot Image';
          img.style.width = '30vw';  // Ajuste a largura conforme necessário

          imagesDiv.appendChild(img);
        }
      }
    } catch (error) {
      console.error('Error:', error);

    }
  }
    //Dados capturados pelo formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, files } = e.target;
      if (name === 'file') {
        if (files) {
          const selectedFile = files[0];
          setFormData(prevFormData => ({
            ...prevFormData,
            file: selectedFile
          }));
        }
      } else {
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const data = new FormData();

      for (const key in formData) {
        if (formData[key as keyof Form] !== null) {
          data.append(key, formData[key as keyof Form] as string | Blob);
        }
      }

      try {
        const response = await axios.post(`${apiUrl}/upload`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setIsClicked(true);

      } catch (error) {
        setIsClicked(false);
        console.error('Error:', error);
      }
    };

    return (
      <>
        <h1> Upload TXT File</h1>
        <form id="uploadForm">
          <input type="file" id="fileInput" name="file" onChange={handleChange} />
          <label>Porcentagem de teste:</label>
          <input
            type="number"
            id="testSize"
            name="testCase"
            min="1"
            max="100"
            value={formData.testCase || 30}
            onChange={handleChange}
            required
          />
          <label htmlFor="feature">Feature:</label>
          <input
            type="text"
            id="feature"
            name="feature"
            value={formData.feature || "Species"}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={handleSubmit}>Submit</button>
        </form>
        <Box sx={{ borderImageSlice: 'red', width: '70vw' }}>
          <AppBar position="relative" /*className={classes.bar}*/>
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
                  {item.model?.length > 0 && <TableData row={item.model} feature={formData.feature} title={"Modelo"} />}
                </div>
                <div className="tables">
                  {item.confusionMatrix?.length > 0 && <TableData row={item.confusionMatrix} feature={formData.feature} title={"Matriz de confusão"} />}
                </div>
                <div className="tables">
                  {item.test?.length > 0 && <TableData row={item.test} feature={formData.feature} title={"Dados de Teste"} />}
                </div>
                <div id="images" />
              </div>
            </TabPanel>
          ))}
        </Box>
        
      </>

    )
  }
  export default FormComponent