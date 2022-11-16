import { PAGES } from "./pathConst";

export const LANGS_CODES = { en: "en", ru: "ru" };

export const i18nNamespace = "translation";

export const i18nKeySeparator = ".";

export const TRANSLATION_ROOT_KEYS = {
  COMMON: "COMMON",
  SETTINGS: "SETTINGS",
};

export const TRANSLATION_KEYS = {
  [TRANSLATION_ROOT_KEYS.COMMON]: {
    back: "back",
    fullscreen: "fullscreen",
    [LANGS_CODES.en]: LANGS_CODES.en,
    [LANGS_CODES.ru]: LANGS_CODES.ru,
    [PAGES.MAIN]: PAGES.MAIN,
    [PAGES.MANUAL_MODE]: PAGES.MANUAL_MODE,
    [PAGES.SETTINGS]: PAGES.SETTINGS,
    [PAGES.SELECT_PROGRAM]: PAGES.SELECT_PROGRAM,
    programMode: "programMode",
  },
};
