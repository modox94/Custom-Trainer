import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import {
  i18nKeySeparator,
  i18nNamespace,
  LANGS_CODES,
} from "../constants/translationConst";
import resources from "./resources";

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: LANGS_CODES.en,
  supportedLngs: Object.values(LANGS_CODES),
  interpolation: { escapeValue: false }, // react already safes from xss
  ns: i18nNamespace,
  keySeparator: i18nKeySeparator,
});

export default i18next;
