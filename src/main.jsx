import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { seedDemoData } from './data/seedDemo.js'
import './index.css'

seedDemoData()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
