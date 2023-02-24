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
const { COMMON, WORKOUT, PROGRAM_EDITOR, SETTINGS, TIPS } = TRK;

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
    [TK[COMMON].next]: {
      [en]: "Next",
      [ru]: "Дальше",
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
    [TK[COMMON].repeat]: {
      [en]: "Repeat",
      [ru]: "Повторить",
    },
    [TK[COMMON].cancelTKey]: {
      [en]: "Cancel",
      [ru]: "Отмена",
    },
    [TK[COMMON].copyTKey]: {
      [en]: "Copy",
      [ru]: "Копировать",
    },
    [TK[COMMON].ok]: {
      [en]: "Ok",
      [ru]: "Ясно",
    },
    [TK[COMMON].yes]: {
      [en]: "Yes",
      [ru]: "Да",
    },
  },
  [WORKOUT]: {
    [TK[WORKOUT].programMode]: {
      [en]: "Program mode",
      [ru]: "Режим программы",
    },
    [TK[WORKOUT].current]: {
      [en]: "Current",
      [ru]: "Текущее",
    },
    [TK[WORKOUT].remaining]: {
      [en]: "Remaining",
      [ru]: "Оставшееся",
    },
    [TK[WORKOUT].elapsed]: {
      [en]: "Elapsed",
      [ru]: "Прошедшее",
    },
    [TK[WORKOUT].time]: {
      [en]: "time",
      [ru]: "время",
    },
    [TK[WORKOUT].trainingDone]: {
      [en]: "Training is done",
      [ru]: "Тренировка окончена",
    },
    [TK[WORKOUT].trainingDoneMsg]: {
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
  [PROGRAM_EDITOR]: {
    [TK[PROGRAM_EDITOR].newProgram]: {
      [en]: "New program",
      [ru]: "Новая программа",
    },
    [TK[PROGRAM_EDITOR].editProgram]: {
      [en]: "Edit program",
      [ru]: "Редактировать программу",
    },
    [TK[PROGRAM_EDITOR].copyProgram]: {
      [en]: "Copy program",
      [ru]: "Копировать программу",
    },
    [TK[PROGRAM_EDITOR].deleteProgram]: {
      [en]: "Delete program",
      [ru]: "Удалить программу",
    },
    [TK[PROGRAM_EDITOR].saveToFile]: {
      [en]: "Save to file",
      [ru]: "Сохранить в файл",
    },
    [TK[PROGRAM_EDITOR].loadFromFile]: {
      [en]: "Load from file",
      [ru]: "Загрузить из файла",
    },
    [TK[PROGRAM_EDITOR].typeProgramTitle]: {
      [en]: "Type the title of the program...",
      [ru]: "Введите название программы...",
    },
    [TK[PROGRAM_EDITOR].programTitleError]: {
      [en]: "This title is already used, enter another one.",
      [ru]: "Это название уже занято какой-то программой, введите другое.",
    },
    [TK[PROGRAM_EDITOR].deleteProgHead]: {
      [en]: "Deleting the program",
      [ru]: "Удаление программы",
    },
    [TK[PROGRAM_EDITOR].deleteProgMsg]: {
      [en]: 'The selected program "{{programTitle}}" will be permanently deleted. Are you sure?',
      [ru]: 'Выбранная программа "{{programTitle}}" будет удалена без возможности восстановления. Вы уверены?',
    },
    [TK[PROGRAM_EDITOR].copyProgHead]: {
      [en]: "Copying program",
      [ru]: "Копирование программы",
    },
    [TK[PROGRAM_EDITOR].copyProgMsg]: {
      [en]: 'The new program will be created based on the selected "{{programTitle}}". You will need to enter a new title, make changes if necessary, and save.',
      [ru]: 'Новая программа будет создана на основе выбранной "{{programTitle}}". Нужно будет ввести новое имя, внести изменения, если потребуется, и сохранить.',
    },
  },
  [SETTINGS]: {
    [en]: {
      [en]: "English",
      [ru]: "Английский",
    },
    [ru]: {
      [en]: "Russian",
      [ru]: "Русский",
    },
    [TK[SETTINGS].languageTKey]: {
      [en]: "Language",
      [ru]: "Язык",
    },
    [TK[SETTINGS].interfaceTKey]: {
      [en]: "Interface",
      [ru]: "Интерфейс",
    },
    [TK[SETTINGS].peripheral]: {
      [en]: "Peripheral",
      [ru]: "Переферия",
    },
    [TK[SETTINGS].performance]: {
      [en]: "Performance",
      [ru]: "Производительность",
    },
    [TK[SETTINGS].advanced]: {
      [en]: "Advanced",
      [ru]: "Дополнительно",
    },
    [TK[SETTINGS].cursorNoneTitle]: {
      [en]: "Hide the cursor",
      [ru]: "Скрыть курсор",
    },

    [TK[SETTINGS].cursorNoneMsg]: {
      [en]: "Are you sure you want to hide the cursor?",
      [ru]: "Вы уверены, что хотите скрыть курсор?",
    },
    [TK[SETTINGS].showTipsTKey]: {
      [en]: "Show tips at the bottom of the page",
      [ru]: "Показывать подсказки внизу страницы",
    },
    [TK[SETTINGS].motorDisclaimerHead]: {
      [en]: "TODO motorDisclaimerHead",
      [ru]: "TODO motorDisclaimerHead",
    },
    [TK[SETTINGS].motorDisclaimerMsg]: {
      [en]: "TODO motorDisclaimerMsg",
      [ru]: "TODO motorDisclaimerMsg",
    },
    [TK[SETTINGS].toCalibrateBut]: {
      [en]: "TODO calibrationBut",
      [ru]: "TODO calibrationBut",
    },

    [TK[SETTINGS].toCalibrateHead]: {
      [en]: "TODO calibrationHead",
      [ru]: "TODO calibrationHead",
    },

    [TK[SETTINGS].toCalibrateMsg]: {
      [en]: "TODO calibrationMsg",
      [ru]: "TODO calibrationMsg",
    },

    [TK[SETTINGS].sleepRatioKey]: {
      [en]: "TODO sleepRatioKey",
      [ru]: "TODO sleepRatioKey",
    },

    [TK[SETTINGS].sleepRatioHead]: {
      [en]: "TODO sleepRatioHead",
      [ru]: "TODO sleepRatioHead",
    },

    [TK[SETTINGS].sleepRatioMsg]: {
      [en]: "TODO sleepRatioMsg",
      [ru]: "TODO sleepRatioMsg",
    },
  },
  [TIPS]: {
    [TK[TIPS].tipBut]: {
      [en]: "Tips",
      [ru]: "Подсказки",
    },
    [TK[TIPS].tipDescrip]: {
      [en]: "To the right of the button you clicked, there are tips.",
      [ru]: "Справа от кнопки, которую вы нажали, находятся подсказки.",
    },
    [TK[TIPS].tipTitle]: {
      [en]: "Tip",
      [ru]: "Подсказка",
    },
    [TK[TIPS].settingsTip]: {
      [en]: "go to the settings page.",
      [ru]: "переход на страницу настроек приложения.",
    },
    [TK[TIPS].quitBut]: {
      [en]: "Quit",
      [ru]: "Выход",
    },
    [TK[TIPS].quitTip]: {
      [en]: "quit the app.",
      [ru]: "выход из приложения.",
    },
    [TK[TIPS].rpmBut]: {
      [en]: "Speed",
      [ru]: "Скорость",
    },
    [TK[TIPS].rpmTip]: {
      [en]: "the desired running speed on the sector.",
      [ru]: "желаемая скорость бега на участке.",
    },
    [TK[TIPS].totalDurationBut]: {
      [en]: "Total duration",
      [ru]: "Общая продолжительность",
    },
    [TK[TIPS].totalDurationTip]: {
      [en]: "the total duration of the workout.",
      [ru]: "общая продолжительность тренировки.",
    },
    [TK[TIPS].resistanceBut]: {
      [en]: "Resistance level",
      [ru]: "Уровень нагрузки",
    },
    [TK[TIPS].resistanceTip]: {
      [en]: "the level of load on the sector.",
      [ru]: "уровень нагрузки на участке.",
    },
    [TK[TIPS].languageTip]: {
      [en]: "application language selection menu.",
      [ru]: "меню выбора языка приложения.",
    },
    [TK[TIPS].interfaceTip]: {
      [en]: "setting up interface elements.",
      [ru]: "настройка элементов интерфейса.",
    },
    [TK[TIPS].peripheralTip]: {
      [en]: "setting up connected components.",
      [ru]: "настройка подключенных компонентов.",
    },
    [TK[TIPS].manualModeTip]: {
      [en]: "a training mode in which the resistance level changes manually.",
      [ru]: "режим тренировки, при котором изменение уровня нагрузки производится вручную.",
    },
    [TK[TIPS].selectProgramTip]: {
      [en]: "list to select of a program for training in auto mode in which the resistance level changes in according with a pre-written program.",
      [ru]: "выбор программы для тренировки в автоматическом режиме, изменение уровня нагрузки происходит в соответствии с заранее написанной программой.",
    },
    [TK[TIPS].programEditorTip]: {
      [en]: "program editor for training in auto mode.",
      [ru]: "редактор программ для тренировки в автоматическом режиме.",
    },
    [TK[TIPS].motorBut]: {
      [en]: "Motor",
      [ru]: "Двигатель",
    },
    [TK[TIPS].motorTip]: {
      [en]: "TODO motorTip",
      [ru]: "TODO motorTip",
    },
    [TK[TIPS].calibrationBut]: {
      [en]: "Calibration",
      [ru]: "Калибровка",
    },
    [TK[TIPS].calibrationTip]: {
      [en]: "TODO calibrationTip",
      [ru]: "TODO calibrationTip",
    },
    [TK[TIPS].heartBeatSettingsBut]: {
      [en]: "Heartbeat",
      [ru]: "Сердцебиение",
    },
    [TK[TIPS].heartBeatSettingsTip]: {
      [en]: "TODO heartBeatSettingsTip",
      [ru]: "TODO heartBeatSettingsTip",
    },
    [TK[TIPS].rpmSettingsBut]: {
      [en]: "Speedometer",
      [ru]: "Спидометр",
    },
    [TK[TIPS].rpmSettingsTip]: {
      [en]: "TODO rpmSettingsTip",
      [ru]: "TODO rpmSettingsTip",
    },
    [TK[TIPS].motorToLeftBut]: {
      [en]: "TODO motorToLeftBut",
      [ru]: "TODO motorToLeftBut",
    },
    [TK[TIPS].motorToLeftTip]: {
      [en]: "TODO motorToLeftTip",
      [ru]: "TODO motorToLeftTip",
    },
    [TK[TIPS].motorToRightBut]: {
      [en]: "TODO motorToRightBut",
      [ru]: "TODO motorToRightBut",
    },
    [TK[TIPS].motorToRightTip]: {
      [en]: "TODO motorToRightTip",
      [ru]: "TODO motorToRightTip",
    },
    [TK[TIPS].motorPotenBut]: {
      [en]: "Potentiometer",
      [ru]: "Потенциометр",
    },
    [TK[TIPS].motorPotenTip]: {
      [en]: "TODO motorPotenTip",
      [ru]: "Текущие показания потенциометра двигателя, другими словами значения положения двигателя.",
    },
    [TK[TIPS].motorMinPosBut]: {
      [en]: "Easiest position",
      [ru]: "Легчайшее положение",
    },
    [TK[TIPS].motorMinPosTip]: {
      [en]: "TODO motorMinPosTip",
      [ru]: "TODO motorMinPosTip",
    },
    [TK[TIPS].motorMaxPosBut]: {
      [en]: "Hardest position",
      [ru]: "Тяжелейшее положение",
    },
    [TK[TIPS].motorMaxPosTip]: {
      [en]: "TODO motorMaxPosTip",
      [ru]: "TODO motorMaxPosTip",
    },
    [TK[TIPS].motorSwapMotorWiresBut]: {
      [en]: "Swap motor wires",
      [ru]: "Поменять местами провода двигателя",
    },
    [TK[TIPS].motorSwapMotorWiresTip]: {
      [en]: "TODO motorSwapMotorWiresTip",
      [ru]: "TODO motorSwapMotorWiresTip",
    },
    [TK[TIPS].motorSwapPotenWiresBut]: {
      [en]: "Swap potentiometer wires",
      [ru]: "Поменять местами провода потенциометра",
    },
    [TK[TIPS].motorSwapPotenWiresTip]: {
      [en]: "TODO motorSwapPotenWiresTip",
      [ru]: "TODO motorSwapPotenWiresTip",
    },
  },
};

export default getNormalizedTranslation(resources);
