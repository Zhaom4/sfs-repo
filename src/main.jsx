import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import CustomRouter from './components/CustomRouter';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomRouter>
      <App />
    </CustomRouter>
  </StrictMode>,
)
