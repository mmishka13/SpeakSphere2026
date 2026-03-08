import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TutoringHomepage from './home.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TutoringHomepage />
  </StrictMode>,
)
