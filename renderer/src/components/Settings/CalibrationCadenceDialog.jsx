import { Alignment, Button, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import MultistepDialogCustom from "../MultistepDialogCustom/MultistepDialogCustom";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { warning } = TRANSLATION_KEYS[COMMON_TRK];
const { toCalibrateCadenceBut } = TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(COMMON_TRK, ...args);

const DIALOG_STEPS = {
  WARNING: "WARNING",
  COLLECT_DATA: "COLLECT_DATA",
  FINISH: "FINISH",
};

const DIALOG_STEPS_A = Object.values(DIALOG_STEPS);

const emptyObj = {};

const CalibrationCadenceDialog = props => {
  const { onClose, setError } = props;
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(DIALOG_STEPS_A[0]);
  const [collectedData, setCollectedData] = useState(null);
  const [collectingInProgress, setCollectingInProgress] = useState(false);
  const [usersData, setUsersData] = useState();

  const onChangeStep = newStep => {
    switch (newStep) {
      case DIALOG_STEPS.WARNING:
        console.log("SCS1", newStep);

        break;

      case DIALOG_STEPS.COLLECT_DATA:
        console.log("SCS2", newStep);
        break;

      case DIALOG_STEPS.FINISH:
        console.log("SCS3", newStep);
        break;

      default:
        break;
    }

    setCurrentStep(newStep);
  };

  const closeButtonProps = useMemo(() => {
    return { onClick: onClose };
  }, [onClose]);

  const finalButtonProps = useMemo(() => {
    return { disabled: !usersData };
  }, [usersData]);

  const nextButtonProps = useMemo(() => {
    switch (currentStep) {
      case DIALOG_STEPS.WARNING:
        return {};

      case DIALOG_STEPS.COLLECT_DATA:
        return { disabled: !collectedData };

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

      if (!collectedData && collectingInProgress) {
        setCollectedData(5);
        setCollectingInProgress(false);
      }
    };

    let icon, intent, text, disabled;

    if (!collectedData && !collectingInProgress) {
      icon = IconNames.PLAY;
      intent = Intent.PRIMARY;
      text = "TODO Начать калибровку";
    }

    if (!collectedData && collectingInProgress) {
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
              шагу.
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
        key: DIALOG_STEPS.FINISH,
        id: DIALOG_STEPS.FINISH,
        title: "Step 3",
        panel: <>Step step step 3 </>,
      },
    ];
  }, [collectedData, collectingInProgress, t]);

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
