import { Button, Classes, Dialog, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, isFinite, round } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DANGERmoveBack,
  DANGERmoveForward,
  editSettings,
  useGetPotentiometerQuery,
  useGetSettingsQuery,
} from "../../api/ipc";
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

const { COMMON } = TRANSLATION_ROOT_KEYS;
const { ok } = TRANSLATION_KEYS[COMMON];

// minPosition
// maxPosition
// sleepRatio
// swappedMotorWires
// swappedPotentiometerWires

const Motor = () => {
  const { t } = useTranslation();
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
        <Item className={styles.flexColumn}>
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
          className={clsx(styles.flexColumn, styles.tinyPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSwapMotor}
        >
          <Icon
            className={clsx(styles.icon50, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
            icon={IconNames.REFRESH}
          />
          <EngineMotorElectroIcon
            className={clsx(styles.icon50, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
          />
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.tinyPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSwapPotentiometer}
        >
          <Icon
            className={clsx(styles.icon50, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
            icon={IconNames.REFRESH}
          />
          <PotentiometerSymbol
            className={clsx(styles.icon50, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
          />
        </Item>

        <Item
          className={clsx(styles.flexColumn, styles.tinyPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSelectMin}
        >
          <FeatherIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{minPosition === null ? "---" : minPosition}</b>
            </p>
          </div>
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.tinyPadding, {
            [Classes.SKELETON]: disabled,
          })}
          onClick={onSelectMax}
        >
          <DumbbellIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{maxPosition === null ? "---" : maxPosition}</b>
            </p>
          </div>
        </Item>
      </Container>

      <Dialog
        isOpen={disclaimer}
        title={"TODO"}
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
        onClose={() => setDisclaimer(false)}
      >
        <div className={Classes.DIALOG_BODY}>
          <p className={Classes.TEXT_LARGE}>
            <Icon className={styles.greenIcon} icon={IconNames.SWAP_VERTICAL} />
            {"TODO TODO TODO"}
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
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
