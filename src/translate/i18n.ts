import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enUS from "./languages/en-US.json";
import ptBR from "./languages/pt-BR.json";

i18n.use(initReactI18next).init({
  resources: {
    "en-US": {
      translation: enUS,
    },
    "pt-BR": {
      translation: ptBR,
    },
  },
  lng: localStorage.getItem("i18nextLng") || "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
