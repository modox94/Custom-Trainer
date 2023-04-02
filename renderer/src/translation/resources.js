import { ERRORS } from "../constants/commonConst";
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
const {
  COMMON_TRK,
  WORKOUT_TRK,
  PROGRAM_EDITOR_TRK,
  SETTINGS_TRK,
  TIPS_TRK,
  ERRORS_TRK,
} = TRK;

// {ROOT_KEY: {INSIDE_KEY: {LANG_KEY1: value, LANG_KEY2: value, ...}}};
// example
// {MAP: {enter_adress: {ENG: "Enter address", RUS: "Введите адрес"}}};

const resources = {
  [COMMON_TRK]: {
    [TK[COMMON_TRK].back]: {
      [en]: "Back",
      [ru]: "Назад",
    },
    [TK[COMMON_TRK].fullscreen]: {
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
    [TK[COMMON_TRK].next]: {
      [en]: "Next",
      [ru]: "Дальше",
    },
    [TK[COMMON_TRK].add]: {
      [en]: "Add",
      [ru]: "Добавить",
    },
    [TK[COMMON_TRK].deleteTKey]: {
      [en]: "Delete",
      [ru]: "Удалить",
    },
    [TK[COMMON_TRK].save]: {
      [en]: "Save",
      [ru]: "Сохранить",
    },
    [TK[COMMON_TRK].repeat]: {
      [en]: "Repeat",
      [ru]: "Повторить",
    },
    [TK[COMMON_TRK].cancelTKey]: {
      [en]: "Cancel",
      [ru]: "Отмена",
    },
    [TK[COMMON_TRK].copyTKey]: {
      [en]: "Copy",
      [ru]: "Копировать",
    },
    [TK[COMMON_TRK].ok]: {
      [en]: "Ok",
      [ru]: "Ясно",
    },
    [TK[COMMON_TRK].yes]: {
      [en]: "Yes",
      [ru]: "Да",
    },
    [TK[COMMON_TRK].turnOn]: {
      [en]: "Turn on",
      [ru]: "Включить",
    },
    [TK[COMMON_TRK].turnOff]: {
      [en]: "Turn off",
      [ru]: "Выключить",
    },
    [TK[COMMON_TRK].warning]: {
      [en]: "Warning",
      [ru]: "Предупреждение",
    },
    [TK[COMMON_TRK].start]: {
      [en]: "Start",
      [ru]: "Начать",
    },
  },
  [WORKOUT_TRK]: {
    [TK[WORKOUT_TRK].programMode]: {
      [en]: "Program mode",
      [ru]: "Режим программы",
    },
    [TK[WORKOUT_TRK].current_T]: {
      [en]: "Current",
      [ru]: "Текущее",
    },
    [TK[WORKOUT_TRK].remaining_T]: {
      [en]: "Remaining",
      [ru]: "Оставшееся",
    },
    [TK[WORKOUT_TRK].elapsed_T]: {
      [en]: "Elapsed",
      [ru]: "Прошедшее",
    },
    [TK[WORKOUT_TRK].time_T]: {
      [en]: "time",
      [ru]: "время",
    },
    [TK[WORKOUT_TRK].trainingDone]: {
      [en]: "Training is done",
      [ru]: "Тренировка окончена",
    },
    [TK[WORKOUT_TRK].trainingDoneMsg]: {
      [en]: `Click the "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].back,
      )})" button to return to the list of programs or the "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].repeat,
      )})" button to start this program again.`,
      [ru]: `Нажмите кнопку "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].back,
      )})", чтобы вернуться к списку программ или нажмите кнопку "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].repeat,
      )})", чтобы запустить эту программу с начала.`,
    },
  },
  [PROGRAM_EDITOR_TRK]: {
    [TK[PROGRAM_EDITOR_TRK].newProgram]: {
      [en]: "New program",
      [ru]: "Новая программа",
    },
    [TK[PROGRAM_EDITOR_TRK].editProgram]: {
      [en]: "Edit program",
      [ru]: "Редактировать программу",
    },
    [TK[PROGRAM_EDITOR_TRK].copyProgram]: {
      [en]: "Copy program",
      [ru]: "Копировать программу",
    },
    [TK[PROGRAM_EDITOR_TRK].deleteProgram]: {
      [en]: "Delete program",
      [ru]: "Удалить программу",
    },
    [TK[PROGRAM_EDITOR_TRK].saveToFile]: {
      [en]: "Save to file",
      [ru]: "Сохранить в файл",
    },
    [TK[PROGRAM_EDITOR_TRK].loadFromFile]: {
      [en]: "Load from file",
      [ru]: "Загрузить из файла",
    },
    [TK[PROGRAM_EDITOR_TRK].typeProgramTitle]: {
      [en]: "Type the title of the program...",
      [ru]: "Введите название программы...",
    },
    [TK[PROGRAM_EDITOR_TRK].programTitleError]: {
      [en]: "This title is already used, enter another one.",
      [ru]: "Это название уже занято какой-то программой, введите другое.",
    },
    [TK[PROGRAM_EDITOR_TRK].deleteProgHead]: {
      [en]: "Deleting the program",
      [ru]: "Удаление программы",
    },
    [TK[PROGRAM_EDITOR_TRK].deleteProgMsg]: {
      [en]: 'The selected program "{{programTitle}}" will be permanently deleted. Are you sure?',
      [ru]: 'Выбранная программа "{{programTitle}}" будет удалена без возможности восстановления. Вы уверены?',
    },
    [TK[PROGRAM_EDITOR_TRK].copyProgHead]: {
      [en]: "Copying program",
      [ru]: "Копирование программы",
    },
    [TK[PROGRAM_EDITOR_TRK].copyProgMsg]: {
      [en]: 'The new program will be created based on the selected "{{programTitle}}". You will need to enter a new title, make changes if necessary, and save.',
      [ru]: 'Новая программа будет создана на основе выбранной "{{programTitle}}". Нужно будет ввести новое имя, внести изменения, если потребуется, и сохранить.',
    },
  },
  [SETTINGS_TRK]: {
    [en]: {
      [en]: "English",
      [ru]: "Английский",
    },
    [ru]: {
      [en]: "Russian",
      [ru]: "Русский",
    },
    [TK[SETTINGS_TRK].languageTKey]: {
      [en]: "Language",
      [ru]: "Язык",
    },
    [TK[SETTINGS_TRK].interfaceTKey]: {
      [en]: "Interface",
      [ru]: "Интерфейс",
    },
    [TK[SETTINGS_TRK].peripheral]: {
      [en]: "Peripheral",
      [ru]: "Переферия",
    },
    [TK[SETTINGS_TRK].performance]: {
      [en]: "Performance",
      [ru]: "Производительность",
    },
    [TK[SETTINGS_TRK].advanced]: {
      [en]: "Advanced",
      [ru]: "Дополнительно",
    },
    [TK[SETTINGS_TRK].cursorNoneTitle]: {
      [en]: "Hide the cursor",
      [ru]: "Скрыть курсор",
    },
    [TK[SETTINGS_TRK].cursorNoneMsg]: {
      [en]: "Are you sure you want to hide the cursor?",
      [ru]: "Вы уверены, что хотите скрыть курсор?",
    },
    [TK[SETTINGS_TRK].showTipsTKey]: {
      [en]: "Show tips at the bottom of the page",
      [ru]: "Показывать подсказки внизу страницы",
    },
    [TK[SETTINGS_TRK].motorDisclaimerMsg]: {
      [en]: "TODO motorDisclaimerMsg",
      [ru]: "Внимание, в этом разделе вы можете навредить своему оборудованию. Убедитесь, что понимаете что делаете.",
    },
    [TK[SETTINGS_TRK].toCalibrateMotorBut]: {
      [en]: "TODO calibrationBut",
      [ru]: "Калибровка двигателя",
    },
    [TK[SETTINGS_TRK].toCalibrateMotorMsg]: {
      [en]: "TODO calibrationMsg",
      [ru]: "TODO calibrationMsg",
    },
    [TK[SETTINGS_TRK].toCalibrateCadenceBut]: {
      [en]: "TODO toCalibrateCadenceBut",
      [ru]: "Калибровка датчика скорости",
    },
    [TK[SETTINGS_TRK].toCalibrateCadenceMsg]: {
      [en]: "TODO toCalibrateCadenceMsg",
      [ru]: "TODO toCalibrateCadenceMsg",
    },
    [TK[SETTINGS_TRK].sleepRatioKey]: {
      [en]: "TODO sleepRatioKey",
      [ru]: "TODO sleepRatioKey",
    },
    [TK[SETTINGS_TRK].sleepRatioHead]: {
      [en]: "TODO sleepRatioHead",
      [ru]: "TODO sleepRatioHead",
    },
    [TK[SETTINGS_TRK].sleepRatioMsg]: {
      [en]: "TODO sleepRatioMsg",
      [ru]: "TODO sleepRatioMsg",
    },
    [TK[SETTINGS_TRK].spiTitle]: {
      [en]: "SPI (Serial Peripheral Interface)",
      [ru]: "SPI (Последовательный Периферийный Интерфейс)",
    },
    [TK[SETTINGS_TRK].spiOnHead]: {
      [en]: "Turn on SPI",
      [ru]: "Включение SPI",
    },
    [TK[SETTINGS_TRK].spiOnMsg]: {
      [en]: "TODO spiOnMsg",
      [ru]: `Для корректной работы приложения необходимо включить интерфейс SPI в настройках операционной системы. Вы можете сделать это в настройках или в консоли выполнив команду raspi-config. После включение необходимо перезагрузить устройство. В этом приложении доступна возможность включить эту настройку, но я не рекомендую пользоваться этой функцией, т.к. она всё ещё находится в разработке. Если вы все же хотите воспользоваться ей, то нажмите кнопку "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].turnOn,
      )})" и введите пароль администратора.`,
    },
    [TK[SETTINGS_TRK].spiTipHead]: {
      [en]: "Turn on SPI",
      [ru]: "Включение SPI",
    },
    [TK[SETTINGS_TRK].spiTipMsg]: {
      [en]: "TODO spiTipMsg",
      [ru]: "Интерфейс SPI уже включен на этом устройстве. После включения требуется перезагрузка устройства для корретной работы.",
    },
    [TK[SETTINGS_TRK].spiAboutMsg]: {
      [en]: "TODO spiAboutMsg",
      [ru]: "Эта функция необходима для получения данных с потенциометра, если она не включена, то приложение не сможет работать. На данный момент программная эмуляция SPI не реализована.",
    },
  },
  [TIPS_TRK]: {
    [TK[TIPS_TRK].tipBut]: {
      [en]: "Tips",
      [ru]: "Подсказки",
    },
    [TK[TIPS_TRK].tipDescrip]: {
      [en]: "To the right of the button you clicked, there are tips.",
      [ru]: "Справа от кнопки, которую вы нажали, находятся подсказки.",
    },
    [TK[TIPS_TRK].tipTitle]: {
      [en]: "Tip",
      [ru]: "Подсказка",
    },
    [TK[TIPS_TRK].settingsTip]: {
      [en]: "go to the settings page.",
      [ru]: "переход на страницу настроек приложения.",
    },
    [TK[TIPS_TRK].quitBut]: {
      [en]: "Quit",
      [ru]: "Выход",
    },
    [TK[TIPS_TRK].quitTip]: {
      [en]: "quit the app.",
      [ru]: "выход из приложения.",
    },
    [TK[TIPS_TRK].rpmBut]: {
      [en]: "Speed",
      [ru]: "Скорость",
    },
    [TK[TIPS_TRK].rpmTip]: {
      [en]: "the desired running speed on the sector.",
      [ru]: "желаемая скорость бега на участке.",
    },
    [TK[TIPS_TRK].totalDurationBut]: {
      [en]: "Total duration",
      [ru]: "Общая продолжительность",
    },
    [TK[TIPS_TRK].totalDurationTip]: {
      [en]: "the total duration of the workout.",
      [ru]: "общая продолжительность тренировки.",
    },
    [TK[TIPS_TRK].resistanceBut]: {
      [en]: "Resistance level",
      [ru]: "Уровень нагрузки",
    },
    [TK[TIPS_TRK].resistanceTip]: {
      [en]: "the level of load on the sector.",
      [ru]: "уровень нагрузки на участке.",
    },
    [TK[TIPS_TRK].languageTip]: {
      [en]: "application language selection menu.",
      [ru]: "меню выбора языка приложения.",
    },
    [TK[TIPS_TRK].interfaceTip]: {
      [en]: "setting up interface elements.",
      [ru]: "настройка элементов интерфейса.",
    },
    [TK[TIPS_TRK].peripheralTip]: {
      [en]: "setting up connected components.",
      [ru]: "настройка подключенных компонентов.",
    },
    [TK[TIPS_TRK].manualModeTip]: {
      [en]: "a training mode in which the resistance level changes manually.",
      [ru]: "режим тренировки, при котором изменение уровня нагрузки производится вручную.",
    },
    [TK[TIPS_TRK].selectProgramTip]: {
      [en]: "list to select of a program for training in auto mode in which the resistance level changes in according with a pre-written program.",
      [ru]: "выбор программы для тренировки в автоматическом режиме, изменение уровня нагрузки происходит в соответствии с заранее написанной программой.",
    },
    [TK[TIPS_TRK].programEditorTip]: {
      [en]: "program editor for training in auto mode.",
      [ru]: "редактор программ для тренировки в автоматическом режиме.",
    },
    [TK[TIPS_TRK].motorBut]: {
      [en]: "Motor",
      [ru]: "Двигатель",
    },
    [TK[TIPS_TRK].motorTip]: {
      [en]: "TODO motorTip",
      [ru]: "TODO motorTip",
    },
    [TK[TIPS_TRK].calibrationBut]: {
      [en]: "Calibration",
      [ru]: "Калибровка",
    },
    [TK[TIPS_TRK].calibrationTip]: {
      [en]: "TODO calibrationTip",
      [ru]: "TODO calibrationTip",
    },
    [TK[TIPS_TRK].heartBeatSettingsBut]: {
      [en]: "Heartbeat",
      [ru]: "Сердцебиение",
    },
    [TK[TIPS_TRK].heartBeatSettingsTip]: {
      [en]: "TODO heartBeatSettingsTip",
      [ru]: "TODO heartBeatSettingsTip",
    },
    [TK[TIPS_TRK].rpmSettingsBut]: {
      [en]: "Speedometer",
      [ru]: "Спидометр",
    },
    [TK[TIPS_TRK].rpmSettingsTip]: {
      [en]: "TODO rpmSettingsTip",
      [ru]: "TODO rpmSettingsTip",
    },
    [TK[TIPS_TRK].motorToLeftBut]: {
      [en]: "TODO motorToLeftBut",
      [ru]: "TODO motorToLeftBut",
    },
    [TK[TIPS_TRK].motorToLeftTip]: {
      [en]: "TODO motorToLeftTip",
      [ru]: "TODO motorToLeftTip",
    },
    [TK[TIPS_TRK].motorToRightBut]: {
      [en]: "TODO motorToRightBut",
      [ru]: "TODO motorToRightBut",
    },
    [TK[TIPS_TRK].motorToRightTip]: {
      [en]: "TODO motorToRightTip",
      [ru]: "TODO motorToRightTip",
    },
    [TK[TIPS_TRK].motorPotenBut]: {
      [en]: "Potentiometer",
      [ru]: "Потенциометр",
    },
    [TK[TIPS_TRK].motorPotenTip]: {
      [en]: "TODO motorPotenTip",
      [ru]: "Текущие показания потенциометра двигателя, другими словами значения положения двигателя.",
    },
    [TK[TIPS_TRK].motorMinPosBut]: {
      [en]: "Easiest position",
      [ru]: "Легчайшее положение",
    },
    [TK[TIPS_TRK].motorMinPosTip]: {
      [en]: "TODO motorMinPosTip",
      [ru]: "TODO motorMinPosTip",
    },
    [TK[TIPS_TRK].motorMaxPosBut]: {
      [en]: "Hardest position",
      [ru]: "Тяжелейшее положение",
    },
    [TK[TIPS_TRK].motorMaxPosTip]: {
      [en]: "TODO motorMaxPosTip",
      [ru]: "TODO motorMaxPosTip",
    },
    [TK[TIPS_TRK].motorSwapMotorWiresBut]: {
      [en]: "Swap motor wires",
      [ru]: "Поменять местами провода двигателя",
    },
    [TK[TIPS_TRK].motorSwapMotorWiresTip]: {
      [en]: "TODO motorSwapMotorWiresTip",
      [ru]: "TODO motorSwapMotorWiresTip",
    },
    [TK[TIPS_TRK].motorSwapPotenWiresBut]: {
      [en]: "Swap potentiometer wires",
      [ru]: "Поменять местами провода потенциометра",
    },
    [TK[TIPS_TRK].motorSwapPotenWiresTip]: {
      [en]: "TODO motorSwapPotenWiresTip",
      [ru]: "TODO motorSwapPotenWiresTip",
    },
  },
  [ERRORS_TRK]: {
    [ERRORS.UNKNOWN_ERROR]: {
      [en]: "TODO UNKNOWN_ERROR",
      [ru]: "TODO UNKNOWN_ERROR",
    },
    [ERRORS.GPIO_EPERM]: {
      [en]: "TODO GPIO_EPERM",
      [ru]: "TODO GPIO_EPERM",
    },
    [ERRORS.POTEN_ERROR]: {
      [en]: "TODO POTEN_ERROR",
      [ru]: "TODO POTEN_ERROR",
    },
    [ERRORS.INVALID_RESIST_LEVEL]: {
      [en]: "TODO INVALID_RESIST_LEVEL",
      [ru]: "TODO INVALID_RESIST_LEVEL",
    },
    [ERRORS.LOADING_TIMER_EXPIRED]: {
      [en]: "TODO LOADING_TIMER_EXPIRED",
      [ru]: "TODO LOADING_TIMER_EXPIRED",
    },
    [ERRORS.CALIBRATION_NO_DATA]: {
      [en]: "TODO CALIBRATION_NO_DATA",
      [ru]: "TODO CALIBRATION_NO_DATA",
    },
    [ERRORS.CALIBRATION_INVALID_EDGES]: {
      [en]: "TODO CALIBRATION_INVALID_EDGES",
      [ru]: "TODO CALIBRATION_INVALID_EDGES",
    },
    [ERRORS.CALIBRATION_WRONG_DIRECTION]: {
      [en]: "TODO CALIBRATION_WRONG_DIRECTION",
      [ru]: "TODO CALIBRATION_WRONG_DIRECTION",
    },
    [ERRORS.CALIBRATION_HINDRANCE]: {
      [en]: "TODO CALIBRATION_HINDRANCE",
      [ru]: "TODO CALIBRATION_HINDRANCE",
    },
    [ERRORS.CALIBRATION_TOO_LONG]: {
      [en]: "TODO CALIBRATION_TOO_LONG",
      [ru]: "TODO CALIBRATION_TOO_LONG",
    },
    [ERRORS.CALIBRATION_UNKNOWN]: {
      [en]: "TODO CALIBRATION_UNKNOWN",
      [ru]: "TODO CALIBRATION_UNKNOWN",
    },
    [ERRORS.PROMISE_CANCELLED]: {
      [en]: "TODO PROMISE_CANCELLED",
      [ru]: "TODO PROMISE_CANCELLED",
    },
    [ERRORS.BOOT_CONFIG_NOT_EXIST]: {
      [en]: "TODO BOOT_CONFIG_NOT_EXIST",
      [ru]: "TODO BOOT_CONFIG_NOT_EXIST",
    },
    [ERRORS.BOOT_CONFIG_WRONG_ARGS]: {
      [en]: "TODO BOOT_CONFIG_WRONG_ARGS",
      [ru]: "TODO BOOT_CONFIG_WRONG_ARGS",
    },
    [ERRORS.BOOT_CONFIG_INVALID_ARG]: {
      [en]: "TODO BOOT_CONFIG_INVALID_ARG",
      [ru]: "TODO BOOT_CONFIG_INVALID_ARG",
    },
    [ERRORS.SUDO_NOT_GRANT_PERMISSION]: {
      [en]: "User did not grant permission.",
      [ru]: "Пользователь не предоставил разрешение.",
    },
  },
};

export default getNormalizedTranslation(resources);
