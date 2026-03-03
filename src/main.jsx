import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EcomXRay from './EcomXRay.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EcomXRay />
  </StrictMode>
)
