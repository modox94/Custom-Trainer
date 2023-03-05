import { Classes } from "@blueprintjs/core";
import clsx from "clsx";
import { get, isFinite } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motorCalibration, useGetSettingsQuery } from "../../api/ipc";
import { DASH } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
import { MOTOR_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const {
  toCalibrateBut,
  toCalibrateHead,
  toCalibrateMsg,
  sleepRatioKey,
  sleepRatioHead,
  sleepRatioMsg,
} = TRANSLATION_KEYS[SETTINGS_TRK];
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
      <Container>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={toCalibrateMotor}
        >
          <h1>{t(getTPath(toCalibrateBut))}</h1>
        </Item>
        <Item>
          <h1>{t(getTPath(sleepRatioKey))}</h1>
          <h1>{!isFinite(sleepRatio) ? DASH : String(sleepRatio)}</h1>
        </Item>
      </Container>
      <Container>
        <Item>
          <h1>{error && String(error)}</h1>
        </Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Calibration;
