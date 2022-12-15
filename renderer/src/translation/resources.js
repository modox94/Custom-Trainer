import { PAGES } from "../constants/pathConst";
import {
  LANGS_CODES,
  TRANSLATION_KEYS as TK,
  TRANSLATION_ROOT_KEYS as TRK,
} from "../constants/translationConst";
import {
  getNormalizedTranslation,
  getTranslationPath as getTP,
} from "../utils/translationUtils";

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
    [PAGES.PROGRAM_EDITOR]: {
      [en]: "Program editor",
      [ru]: "Редактор программ",
    },
    [TK[COMMON].newProgram]: {
      [en]: "New program",
      [ru]: "Новая программа",
    },
    [TK[COMMON].editProgram]: {
      [en]: "Edit program",
      [ru]: "Редактировать программу",
    },
    [TK[COMMON].copyProgram]: {
      [en]: "Copy program",
      [ru]: "Копировать программу",
    },
    [TK[COMMON].deleteProgram]: {
      [en]: "Delete program",
      [ru]: "Удалить программу",
    },
    [TK[COMMON].typeProgramTitle]: {
      [en]: "Type the title of the program...",
      [ru]: "Введите название программы...",
    },
    [TK[COMMON].next]: {
      [en]: "Next",
      [ru]: "Дальше",
    },
    [TK[COMMON].programTitleError]: {
      [en]: "This title is already used, enter another one.",
      [ru]: "Это название уже занято какой-то программой, введите другое.",
    },
    [TK[COMMON].add]: {
      [en]: "Add",
      [ru]: "Добавить",
    },
    [TK[COMMON].deleteTKey]: {
      [en]: "Delete",
      [ru]: "Удалить",
    },
    [TK[COMMON].save]: {
      [en]: "Save",
      [ru]: "Сохранить",
    },
    [TK[COMMON].programMode]: {
      [en]: "Program mode",
      [ru]: "Режим программы",
    },
    [TK[COMMON].current]: {
      [en]: "Current",
      [ru]: "Текущее",
    },
    [TK[COMMON].remaining]: {
      [en]: "Remaining",
      [ru]: "Оставшееся",
    },
    [TK[COMMON].elapsed]: {
      [en]: "Elapsed",
      [ru]: "Прошедшее",
    },
    [TK[COMMON].time]: {
      [en]: "time",
      [ru]: "время",
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
    [TK[COMMON].repeat]: {
      [en]: "Repeat",
      [ru]: "Повторить",
    },
    [TK[COMMON].trainingDone]: {
      [en]: "Training is done",
      [ru]: "Тренировка окончена",
    },
    [TK[COMMON].trainingDoneMsg]: {
      [en]: `Click the "$t(${getTP(
        COMMON,
        TK[COMMON].back,
      )})" button to return to the list of programs or the "$t(${getTP(
        COMMON,
        TK[COMMON].repeat,
      )})" button to start this program again.`,
      [ru]: `Нажмите кнопку "$t(${getTP(
        COMMON,
        TK[COMMON].back,
      )})", чтобы вернуться к списку программ или нажмите кнопку "$t(${getTP(
        COMMON,
        TK[COMMON].repeat,
      )})", чтобы запустить эту программу с начала.`,
    },
  },
};

export default getNormalizedTranslation(resources);
