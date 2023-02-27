import { Classes } from "@blueprintjs/core";
import clsx from "clsx";
import { get, isFinite } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  motorCalibration,
  turnOnSPI,
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

const { SETTINGS } = TRANSLATION_ROOT_KEYS;
const {
  toCalibrateBut,
  toCalibrateHead,
  toCalibrateMsg,
  sleepRatioKey,
  sleepRatioHead,
  sleepRatioMsg,
} = TRANSLATION_KEYS[SETTINGS];
const getTPath = (...args) => getTranslationPath(SETTINGS, ...args);

const Calibration = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [l2, setL2] = useState(false);
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

  const testFn = async () => {
    console.log("testFn - 1");
    setL2(true);
    const res = await turnOnSPI();
    setL2(false);
    console.log("res", res);
    console.log("testFn - 2");
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
        <Item className={clsx({ [Classes.SKELETON]: l2 })} onClick={testFn}>
          <h1>TestFn</h1>
        </Item>
      </Container>
    </>
  );
};

export default Calibration;
