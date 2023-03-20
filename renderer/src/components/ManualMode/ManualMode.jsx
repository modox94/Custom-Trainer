import { Classes, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { isFinite } from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  preventDisplaySleep,
  setMotorLevel,
  stopMotor,
  useGetMotorLevelQuery,
} from "../../api/ipc";
import { DASH } from "../../constants/commonConst";
import { MAX_RES_LEVEL } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import CadenceGauge from "../CadenceGauge/CadenceGauge";
import Clock from "../Clock/Clock";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer, { TIMER_TYPES } from "../Timer/Timer";
import styles from "./ManualMode.module.css";

const { TIPS_TRK } = TRANSLATION_ROOT_KEYS;
const { resistanceBut } = TRANSLATION_KEYS[TIPS_TRK];

const ManualMode = props => {
  const { t } = useTranslation();
  const { data: initialLevel } = useGetMotorLevelQuery();
  const [currentLevel, setCurrentLevel] = useState();

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
    if (currentLevel > 1) {
      setMotorLevel(currentLevel - 1);
    }
  };

  const decreaseMotorLevel = () => {
    if (currentLevel < MAX_RES_LEVEL) {
      setMotorLevel(currentLevel + 1);
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
          onClick={decreaseMotorLevel}
          interactive={currentLevel > 1}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_DOWN} />
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
          onClick={increaseMotorLevel}
          interactive={currentLevel < MAX_RES_LEVEL}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_UP} />
        </Item>
      </Container>
    </>
  );
};

export default ManualMode;
