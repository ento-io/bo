import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Parse from 'parse'

Parse.initialize("ento.io");

const origin = window.location.origin;

const LOCAL = origin.includes('localhost') || origin.includes('127.0.0.1');
const PREPROD = origin.includes('preprod');
const PROD = !LOCAL && !PREPROD;

(window as any).LOCAL = LOCAL;
(window as any).PREPROD = PREPROD;
(window as any).PROD = PROD;

const parseServerURL = LOCAL ? 'http://localhost:8082/parse' : `${origin}/parse`;

Parse.serverURL = parseServerURL;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

