import { useEffect, useState } from 'react'
import axios from "axios"
import { apiUrl } from '../../config.ts'
import TableData from './Table.tsx'
import { features } from 'process'
import { makeStyles } from '@mui/styles';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface Form {
  file: File | null
  testCase: number
  feature: string
}

interface ModelPrediction {
  name: string
  model: any[]
  test: any[]
  confusionMatrix: number[]
}
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
const useStyles = makeStyles({
  bar: {
    background: 'rgba(36, 36, 36, 1)',
    color: 'rgba(255, 255, 255, 0.87)',
    fontWeight: 'bold'
  }
});

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
        <Box sx={{p: 2 }}>
          <Typography>{children}</Typography>
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


const Form = () => {
  const [formData, setFormData] = useState<Form>({
    file: null,
    testCase: 0,
    feature: ''
  })
  const [isClicked, setIsClicked] = useState(false)
  const [modelPrediction, setModelPrediction] = useState<ModelPrediction[]>([])
  const [tableTest, setTest] = useState<any[]>([])
  const [tableModel, setModel] = useState<any[]>([])
  const [confusionMatrix, setConfusionMatrix] = useState<any[]>([])

  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const handleChangeBar = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (isClicked) {
      fetchModel()
      setIsClicked(false)
    }
  }, [isClicked])

  const fetchModel = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/lineardiscriminant`);
      const { Model, Pressicion, Train } = response.data;

      setModelPrediction(prevState => {
        const existingModelIndex = prevState.findIndex(models => models.name === "Distancia Minima");

        if (existingModelIndex !== -1) {
          // Substituir o modelo existente
          const updatedModels = [...prevState];
          updatedModels[existingModelIndex] = {
            name: "Distancia Minima",
            model: Model,
            test: Train,
            confusionMatrix: Array.isArray(Pressicion) ? [...Pressicion] : []
          };
          return updatedModels;
        } else {
          // Adicionar novo modelo
          return [
            ...prevState,
            {
              name: "Distancia Minima",
              model: Model,
              test: Train,
              confusionMatrix: Array.isArray(Pressicion) ? [...Pressicion] : []
            },{
              name: "Distancia Minima",
              model: Model,
              test: Train,
              confusionMatrix: Array.isArray(Pressicion) ? [...Pressicion] : []
            }
          ];
        }
      });

      setModel(Model);
      setTest(Train);
      Array.isArray(Pressicion) && setConfusionMatrix([...Pressicion]);

    } catch (error) {
      console.error('Error:', error);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      if (files) {

        // O arquivo é acessado aqui
        const selectedFile = files[0]

        // O arquivo é armazenado no estado
        setFormData(prevFormData => ({
          ...prevFormData,
          file: selectedFile // Armazena o arquivo no estado
        }));
      } else {
        console.log('Nenhum arquivo selecionado')
      }
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const data = new FormData();

    // Adiciona os campos do formData
    for (const key in formData) {
      // Verifica se o valor não é null
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
      setIsClicked(true)
      // console.log('Response:', response.data);
    } catch (error) {
      setIsClicked(false)
      console.error('Error:', error);
    }
  }

  const fetchImages = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/lineardiscriminant`);
      const imagesDiv = document.getElementById('images');
      if (imagesDiv) {
        imagesDiv.innerHTML = '';

        // console.log('Response:', response.data);
        response.data.Plots.forEach((imagePath: any) => {
          const img = document.createElement('img');
          img.src = `${apiUrl}/${imagePath}`;
          img.alt = 'Plot Image';
          img.style.width = '300px'; // Ajuste a largura conforme necessário
          imagesDiv.appendChild(img);
        });

        //console.log('Response:', response.data);
      }

    } catch (error) {
      console.error('Error:', error);

    }
  }
  /*function fetchImages() {
    fetch(`${BACK}/api/lineardiscriminant`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        const imagesDiv = document.getElementById('images');
        imagesDiv.innerHTML = ''; // Limpa as imagens existentes
        console.log(data)
        data.Plots.forEach(imagePath => {
          const img = document.createElement('img');
          img.src = `${BACK}/${imagePath}`;
          img.alt = 'Plot Image';
          img.style.width = '300px'; // Ajuste a largura conforme necessário
          imagesDiv.appendChild(img);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });*/

  // console.log("!",  tableTest?.length > 0)
  return (
    <>
      <h1> Upload TXT File</h1>
      <form id="uploadForm">

        <input
          type="file"
          id="fileInput"
          name="file"
          onChange={handleChange}
        />
        <label >Porcentagem de teste:</label>
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
      <Box sx={{ borderImageSlice: 'red', width: '70vw' }}  >
        <AppBar position={"relative"}
        className={classes.bar}>
          <Tabs
            value={value}
            onChange={handleChangeBar}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"/**/
            aria-label="full width tabs example"

            centered
          >
            {
              modelPrediction.map((item, index) => (
                <Tab label={item.name} {...a11yProps(index)} key={index} />
              ))

            }
          </Tabs>
        </AppBar>
        {
          modelPrediction.map((item, index) => (
            <TabPanel value={value} index={index} >
              <div className="container-table">
                <div className="tables" >
                  {tableModel?.length > 0 && <TableData row={item.model} feature={formData.feature} title={"Modelo"} />}
                </div>
                <div className="tables" >
                  {confusionMatrix?.length > 0 && <TableData row={item.confusionMatrix} feature={formData.feature} title={"Matriz de confusão"} />}
                </div>
                <div className="tables">
                  {tableTest?.length > 0 && <TableData row={item.test} feature={formData.feature} title={"Dados de Teste"} />}
                </div>
              </div>
            </TabPanel>
          ))

        }
        {/*<TabPanel value={value} index={0} >
          <div className="container-table">
            <div className="tables" >
              {tableModel?.length > 0 && <TableData row={tableModel} feature={formData.feature} title={"Modelo"} />}
            </div>
            <div className="tables" >
              {confusionMatrix?.length > 0 && <TableData row={confusionMatrix} feature={formData.feature} title={"Matriz de confusão"} />}
            </div>
            <div className="tables">
              {tableTest?.length > 0 && <TableData row={tableTest} feature={formData.feature} title={"Dados de Teste"} />}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>*/}
      </Box>
      <div id="images" />

    </>
  )
}
export default Form