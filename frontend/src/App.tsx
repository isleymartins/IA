import './App.css'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import Menu from "../src/components/layout/Menu"
import {AuthProvider} from "../src/context/AuthProvider"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Menu />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
