import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { FinancialProvider } from './context/FinancialContext'
import { ThemeProvider } from './context/ThemeContext'
import { ColorProvider } from './context/ColorContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <ColorProvider>         {/* 👈 así, con etiqueta de apertura y cierre */}
        <AuthProvider>
          <FinancialProvider>
            <App />
          </FinancialProvider>
        </AuthProvider>
      </ColorProvider>
    </ThemeProvider>
  </React.StrictMode>
)