import { useEffect, useState } from 'react'
import axios from "axios"
import { apiUrl } from '../../config.ts'
import { features } from 'process'

interface Form {
  file: File | null
  testCase: number
  feature: string
}

const Form = () => {
  const [formData, setFormData] = useState<Form>({
    file: null,
    testCase: 0,
    feature: ''
  })
  const [isClicked, setIsClicked] = useState(false)
  const [tableTest, setTest] = useState<any[]>([])
  const [tableModel, setModel] = useState<any[]>([])
  const [confusionMatrix, setConfusionMatrix] = useState<any[]>([])

  useEffect(() => {
    if (isClicked) {
      fetchModel()
      setIsClicked(false)
    }
  }, [isClicked])

  const fetchModel = async () => {
    try {
      await axios.get(`${apiUrl}/api/lineardiscriminant`)
        .then((response: any) => {
          const { Model, Pressicion, Train } = response.data

          setModel(Model)
          setTest(Train)
          Array.isArray(Pressicion) && setConfusionMatrix([...Pressicion])

        })

    } catch (error) {
      console.error('Error:', error);
      return
    }
  }

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
      <div id="images" />
      <div className="tables">
        {
          tableModel?.length > 0 && <table>
            <thead>
              <tr>
              {Object.keys(tableModel[0])?.map((column, index) => <td><td key={index}>{column}</td></td>)}
              </tr>
            </thead>
            <tbody>
              {

                tableModel?.map((item, index) => <tr key={index}>
                  {Object.keys(item).map((key) => <td>{item[key]}</td>)}
                </tr>
                )
              }
            </tbody>
          </table>
        }
        {
          tableTest?.length > 0 && <div className='container-table'><table>
            <thead>
              {Object.keys(tableTest[0])?.map((column, index) => <td><td key={index}>{column}</td></td>)}
            </thead>
            <tbody>
              {
                tableTest?.map((item, index) => <tr key={index}>
                  {Object.keys(item).map((key) => <td>{item[key]}</td>)}
                </tr>
                )
              }
            </tbody>
          </table>      </div>
        }
      </div>

    </>
  )
}
export default Form