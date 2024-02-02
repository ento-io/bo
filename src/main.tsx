import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { initParse } from './utils/utils';

initParse();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

