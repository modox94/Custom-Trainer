import { Button, Classes, Dialog, Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, isFinite, round } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  DANGERmoveBack,
  DANGERmoveForward,
  editSettings,
  useGetPotentiometerQuery,
  useGetSettingsQuery,
} from "../../api/ipc";
import { DASH } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import {
  DumbbellIcon,
  EngineMotorElectroIcon,
  FeatherIcon,
  PotentiometerSymbol,
} from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { COMMON, SETTINGS } = TRANSLATION_ROOT_KEYS;
const { ok, back } = TRANSLATION_KEYS[COMMON];
const { motorDisclaimerHead, motorDisclaimerMsg } = TRANSLATION_KEYS[SETTINGS];

const Motor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState(true);

  const { data: potentiometerValueRaw } =
    useGetPotentiometerQuery(undefined, {
      pollingInterval: 500,
    }) || {};
  const potentiometerValue = round(potentiometerValueRaw);
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const minPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, "minPosition"],
    null,
  );
  const maxPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, "maxPosition"],
    null,
  );
  const swappedMotorWires = get(
    settings,
    [FILE_CONST.PERIPHERAL, "swappedMotorWires"],
    null,
  );
  const swappedPotentiometerWires = get(
    settings,
    [FILE_CONST.PERIPHERAL, "swappedPotentiometerWires"],
    null,
  );

  const disabled = loading || !isFinite(potentiometerValue);

  const goBack = () => {
    navigate(-1);
  };

  const onClickLeft = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);

    try {
      const result = await DANGERmoveBack();
      if (result?.error) {
        console.log("error", result.error);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const onClickRight = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);

    try {
      const result = await DANGERmoveForward();
      if (result?.error) {
        console.log("error", result.error);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const onSelectMin = () => {
    if (disabled) {
      return;
    }

    editSettings(FILE_CONST.PERIPHERAL, "minPosition", potentiometerValue);
  };

  const onSelectMax = () => {
    if (disabled) {
      return;
    }

    editSettings(FILE_CONST.PERIPHERAL, "maxPosition", potentiometerValue);
  };

  const onSwapMotor = () => {
    if (disabled) {
      return;
    }

    editSettings(
      FILE_CONST.PERIPHERAL,
      "swappedMotorWires",
      !swappedMotorWires,
    );
  };

  const onSwapPotentiometer = () => {
    if (disabled) {
      return;
    }

    editSettings(
      FILE_CONST.PERIPHERAL,
      "swappedPotentiometerWires",
      !swappedPotentiometerWires,
    );
  };

  return (
    <>
      <Container>
        <Item
          className={clsx(styles.tinyPadding, { [Classes.SKELETON]: disabled })}
          onClick={onClickLeft}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_LEFT} />
        </Item>
        <Item className={clsx(styles.flexColumn, styles.smallPadding)}>
          <PotentiometerSymbol
            className={clsx(styles.icon50, styles.blueIcon)}
            position={potentiometerValue}
          />
          <div className={styles.text}>
            <p>
              <b>{String(potentiometerValue)}</b>
            </p>
          </div>
        </Item>
        <Item
          className={clsx(styles.tinyPadding, { [Classes.SKELETON]: disabled })}
          onClick={onClickRight}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_RIGHT} />
        </Item>
      </Container>
      <Container>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSwapMotor}
        >
          <Icon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
            icon={IconNames.REFRESH}
          />
          <EngineMotorElectroIcon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
          />
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSwapPotentiometer}
        >
          <Icon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
            icon={IconNames.REFRESH}
          />
          <PotentiometerSymbol
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
          />
        </Item>

        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSelectMin}
        >
          <FeatherIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{!isFinite(minPosition) ? DASH : minPosition}</b>
            </p>
          </div>
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSelectMax}
        >
          <DumbbellIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{!isFinite(maxPosition) ? DASH : maxPosition}</b>
            </p>
          </div>
        </Item>
      </Container>

      <Dialog
        isOpen={disclaimer}
        title={t(getTranslationPath(SETTINGS, motorDisclaimerHead))}
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
        onClose={() => setDisclaimer(false)}
      >
        <div className={Classes.DIALOG_BODY}>
          <p className={Classes.TEXT_LARGE}>
            {t(getTranslationPath(SETTINGS, motorDisclaimerMsg))}
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
              icon={IconNames.ARROW_LEFT}
              text={t(getTranslationPath(COMMON, back))}
              onClick={goBack}
            />
            <Button
              large
              intent={Intent.DANGER}
              icon={IconNames.TICK}
              text={t(getTranslationPath(COMMON, ok))}
              onClick={() => setDisclaimer(false)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Motor;
