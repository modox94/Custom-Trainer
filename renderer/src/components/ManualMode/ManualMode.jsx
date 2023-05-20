import { Button, Classes, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, isFinite } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  preventDisplaySleep,
  setMotorLevel,
  stopMotor,
  useGetMotorLevelQuery,
  useGetSettingsQuery,
} from "../../api/ipc";
import { DASH, ERRORS } from "../../constants/commonConst";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { FILE_CONST } from "../../constants/reduxConst";
import {
  MAX_RES_LEVEL,
  MIN_MOTOR_STROKE,
  MOTOR_FIELDS,
} from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import CadenceGauge from "../CadenceGauge/CadenceGauge";
import Clock from "../Clock/Clock";
import DialogCustom from "../DialogCustom/DialogCustom";
import ErrorText from "../ErrorText/ErrorText";
import { EngineMotorElectroIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer, { TIMER_TYPES } from "../Timer/Timer";
import styles from "./ManualMode.module.css";

const { SETTINGS } = PAGES;
const { COMMON_TRK, TIPS_TRK } = TRANSLATION_ROOT_KEYS;
const { errorTKey } = TRANSLATION_KEYS[COMMON_TRK];
const { resistanceBut, motorBut } = TRANSLATION_KEYS[TIPS_TRK];

const ManualMode = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState();
  const { data: initialLevel } = useGetMotorLevelQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
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
  const isValidSettings =
    isFinite(minPosition) &&
    isFinite(maxPosition) &&
    minPosition < maxPosition &&
    Math.abs(minPosition - maxPosition) > MIN_MOTOR_STROKE;

  const goToSettings = useCallback(() => {
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].MOTOR}`,
    );
  }, [navigate]);

  useEffect(() => {
    preventDisplaySleep(true);

    return () => {
      setCurrentLevel(undefined);
      stopMotor();
      preventDisplaySleep(false);
    };
  }, []);

  useEffect(() => {
    if (isFinite(initialLevel)) {
      setCurrentLevel(initialLevel);
    }
  }, [initialLevel]);

  const increaseMotorLevel = () => {
    if (currentLevel < MAX_RES_LEVEL) {
      const newLevel = currentLevel + 1;
      setCurrentLevel(newLevel);
      setMotorLevel(newLevel);
    }
  };

  const decreaseMotorLevel = () => {
    if (currentLevel > 1) {
      const newLevel = currentLevel - 1;
      setCurrentLevel(newLevel);
      setMotorLevel(newLevel);
    }
  };

  return (
    <>
      <Container>
        <Clock />
        <Item className={styles.paddingReduced}>
          <CadenceGauge />
        </Item>
        <Timer type={TIMER_TYPES.ELAPSE} disabled />
      </Container>

      <Container>
        <Item
          className={clsx(styles.tinyPadding, {
            [Classes.SKELETON]: !isFinite(currentLevel),
          })}
          onClick={currentLevel > 1 ? decreaseMotorLevel : undefined}
        >
          <Icon
            className={clsx(styles.icon, {
              [styles.inActive]: !(currentLevel > 1),
            })}
            icon={IconNames.CARET_DOWN}
          />
        </Item>
        <Item className={styles.currentLevel}>
          <p>{t(getTranslationPath(TIPS_TRK, resistanceBut))}</p>
          <p>
            <b>{currentLevel ? currentLevel : DASH}</b>
          </p>
        </Item>
        <Item
          className={clsx(styles.tinyPadding, {
            [Classes.SKELETON]: !isFinite(currentLevel),
          })}
          onClick={
            currentLevel < MAX_RES_LEVEL ? increaseMotorLevel : undefined
          }
        >
          <Icon
            className={clsx(styles.icon, {
              [styles.inActive]: !(currentLevel < MAX_RES_LEVEL),
            })}
            icon={IconNames.CARET_UP}
          />
        </Item>
      </Container>

      <DialogCustom
        isOpen={!isValidSettings}
        icon={IconNames.WARNING_SIGN}
        title={t(getTranslationPath(COMMON_TRK, errorTKey))}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
        body={<ErrorText error={ERRORS.INVALID_MOTOR_SETTINGS} />}
        footerMinimal
        goBackBtn
        footer={
          <Button
            large
            icon={<EngineMotorElectroIcon />}
            text={t(getTranslationPath(TIPS_TRK, motorBut))}
            onClick={goToSettings}
          />
        }
      />
    </>
  );
};

export default ManualMode;
