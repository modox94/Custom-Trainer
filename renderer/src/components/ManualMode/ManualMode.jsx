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
import SettingsControlDialog from "../SettingsControlDialog/SettingsControlDialog";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer, { TIMER_TYPES } from "../Timer/Timer";
import styles from "./ManualMode.module.css";

const { TIPS_TRK } = TRANSLATION_ROOT_KEYS;
const { resistanceBut } = TRANSLATION_KEYS[TIPS_TRK];

const ManualMode = props => {
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState();
  const { data: initialLevel } = useGetMotorLevelQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

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

      <SettingsControlDialog />
    </>
  );
};

export default ManualMode;
