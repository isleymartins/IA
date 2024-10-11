import './App.css'
import Form from './components/Form'
import ImagensPlots from './components/ImagensPlots'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'

function App() {
  return (
    <ThemeProvider theme={theme}>
    <Form/>
    <ImagensPlots/>
    </ThemeProvider>
  )
}

export default App
