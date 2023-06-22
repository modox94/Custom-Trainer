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
    [TK[COMMON_TRK].errorTKey]: {
      [en]: "Error",
      [ru]: "Ошибка",
    },
    [TK[COMMON_TRK].start]: {
      [en]: "Start",
      [ru]: "Начать",
    },
    [TK[COMMON_TRK].finish]: {
      [en]: "Finish",
      [ru]: "Завершить",
    },
    [TK[COMMON_TRK].continueTKey]: {
      [en]: "Continue",
      [ru]: "Продолжить",
    },
    [TK[COMMON_TRK].allDataWillLost]: {
      [en]: "All changes will be lost!",
      [ru]: "Все изменения будут потеряны!",
    },
  },
  [WORKOUT_TRK]: {
    [TK[WORKOUT_TRK].programMode]: {
      [en]: "Program mode",
      [ru]: "Режим программы",
    },
    [TK[WORKOUT_TRK].currentTKey]: {
      [en]: "Current",
      [ru]: "Текущее",
    },
    [TK[WORKOUT_TRK].remainingTKey]: {
      [en]: "Remaining",
      [ru]: "Оставшееся",
    },
    [TK[WORKOUT_TRK].elapsedTKey]: {
      [en]: "Elapsed",
      [ru]: "Прошедшее",
    },
    [TK[WORKOUT_TRK].timeTKey]: {
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
    [TK[SETTINGS_TRK].devStatusTKey]: {
      [en]: "Developer mode",
      [ru]: "Режим разработчика",
    },
    [TK[SETTINGS_TRK].motorDisclaimerMsg]: {
      [en]: "Attention, on this page you can harm your equipment. Make sure you understand what you're doing.",
      [ru]: "Внимание, в этом разделе вы можете навредить своему оборудованию. Убедитесь, что понимаете что делаете.",
    },
    [TK[SETTINGS_TRK].toCalibrateMotorBut]: {
      [en]: "Motor calibration",
      [ru]: "Калибровка двигателя",
    },
    [TK[SETTINGS_TRK].toCalibrateMotorMsg]: {
      [en]: "TODO calibrationMsg",
      [ru]: "TODO calibrationMsg",
    },
    [TK[SETTINGS_TRK].toCalibrateCadenceBut]: {
      [en]: "Speed sensor calibration",
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
      [en]: `You have to enable the SPI interface in the operating system settings. You can do this in the OS settings menu or in the console by running the raspi-config command. After this, you should reboot the device. There is an option to enable this setting in this app, but I do not recommend using this feature, because it is still in development. If you still want to use it, then click the "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].turnOn,
      )})" and enter the administrator password.`,
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
      [en]: "The SPI interface is already enabled on this device. After switching on, the device needs to be rebooted for correct works.",
      [ru]: "Интерфейс SPI уже включен на этом устройстве. После включения требуется перезагрузка устройства для корретной работы.",
    },
    [TK[SETTINGS_TRK].spiAboutMsg]: {
      [en]: "This option is necessary to receive data from the potentiometer, if it is not enabled, the application will not be able to work. At the moment, SPI software emulation is not implemented at this app.",
      [ru]: "Эта функция необходима для получения данных с потенциометра, если она не включена, то приложение не сможет работать. На данный момент программная эмуляция SPI не реализована в этом приложении.",
    },
    [TK[SETTINGS_TRK].gearRatioKey]: {
      [en]: "Gear ratio of speed sensor",
      [ru]: "Передаточное число датчика скорости",
    },
    [TK[SETTINGS_TRK].startCalibration]: {
      [en]: "Start calibration",
      [ru]: "Начать калибровку",
    },
    [TK[SETTINGS_TRK].stopCalibration]: {
      [en]: "Stop calibration",
      [ru]: "Закончить калибровку",
    },
    [TK[SETTINGS_TRK].calibCadenWarningMsg]: {
      [en]: `Calibration of the speed sensor will take place in several stages. Press "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].next,
      )})" button for continue.`,
      [ru]: `Калибровка датчика скорости будет проходить в несколько этапов. Нажмите кнопку "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].next,
      )})", чтобы продолжить.`,
    },
    [TK[SETTINGS_TRK].calibCadenCollectDataTitle]: {
      [en]: "Collect data",
      [ru]: "Сбор данных",
    },
    [TK[SETTINGS_TRK].calibCadenCollectDataMsg]: {
      [en]: `Before starting the procedure, you should set the pedals to a position that will be easy for you to reproduce (for example, the left crank in the lowest position). The pedals have to be motionless. Then you should press "$t(${getTP(
        SETTINGS_TRK,
        TK[SETTINGS_TRK].startCalibration,
      )})" button below and make a few (~10) full cycles with the pedals at a steady speed, rotating only forward and stop the pedals in the same position as at the beginning of the calibration. You must remember exactly how many full cycles you made (the accuracy of the calculations depends on this). Then you should click "$t(${getTP(
        SETTINGS_TRK,
        TK[SETTINGS_TRK].stopCalibration,
      )})" button below and go to the next step.`,
      [ru]: `Для калибровки датчика перед началом процедуры необходимо установить педали в положение, которое вам будет легко воспроизвести (например левый шатун в крайнем нижнем положении). Педали должны быть неподвижны. Затем вам следует нажать кнопку "$t(${getTP(
        SETTINGS_TRK,
        TK[SETTINGS_TRK].startCalibration,
      )})" ниже и совершить несколько (~10) полных оборотов педалями с равномерной скоростью, вращая только вперед и остановить педали в том же положении, что при начале калибровки. Вы должны запомнить сколько именно полных оборотов вы сделали (от этого зависит точность расчетов). Затем вам следует нажать кнопку ниже "$t(${getTP(
        SETTINGS_TRK,
        TK[SETTINGS_TRK].stopCalibration,
      )})" и перейти к следующему шагу.`,
    },
    [TK[SETTINGS_TRK].calibCadenUserDataTitle]: {
      [en]: "Data input",
      [ru]: "Ввод данных",
    },
    [TK[SETTINGS_TRK].calibCadenUserDataMsg]: {
      [en]: "You must enter below the number of complete cycles that you made in the previous step.",
      [ru]: "Ниже вы должны ввести количество полных оборотов, которые вы совершили на предыдущем шаге.",
    },
    [TK[SETTINGS_TRK].calibCadenFinishTitle]: {
      [en]: "Saving",
      [ru]: "Сохранение",
    },
    [TK[SETTINGS_TRK].calibCadenFinishMsg]: {
      [en]: `Below you can change the calculated gear ratio if you understand what you are doing. Otherwise just press "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].finish,
      )})" button.`,
      [ru]: `Ниже вы можете изменить рассчитанное передаточное число, если понимаете что делаете. В противном случае просто нажмите кнопку "$t(${getTP(
        COMMON_TRK,
        TK[COMMON_TRK].finish,
      )})".`,
    },
    [TK[SETTINGS_TRK].calibMotorWarningMsg]: {
      [en]: "TODO calibMotorWarningMsg",
      [ru]: "TODO calibMotorWarningMsg",
    },
    [TK[SETTINGS_TRK].calibMotorDirectionTestTitle]: {
      [en]: "TODO calibMotorDirectionTestTitle",
      [ru]: "TODO calibMotorDirectionTestTitle",
    },
    [TK[SETTINGS_TRK].calibMotorDirectionTestMsg]: {
      [en]: "TODO calibMotorDirectionTestMsg",
      [ru]: "TODO calibMotorDirectionTestMsg",
    },
    [TK[SETTINGS_TRK].calibMotorCalcSleepRatioTitle]: {
      [en]: "TODO calibMotorCalcSleepRatioTitle",
      [ru]: "TODO calibMotorCalcSleepRatioTitle",
    },
    [TK[SETTINGS_TRK].calibMotorCalcSleepRatioMsg]: {
      [en]: "TODO calibMotorCalcSleepRatioMsg",
      [ru]: "TODO calibMotorCalcSleepRatioMsg",
    },
    [TK[SETTINGS_TRK].calibMotorFinishTitle]: {
      [en]: "TODO calibMotorFinishTitle",
      [ru]: "TODO calibMotorFinishTitle",
    },
    [TK[SETTINGS_TRK].calibMotorFinishMsg]: {
      [en]: "TODO calibMotorFinishMsg",
      [ru]: "TODO calibMotorFinishMsg",
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
      [en]: "Left",
      [ru]: "Налево",
    },
    [TK[TIPS_TRK].motorToLeftTip]: {
      [en]: "The conditional direction of movement of the motor.",
      [ru]: "Условное направление движения двигателя.",
    },
    [TK[TIPS_TRK].motorToRightBut]: {
      [en]: "Right",
      [ru]: "Направо",
    },
    [TK[TIPS_TRK].motorToRightTip]: {
      [en]: "The conditional direction of movement of the motor.",
      [ru]: "Условное направление движения двигателя.",
    },
    [TK[TIPS_TRK].motorPotenBut]: {
      [en]: "Potentiometer",
      [ru]: "Потенциометр",
    },
    [TK[TIPS_TRK].motorPotenTip]: {
      [en]: "The current reading of the motor potentiometer, in other words the position of the motor.",
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
    [ERRORS.INVALID_MOTOR_SETTINGS]: {
      [en]: "Your motor is not configured or its settings are invalid. Go to the motor settings section and fix it.",
      [ru]: "Ваш двигатель не настроен или его настройки недопустимы. Перейдите в раздел настройки двигателя и исправьте их.",
    },
    [ERRORS.POTEN_VALUE_OUT_RANGE]: {
      [en]: "Potentiometer value out of range. The value must be greater than {{MIN_POTEN_VALUE}} and less than {{MAX_POTEN_VALUE}}.",
      [ru]: "Значение потенциометра вне допустимых пределов. Значение должно быть больше {{MIN_POTEN_VALUE}} и меньше {{MAX_POTEN_VALUE}}.",
    },
    [ERRORS.MOTOR_MIN_HIGH_MAX_LOW]: {
      [en]: "The value at easiest position cannot be greater than at hardest position. Also, the hardest position value cannot be less than the easiest position value.",
      [ru]: "Значение при низкой нагрузке не может быть больше, чем при высокой нагрузке. Также значение при высокой нагрузке не может быть меньше, чем значение при низкой нагрузке.",
    },
    [ERRORS.MOTOR_MIN_MAX_INVALID]: {
      [en]: "This value cannot be saved because the minimum stroke range of the motor must be at least {{MIN_MOTOR_STROKE}}.",
      [ru]: "Такое значение не может быть сохранено, т.к. минимальный диапазон хода двигателя должен быть не менее {{MIN_MOTOR_STROKE}}.",
    },
    [ERRORS.MOTOR_SHORT_STROKE]: {
      [en]: "At current settings, the motor stroke range is less than the allowable value ({{MIN_MOTOR_STROKE}}).",
      [ru]: "При текущих настройках диапазон хода двигателя меньше допустимого значения ({{MIN_MOTOR_STROKE}}).",
    },
    [ERRORS.MOTOR_SETTINGS_RESET]: {
      [en]: "Changing this parameter will reset all other motor settings.",
      [ru]: "При изменении этого параметра все остальные настройки двигателя будут сброшены.",
    },
    [ERRORS.BOOT_CONFIG_SPI_OFF]: {
      [en]: "You have to enable the SPI interface in the settings.",
      [ru]: "Для корректной работы приложения необходимо включить интерфейс SPI в настройках.",
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
