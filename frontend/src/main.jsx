import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181f',
            color: '#f0f0f5',
            border: '1px solid #2a2a35',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px'
          },
          success: {
            iconTheme: { primary: '#22d3a0', secondary: '#0a0a0f' }
          },
          error: {
            iconTheme: { primary: '#ff5a5f', secondary: '#0a0a0f' }
          }
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
