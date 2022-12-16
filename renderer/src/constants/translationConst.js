import { PAGES } from "./pathConst";

export const LANGS_CODES = { en: "en", ru: "ru" };

export const i18nNamespace = "translation";

export const i18nKeySeparator = ".";

export const TRANSLATION_ROOT_KEYS = {
  COMMON: "COMMON",
  WORKOUT: "WORKOUT",
  PROGRAM_EDITOR: "PROGRAM_EDITOR",
  SETTINGS: "SETTINGS",
};

export const TRANSLATION_KEYS = {
  [TRANSLATION_ROOT_KEYS.COMMON]: {
    back: "back",
    fullscreen: "fullscreen",
    [PAGES.MAIN]: PAGES.MAIN,
    [PAGES.MANUAL_MODE]: PAGES.MANUAL_MODE,
    [PAGES.SETTINGS]: PAGES.SETTINGS,
    [PAGES.SELECT_PROGRAM]: PAGES.SELECT_PROGRAM,
    [PAGES.PROGRAM_EDITOR]: PAGES.PROGRAM_EDITOR,
    next: "next",
    add: "add",
    deleteTKey: "deleteTKey",
    save: "save",
    repeat: "repeat",
  },
  [TRANSLATION_ROOT_KEYS.WORKOUT]: {
    programMode: "programMode",
    current: "current",
    remaining: "remaining",
    elapsed: "elapsed",
    time: "time",
    trainingDone: "trainingDone",
    trainingDoneMsg: "trainingDoneMsg",
  },
  [TRANSLATION_ROOT_KEYS.PROGRAM_EDITOR]: {
    newProgram: "newProgram",
    editProgram: "editProgram",
    copyProgram: "copyProgram",
    deleteProgram: "deleteProgram",
    typeProgramTitle: "typeProgramTitle",
    programTitleError: "programTitleError",
  },
  [TRANSLATION_ROOT_KEYS.SETTINGS]: {
    [LANGS_CODES.en]: LANGS_CODES.en,
    [LANGS_CODES.ru]: LANGS_CODES.ru,
  },
};
