import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initParse } from './utils/utils';
import privateRouter from "./routes/protected/private.routes";
import publicRouter from "./routes/public/public.routes";

initParse();


declare module "@tanstack/react-router" {
  interface Register {
    router: typeof privateRouter | typeof publicRouter;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

