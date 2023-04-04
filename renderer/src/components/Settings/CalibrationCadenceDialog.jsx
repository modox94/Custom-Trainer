import {
  Alignment,
  Button,
  ControlGroup,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get, isNumber, noop, round } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { editSettings, useGetCadenceQuery } from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import { CADENCE_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import MultistepDialogCustom from "../MultistepDialogCustom/MultistepDialogCustom";
import styles from "./Settings.module.css";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { warning } = TRANSLATION_KEYS[COMMON_TRK];
const { toCalibrateCadenceBut } = TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(COMMON_TRK, ...args);

const DIALOG_STEPS = {
  WARNING: "WARNING",
  COLLECT_DATA: "COLLECT_DATA",
  USER_DATA: "USER_DATA",
  FINISH: "FINISH",
};

const DIALOG_STEPS_A = Object.values(DIALOG_STEPS);

const emptyObj = {};

const CalibrationCadenceDialog = props => {
  const { onClose } = props;
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(DIALOG_STEPS_A[0]);
  const [collectedData, setCollectedData] = useState(0);
  const [collectingInProgress, setCollectingInProgress] = useState(false);
  const [userData, setUserData] = useState(0);
  const [gearRatio, setGearRatio] = useState();

  const cadenceObject = useGetCadenceQuery(undefined, {
    skip: !collectingInProgress,
  });
  const currentCadence = get(cadenceObject, ["data", "result"], 0);
  const lastTimecode = get(cadenceObject, ["data", "lastTimecode"]);

  useEffect(() => {
    if (collectingInProgress && lastTimecode) {
      setCollectedData(prevValue => prevValue + 1);
    }
  }, [lastTimecode, collectingInProgress]);

  const onChangeStep = newStep => {
    switch (newStep) {
      case DIALOG_STEPS.WARNING:
      case DIALOG_STEPS.COLLECT_DATA:
      case DIALOG_STEPS.USER_DATA:
        break;

      case DIALOG_STEPS.FINISH:
        const newGearRatio = round(collectedData / userData, 2);
        setGearRatio(newGearRatio);
        break;

      default:
        break;
    }

    setCurrentStep(newStep);
  };

  const onIncreaseUserData = useCallback(() => {
    if (isNumber(userData) && userData >= 0) {
      setUserData(userData + 1);
    } else {
      setUserData(0);
    }
  }, [userData]);

  const onDecreaseUserData = useCallback(() => {
    if (isNumber(userData) && userData > 0) {
      setUserData(userData - 1);
    } else {
      setUserData(0);
    }
  }, [userData]);

  const onIncreaseGearRatio = useCallback(() => {
    if (isNumber(gearRatio) && gearRatio >= 0) {
      setGearRatio(round(gearRatio + 0.01, 2));
    } else {
      setGearRatio(0);
    }
  }, [gearRatio]);

  const onDecreaseGearRatio = useCallback(() => {
    if (isNumber(gearRatio) && gearRatio > 0) {
      setGearRatio(round(gearRatio - 0.01, 2));
    } else {
      setGearRatio(0);
    }
  }, [gearRatio]);

  const onFinal = useCallback(() => {
    editSettings(FILE_CONST.PERIPHERAL, CADENCE_FIELDS.GEAR_RATIO, gearRatio);
    onClose();
  }, [gearRatio, onClose]);

  const closeButtonProps = useMemo(() => {
    return { onClick: onClose };
  }, [onClose]);

  const finalButtonProps = useMemo(() => {
    const disabled = !userData || !gearRatio;

    return {
      disabled,
      onClick: disabled ? noop : onFinal,
    };
  }, [gearRatio, onFinal, userData]);

  const nextButtonProps = useMemo(() => {
    switch (currentStep) {
      case DIALOG_STEPS.WARNING:
        return {};

      case DIALOG_STEPS.COLLECT_DATA:
        return { disabled: !collectedData };

      case DIALOG_STEPS.USER_DATA:
        return {};

      case DIALOG_STEPS.FINISH:
        return {};

      default:
        return {};
    }
  }, [collectedData, currentStep]);

  const dialogSteps = useMemo(() => {
    const toCollectData = () => {
      if (!collectedData && !collectingInProgress) {
        setCollectingInProgress(true);
      }

      if (collectingInProgress) {
        setCollectingInProgress(false);
      }
    };

    let icon, intent, text, disabled;

    if (!collectedData && !collectingInProgress) {
      icon = IconNames.PLAY;
      intent = Intent.PRIMARY;
      text = "TODO Начать калибровку";
    }

    if (collectingInProgress) {
      icon = IconNames.STOP;
      intent = Intent.SUCCESS;
      text = "TODO Закончить калибровку";
    }

    if (collectedData && !collectingInProgress) {
      icon = IconNames.PLAY;
      intent = Intent.PRIMARY;
      text = "TODO Начать калибровку";
      disabled = true;
    }

    return [
      {
        key: DIALOG_STEPS.WARNING,
        id: DIALOG_STEPS.WARNING,
        title: t(getTPath(warning)),
        panel:
          "TODO Калибровка датчика скорости будет проходить в несколько этапов. Нажмите Дальше, чтобы продолжить.",
      },
      {
        key: DIALOG_STEPS.COLLECT_DATA,
        id: DIALOG_STEPS.COLLECT_DATA,
        title: "TODO Сбор данных",
        panel: (
          <>
            <p>
              TODO Для калибровки датчика перед началом процедуры необходимо
              установить педали в положение, которое вам будет легко
              воспроизвести (например левый шатун в крайнем нижнем положении).
              Педали должны быть неподвижны. Затем вам следует нажать кнопку
              "Начать калибровку" ниже и совершить несколько (от 10 и больше)
              полных оборотов педалями с равномерной скоростью, вращая только
              вперед и остановить педали в том же положении, что при начале
              калибровки. Вы должны запомнить сколько именно полных оборотов вы
              сделали (от этого зависит точность расчетов). Затем вам следует
              нажать кнопку ниже "Закончить калибровку" и перейти к следующему
              шагу. collectedData:{collectedData} currentCadence:
              {currentCadence} lastTimecode:{lastTimecode}
            </p>
            <Button
              alignText={Alignment.CENTER}
              icon={icon}
              intent={intent}
              disabled={Boolean(disabled)}
              large
              fill
              text={text}
              onClick={toCollectData}
            />
          </>
        ),
      },
      {
        key: DIALOG_STEPS.USER_DATA,
        id: DIALOG_STEPS.USER_DATA,
        title: "TODO Ввод данных",
        panel: (
          <>
            <p>
              TODO Ниже вы должны ввести количество полных оборотов, которые вы
              произвели на предыдущем этапе
            </p>
            <ControlGroup fill>
              <Button
                large
                intent={Intent.PRIMARY}
                icon={IconNames.MINUS}
                onClick={onDecreaseUserData}
              />
              <InputGroup
                className={styles.textAlignCenter}
                large
                readOnly
                value={userData}
              />
              <Button
                large
                intent={Intent.PRIMARY}
                icon={IconNames.PLUS}
                onClick={onIncreaseUserData}
              />
            </ControlGroup>
          </>
        ),
      },
      {
        key: DIALOG_STEPS.FINISH,
        id: DIALOG_STEPS.FINISH,
        title: "TODO Сохранение",
        panel: (
          <>
            <p>
              TODO Ниже вы можете изменить рассчитанное передаточное число, если
              понимаете что делаете. В противном случае просто нажмите кнопку
              "Завергить".
            </p>
            <ControlGroup fill>
              <Button
                large
                intent={Intent.PRIMARY}
                icon={IconNames.MINUS}
                onClick={onDecreaseGearRatio}
              />
              <InputGroup
                className={styles.textAlignCenter}
                large
                readOnly
                value={gearRatio}
              />
              <Button
                large
                intent={Intent.PRIMARY}
                icon={IconNames.PLUS}
                onClick={onIncreaseGearRatio}
              />
            </ControlGroup>
          </>
        ),
      },
    ];
  }, [
    collectedData,
    collectingInProgress,
    currentCadence,
    gearRatio,
    lastTimecode,
    onDecreaseGearRatio,
    onDecreaseUserData,
    onIncreaseGearRatio,
    onIncreaseUserData,
    t,
    userData,
  ]);

  return (
    <MultistepDialogCustom
      isOpen
      title={t(getTranslationPath(SETTINGS_TRK, toCalibrateCadenceBut))}
      backButtonProps={emptyObj}
      closeButtonProps={closeButtonProps}
      finalButtonProps={finalButtonProps}
      nextButtonProps={nextButtonProps}
      onChange={onChangeStep}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      showCloseButtonInFooter
      dialogSteps={dialogSteps}
    />
  );
};

CalibrationCadenceDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  setError: PropTypes.func,
};

CalibrationCadenceDialog.defaultProps = {
  onClose: noop,
  setError: noop,
};

export default CalibrationCadenceDialog;
