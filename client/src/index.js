import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './theme/bootstrap.min.css'
import i18next from 'i18next'
import {I18nextProvider} from 'react-i18next'
import global_en from './translations/en/global.json'
import global_es from './translations/es/global.json'

i18next.init({
  interpolation: {escapeValue: false},
  lng: 'es',
  resources: {
    es:{
      global: global_es
    },
    en:{
      global: global_en
    }
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App/>
    </I18nextProvider>
  </React.StrictMode>
);
