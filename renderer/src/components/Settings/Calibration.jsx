import { Classes } from "@blueprintjs/core";
import clsx from "clsx";
import { get, isFinite } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { stopMotor, useGetSettingsQuery } from "../../api/ipc";
import { COMMON_CONST } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
import { CADENCE_FIELDS, MOTOR_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import ErrorText from "../ErrorText/ErrorText";
import { Container, Item } from "../SquareGrid/SquareGrid";
import CalibrationCadenceDialog from "./CalibrationCadenceDialog";
import CalibrationMotorDialog from "./CalibrationMotorDialog";
import SettingLine from "./SettingLine";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { start } = TRANSLATION_KEYS[COMMON_TRK];
const {
  toCalibrateMotorBut,
  toCalibrateCadenceBut,
  sleepRatioKey,
  gearRatioKey,
} = TRANSLATION_KEYS[SETTINGS_TRK];

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const DIALOG_TYPE = {
  MOTOR: "MOTOR",
  CADENCE: "CADENCE",
};

const Calibration = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dialogType, setDialogType] = useState();
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const sleepRatio = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SLEEP_RATIO],
    null,
  );
  const gearRatio = get(
    settings,
    [FILE_CONST.PERIPHERAL, CADENCE_FIELDS.GEAR_RATIO],
    null,
  );

  useEffect(() => {
    return () => {
      stopMotor();
    };
  }, []);

  const toCalibrateMotor = () => {
    setLoading(true);
    setDialogType(DIALOG_TYPE.MOTOR);
  };

  const toCalibrateCadence = () => {
    setLoading(true);
    setDialogType(DIALOG_TYPE.CADENCE);
  };

  const onCloseDialog = () => {
    setLoading(false);
    setDialogType(undefined);
  };

  return (
    <>
      <Container fullHeight>
        <Item className={clsx({ [Classes.SKELETON]: loading })}>
          <SettingLine
            title={t(getTPath(toCalibrateMotorBut))}
            buttonText={t(getTranslationPath(COMMON_TRK, start))}
            onClick={toCalibrateMotor}
          />
          <SettingLine
            title={t(getTPath(toCalibrateCadenceBut))}
            buttonText={t(getTranslationPath(COMMON_TRK, start))}
            onClick={toCalibrateCadence}
          />
        </Item>
        <Item className={clsx({ [Classes.SKELETON]: loading })}>
          <SettingLine
            title={t(getTPath(sleepRatioKey))}
            value={
              !isFinite(sleepRatio) ? COMMON_CONST.DASH : String(sleepRatio)
            }
          />
          <SettingLine
            title={t(getTPath(gearRatioKey))}
            value={!isFinite(gearRatio) ? COMMON_CONST.DASH : String(gearRatio)}
          />
          {error ? <SettingLine title={<ErrorText error={error} />} /> : null}
        </Item>
      </Container>

      {dialogType === DIALOG_TYPE.MOTOR && (
        <CalibrationMotorDialog onClose={onCloseDialog} setError={setError} />
      )}
      {dialogType === DIALOG_TYPE.CADENCE && (
        <CalibrationCadenceDialog onClose={onCloseDialog} setError={setError} />
      )}
    </>
  );
};

export default Calibration;
