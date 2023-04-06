import { Alignment, Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { isFinite, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  editSettings,
  motorCalibCalcSleepRatio,
  motorCalibDirectionTest,
} from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import { MOTOR_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import InputNumber from "../InputNumber/InputNumber";
import MultistepDialogCustom from "../MultistepDialogCustom/MultistepDialogCustom";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { warning } = TRANSLATION_KEYS[COMMON_TRK];
const {
  calibMotorCalcSleepRatioMsg,
  calibMotorCalcSleepRatioTitle,
  calibMotorDirectionTestMsg,
  calibMotorDirectionTestTitle,
  calibMotorFinishMsg,
  calibMotorFinishTitle,
  calibMotorWarningMsg,
  toCalibrateCadenceBut,
} = TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const SLEEP_RATIO_STEP = 1;

const DIALOG_STEPS = {
  WARNING: "WARNING",
  DIRECTION_TEST: "DIRECTION_TEST",
  CALC_SLEEP_RATIO: "CALC_SLEEP_RATIO",
  FINISH: "FINISH",
};

const DIALOG_STEPS_A = Object.values(DIALOG_STEPS);

const emptyObj = {};

const CalibrationMotorDialog = props => {
  const { onClose } = props;
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(DIALOG_STEPS_A[0]);
  const [stepInProgress, setStepInProgress] = useState(false);
  const [directionTestResult, setDirectionTestResult] = useState(null);
  const [calcSleepRatioResult, setCalcSleepRatio] = useState(null);

  const onChangeStep = newStep => {
    switch (newStep) {
      case DIALOG_STEPS.WARNING:
        break;

      case DIALOG_STEPS.DIRECTION_TEST:
        break;

      case DIALOG_STEPS.CALC_SLEEP_RATIO:
        break;

      case DIALOG_STEPS.FINISH:
        break;

      default:
        break;
    }

    setCurrentStep(newStep);
  };

  const onDecreaseCalcSleepRatio = useCallback(() => {
    if (!isFinite(calcSleepRatioResult)) {
      return;
    } else if (calcSleepRatioResult > 0) {
      setCalcSleepRatio(calcSleepRatioResult - SLEEP_RATIO_STEP);
    } else {
      setCalcSleepRatio(0);
    }
  }, [calcSleepRatioResult]);

  const onIncreaseCalcSleepRatio = useCallback(() => {
    if (!isFinite(calcSleepRatioResult)) {
      return;
    } else if (calcSleepRatioResult >= 0) {
      setCalcSleepRatio(calcSleepRatioResult + SLEEP_RATIO_STEP);
    } else {
      setCalcSleepRatio(0);
    }
  }, [calcSleepRatioResult]);

  const onDirectionTest = useCallback(async () => {
    if (stepInProgress || Boolean(directionTestResult)) {
      return;
    }

    setStepInProgress(DIALOG_STEPS.DIRECTION_TEST);
    const result = await motorCalibDirectionTest();
    setDirectionTestResult(result);
    setStepInProgress(false);
  }, [directionTestResult, stepInProgress]);

  const onCalcSleepRatio = useCallback(async () => {
    if (stepInProgress || Boolean(calcSleepRatioResult)) {
      return;
    }

    setStepInProgress(DIALOG_STEPS.CALC_SLEEP_RATIO);
    const result = await motorCalibCalcSleepRatio();
    setCalcSleepRatio(result);
    setStepInProgress(false);
  }, [calcSleepRatioResult, stepInProgress]);

  const onFinal = useCallback(() => {
    if (isFinite(calcSleepRatioResult)) {
      editSettings(
        FILE_CONST.PERIPHERAL,
        MOTOR_FIELDS.SLEEP_RATIO,
        calcSleepRatioResult,
      );
    }
    onClose();
  }, [calcSleepRatioResult, onClose]);

  const closeButtonProps = useMemo(() => {
    return { onClick: onClose };
  }, [onClose]);

  const finalButtonProps = useMemo(() => {
    const disabled =
      !isFinite(calcSleepRatioResult) ||
      Boolean(stepInProgress) ||
      !directionTestResult;

    return {
      disabled,
      onClick: disabled ? noop : onFinal,
    };
  }, [calcSleepRatioResult, directionTestResult, onFinal, stepInProgress]);

  const nextButtonProps = useMemo(() => {
    switch (currentStep) {
      case DIALOG_STEPS.WARNING:
        return emptyObj;

      case DIALOG_STEPS.DIRECTION_TEST:
        return { disabled: !directionTestResult || directionTestResult?.error };

      case DIALOG_STEPS.CALC_SLEEP_RATIO:
        return {
          disabled: !calcSleepRatioResult || calcSleepRatioResult?.error,
        };

      case DIALOG_STEPS.FINISH:
        return emptyObj;

      default:
        return emptyObj;
    }
  }, [calcSleepRatioResult, currentStep, directionTestResult]);

  const dialogSteps = useMemo(() => {
    let directionTestIcon,
      directionTestIntent,
      directionTestText,
      directionTestDisabled,
      directionTestLoading,
      calcSleepRatioIcon,
      calcSleepRatioIntent,
      calcSleepRatioText,
      calcSleepRatioDisabled,
      calcSleepRatioLoading;

    if (stepInProgress) {
      directionTestDisabled = true;
      directionTestLoading = true;
      calcSleepRatioDisabled = true;
      calcSleepRatioLoading = true;
    }

    if (directionTestResult?.error) {
      directionTestIcon = IconNames.ERROR;
      directionTestIntent = Intent.WARNING;
      directionTestText = "TODO test error";
      directionTestDisabled = true;
    } else if (directionTestResult) {
      directionTestIcon = IconNames.TICK;
      directionTestIntent = Intent.PRIMARY;
      directionTestText = "TODO dir tes fin";
      directionTestDisabled = true;
    } else {
      directionTestIcon = IconNames.PLAY;
      directionTestIntent = Intent.PRIMARY;
      directionTestText = "TODO start dir test";
    }

    if (calcSleepRatioResult?.error) {
      calcSleepRatioIcon = IconNames.ERROR;
      calcSleepRatioIntent = Intent.WARNING;
      calcSleepRatioText = "TODO test error";
      calcSleepRatioDisabled = true;
    } else if (calcSleepRatioResult) {
      calcSleepRatioIcon = IconNames.TICK;
      calcSleepRatioIntent = Intent.PRIMARY;
      calcSleepRatioText = "TODO calc sleep rat fin";
      calcSleepRatioDisabled = true;
    } else {
      calcSleepRatioIcon = IconNames.PLAY;
      calcSleepRatioIntent = Intent.PRIMARY;
      calcSleepRatioText = "TODO start calc sleep rat";
    }

    return [
      {
        key: DIALOG_STEPS.WARNING,
        id: DIALOG_STEPS.WARNING,
        title: t(getTranslationPath(COMMON_TRK, warning)),
        panel: t(getTPath(calibMotorWarningMsg)),
      },
      {
        key: DIALOG_STEPS.DIRECTION_TEST,
        id: DIALOG_STEPS.DIRECTION_TEST,
        title: t(getTPath(calibMotorDirectionTestTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibMotorDirectionTestMsg))}</p>
            <Button
              alignText={Alignment.CENTER}
              icon={directionTestIcon}
              intent={directionTestIntent}
              disabled={Boolean(directionTestDisabled)}
              loading={Boolean(directionTestLoading)}
              large
              fill
              text={directionTestText}
              onClick={onDirectionTest}
            />
          </>
        ),
      },
      {
        key: DIALOG_STEPS.CALC_SLEEP_RATIO,
        id: DIALOG_STEPS.CALC_SLEEP_RATIO,
        title: t(getTPath(calibMotorCalcSleepRatioTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibMotorCalcSleepRatioMsg))}</p>
            <Button
              alignText={Alignment.CENTER}
              icon={calcSleepRatioIcon}
              intent={calcSleepRatioIntent}
              disabled={Boolean(calcSleepRatioDisabled)}
              loading={Boolean(calcSleepRatioLoading)}
              large
              fill
              text={calcSleepRatioText}
              onClick={onCalcSleepRatio}
            />
          </>
        ),
      },
      {
        key: DIALOG_STEPS.FINISH,
        id: DIALOG_STEPS.FINISH,
        title: t(getTPath(calibMotorFinishTitle)),
        panel: (
          <>
            <p>{t(getTPath(calibMotorFinishMsg))}</p>
            <InputNumber
              onDecrease={onDecreaseCalcSleepRatio}
              onIncrease={onIncreaseCalcSleepRatio}
              value={calcSleepRatioResult || 0}
            />
          </>
        ),
      },
    ];
  }, [
    calcSleepRatioResult,
    directionTestResult,
    onCalcSleepRatio,
    onDecreaseCalcSleepRatio,
    onDirectionTest,
    onIncreaseCalcSleepRatio,
    stepInProgress,
    t,
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

CalibrationMotorDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  setError: PropTypes.func,
};

CalibrationMotorDialog.defaultProps = {
  onClose: noop,
  setError: noop,
};

export default CalibrationMotorDialog;
