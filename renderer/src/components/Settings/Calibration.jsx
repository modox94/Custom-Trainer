import { get, isFinite } from "lodash";
import React from "react";
import { useTranslation } from "react-i18next";
import { useGetSettingsQuery } from "../../api/ipc";
import { DASH } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
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
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const sleepRatio = get(settings, [FILE_CONST.PERIPHERAL, "sleepRatio"], null);

  return (
    <>
      <Container>
        <Item>
          <h1>{t(getTPath(toCalibrateBut))}</h1>
        </Item>
        <Item>
          <h1>{t(getTPath(sleepRatioKey))}</h1>
          <h1>{!isFinite(sleepRatio) ? DASH : String(sleepRatio)}</h1>
        </Item>
      </Container>
      <Container>
        <Item></Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Calibration;
