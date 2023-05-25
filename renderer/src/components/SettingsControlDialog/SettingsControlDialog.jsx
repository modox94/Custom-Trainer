import { Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGetBootQuery, useGetSettingsQuery } from "../../api/ipc";
import { ERRORS } from "../../constants/commonConst";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { BOOT_CONFIG_OPT, FILE_CONST } from "../../constants/reduxConst";
import { MIN_MOTOR_STROKE, MOTOR_FIELDS } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import DialogCustom from "../DialogCustom/DialogCustom";
import ErrorText from "../ErrorText/ErrorText";
import { EngineMotorElectroIcon } from "../Icons";

const { SETTINGS } = PAGES;
const { COMMON_TRK, TIPS_TRK } = TRANSLATION_ROOT_KEYS;
const { errorTKey } = TRANSLATION_KEYS[COMMON_TRK];
const { motorBut } = TRANSLATION_KEYS[TIPS_TRK];

const SettingsControlDialog = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    }) || {};
  const minPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.MIN_POS],
    null,
  );
  const maxPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.MAX_POS],
    null,
  );
  const { data: bootConfig } =
    useGetBootQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const spiStatus = get(bootConfig, [BOOT_CONFIG_OPT.SPI], null);
  const isValidSettings =
    isFinite(minPosition) &&
    isFinite(maxPosition) &&
    minPosition < maxPosition &&
    Math.abs(minPosition - maxPosition) > MIN_MOTOR_STROKE &&
    spiStatus;

  const goToSettingsMotor = useCallback(() => {
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].MOTOR}`,
    );
  }, [navigate]);

  const goToSettingsSpi = useCallback(() => {
    navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERFORMANCE}`);
  }, [navigate]);

  return (
    <DialogCustom
      isOpen={!isValidSettings}
      icon={IconNames.WARNING_SIGN}
      title={t(getTranslationPath(COMMON_TRK, errorTKey))}
      canOutsideClickClose={false}
      isCloseButtonShown={false}
      body={
        <ErrorText
          error={
            !spiStatus
              ? ERRORS.BOOT_CONFIG_SPI_OFF
              : ERRORS.INVALID_MOTOR_SETTINGS
          }
        />
      }
      footerMinimal
      goBackBtn
      footer={
        !spiStatus ? (
          <Button
            large
            icon={IconNames.COG}
            text="TODO SPI"
            onClick={goToSettingsSpi}
          />
        ) : (
          <Button
            large
            icon={<EngineMotorElectroIcon />}
            text={t(getTranslationPath(TIPS_TRK, motorBut))}
            onClick={goToSettingsMotor}
          />
        )
      }
    />
  );
};

export default SettingsControlDialog;
