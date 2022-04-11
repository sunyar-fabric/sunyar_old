import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import i18n from 'i18next';
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
   supportedLngs:['en', 'fr', 'ar' , 'fa'],
    fallbackLng: "en",

    detection: {
      order: [ 'cookie', 'htmlTag' , 'localStorage', 'path', 'subdomain'],
      cashes: ['cookie']
    },

    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json'
    },
    react: { useSuspense: false }
  });  


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
