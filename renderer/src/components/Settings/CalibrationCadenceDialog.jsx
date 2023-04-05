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
const {
  calibCadenCollectDataMsg,
  calibCadenCollectDataTitle,
  calibCadenFinishMsg,
  calibCadenFinishTitle,
  calibCadenUserDataMsg,
  calibCadenUserDataTitle,
  calibCadenWarningMsg,
  startCalibration,
  stopCalibration,
  toCalibrateCadenceBut,
} = TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

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
    const disabled = !(userData > 0) || !(gearRatio > 0);

    return {
      disabled,
      onClick: disabled ? noop : onFinal,
    };
  }, [gearRatio, onFinal, userData]);

  const nextButtonProps = useMemo(() => {
    switch (currentStep) {
      case DIALOG_STEPS.WARNING:
        return emptyObj;

      case DIALOG_STEPS.COLLECT_DATA:
        return { disabled: !(collectedData > 0) || collectingInProgress };

      case DIALOG_STEPS.USER_DATA:
        return { disabled: !(userData > 0) };

      case DIALOG_STEPS.FINISH:
        return emptyObj;

      default:
        return emptyObj;
    }
  }, [collectedData, collectingInProgress, currentStep, userData]);

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

    if (!collectingInProgress) {
      icon = IconNames.PLAY;
      intent = Intent.PRIMARY;
      text = t(getTPath(startCalibration));
      disabled = collectedData > 0;
    }

    if (collectingInProgress) {
      icon = IconNames.STOP;
      intent = Intent.SUCCESS;
      text = t(getTPath(stopCalibration));
    }

    return [
      {
        key: DIALOG_STEPS.WARNING,
        id: DIALOG_STEPS.WARNING,
        title: t(getTranslationPath(COMMON_TRK, warning)),
        panel: t(getTPath(calibCadenWarningMsg)),
      },
      {
        key: DIALOG_STEPS.COLLECT_DATA,
        id: DIALOG_STEPS.COLLECT_DATA,
        title: t(getTPath(calibCadenCollectDataTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibCadenCollectDataMsg))}</p>
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
        title: t(getTPath(calibCadenUserDataTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibCadenUserDataMsg))}</p>
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
        title: t(getTPath(calibCadenFinishTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibCadenFinishMsg))}</p>
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
    gearRatio,
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
      title={t(getTPath(toCalibrateCadenceBut))}
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
