import { PAGES } from "../constants/pathConst";
import {
  LANGS_CODES,
  TRANSLATION_KEYS as TK,
  TRANSLATION_ROOT_KEYS as TRK,
} from "../constants/translationConst";
import { getNormalizedTranslation } from "../utils/translationUtils";

const { en, ru } = LANGS_CODES;
const { COMMON } = TRK;

// {ROOT_KEY: {INSIDE_KEY: {LANG_KEY1: value, LANG_KEY2: value, ...}}};
// example
// {MAP: {enter_adress: {ENG: "Enter address", RUS: "Введите адрес"}}};

const resources = {
  [COMMON]: {
    [TK[COMMON].back]: {
      [en]: "Back",
      [ru]: "Назад",
    },
    [TK[COMMON].fullscreen]: {
      [en]: "Fullscreen",
      [ru]: "На весь экран",
    },
    [en]: {
      [en]: "English",
      [ru]: "Английский",
    },
    [ru]: {
      [en]: "Russian",
      [ru]: "Русский",
    },
    [PAGES.MAIN]: {
      [en]: "Main",
      [ru]: "Главная",
    },
    [PAGES.MANUAL_MODE]: {
      [en]: "Manual mode",
      [ru]: "Ручной режим",
    },
    [PAGES.SETTINGS]: {
      [en]: "Settings",
      [ru]: "Настройки",
    },
    [PAGES.SELECT_PROGRAM]: {
      [en]: "Select program",
      [ru]: "Выбор программы",
    },
    [TK[COMMON].programMode]: {
      [en]: "Program mode",
      [ru]: "Режим программы",
    },
    [TK[COMMON].remainingTime]: {
      [en]: "Remaining time",
      [ru]: "Оставшееся время",
    },
    [TK[COMMON].elapsedTime]: {
      [en]: "Elapsed time",
      [ru]: "Прошедшее время",
    },
    [TK[COMMON].resistance]: {
      [en]: "Resistance",
      [ru]: "Нагрузка",
    },
    [TK[COMMON].currentRPM]: {
      [en]: "Current RPM",
      [ru]: "Текущий каденс",
    },
    [TK[COMMON].targetRPM]: {
      [en]: "Target RPM",
      [ru]: "Требуемый каденс",
    },
  },
};

export default getNormalizedTranslation(resources);
