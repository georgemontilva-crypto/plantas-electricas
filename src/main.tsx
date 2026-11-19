import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/archivo/wdth.css';
import './styles/app.css';
import App from './App';
import { QuoteProvider } from './lib/quote';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QuoteProvider>
        <App />
      </QuoteProvider>
    </BrowserRouter>
  </StrictMode>,
);
