import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import App from './App'
import { initParse } from './utils/utils';
import privateRouter from "./routes/private.routes";
import publicRouter from "./routes/public.routes";

import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/fr';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

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

