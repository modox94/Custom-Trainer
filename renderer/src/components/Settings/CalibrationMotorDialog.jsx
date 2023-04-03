import MultistepDialogCustom from "../MultistepDialogCustom/MultistepDialogCustom";
import { Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { useTranslation } from "react-i18next";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { useMemo } from "react";
import {
  motorCalibration,
  stopMotor,
  useGetSettingsQuery,
} from "../../api/ipc";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { start, back, warning } = TRANSLATION_KEYS[COMMON_TRK];
const { toCalibrateMotorBut, toCalibrateCadenceBut, sleepRatioKey } =
  TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const emptyObj = {};

const CalibrationMotorDialog = props => {
  const { onClose } = props;
  const { t } = useTranslation();

  // if (loading) {
  //   return;
  // }
  // setLoading(true);
  // const result = await motorCalibration();
  // if (result?.error) {
  //   setError(result?.error);
  // }
  // setLoading(false);

  const closeButtonProps = useMemo(() => {
    return { onClick: onClose };
  }, [onClose]);

  const finalButtonProps = useMemo(() => {
    return {};
  }, []);

  const nextButtonProps = useMemo(() => {
    return {};
  }, []);

  return (
    <MultistepDialogCustom
      isOpen
      icon={IconNames.WARNING_SIGN}
      title={t(getTranslationPath(COMMON_TRK, warning))}
      backButtonProps={emptyObj}
      closeButtonProps={closeButtonProps}
      finalButtonProps={finalButtonProps}
      nextButtonProps={nextButtonProps}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      showCloseButtonInFooter
      dialogSteps={[
        {
          // backButtonProps: buttonPropShape,
          // className: PropTypes.string,
          key: "step1",
          id: "step1",
          // nextButtonProps: buttonPropShape,
          panel: "Step step step 1".repeat(500),
          // panelClassName: PropTypes.string,
          title: "Step 1",
        },
        {
          // backButtonProps: buttonPropShape,
          // className: PropTypes.string,
          key: "step2",
          id: "step2",
          // nextButtonProps: buttonPropShape,
          panel: <>Step step step 2</>,
          // panelClassName: PropTypes.string,
          title: "Step 2",
        },
      ]}
    />
  );
};

export default CalibrationMotorDialog;
