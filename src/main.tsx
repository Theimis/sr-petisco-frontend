import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import "./styles/global.css";

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "12px",
            zIndex: 999999,
          },

          success: {
            style: {
              border: "1px solid #16a34a",
            },
          },

          error: {
            style: {
              border: "1px solid #dc2626",
            },
          },
        }}
      />

      <App />

    </BrowserRouter>

  </StrictMode>,
)