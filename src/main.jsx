import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster closeButton/>
  </SocketProvider>
    
)
