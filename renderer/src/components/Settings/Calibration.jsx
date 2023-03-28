import { Classes } from "@blueprintjs/core";
import clsx from "clsx";
import { get, isFinite } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  motorCalibration,
  stopMotor,
  useGetSettingsQuery,
} from "../../api/ipc";
import { DASH } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
import { MOTOR_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import SettingLine from "./SettingLine";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { start } = TRANSLATION_KEYS[COMMON_TRK];
const { toCalibrateBut, sleepRatioKey } = TRANSLATION_KEYS[SETTINGS_TRK];
const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const Calibration = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const sleepRatio = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SLEEP_RATIO],
    null,
  );

  useEffect(() => {
    return () => {
      stopMotor();
    };
  }, []);

  const toCalibrateMotor = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const result = await motorCalibration();
    if (result?.error) {
      setError(result?.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Container fullHeight>
        <Item className={clsx({ [Classes.SKELETON]: loading })}>
          <SettingLine
            title={t(getTPath(toCalibrateBut))}
            buttonText={t(getTranslationPath(COMMON_TRK, start))}
            onClick={toCalibrateMotor}
          />
        </Item>
        <Item className={clsx({ [Classes.SKELETON]: loading })}>
          <SettingLine
            title={t(getTPath(sleepRatioKey))}
            value={!isFinite(sleepRatio) ? DASH : String(sleepRatio)}
          />
          <SettingLine title={String(error)} />
        </Item>
      </Container>
    </>
  );
};

export default Calibration;
