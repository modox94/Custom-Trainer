import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get } from "lodash";
import React from "react";
import {
  swapMotorWires,
  swapPotentiometerWires,
  useGetPotentiometerQuery,
  useGetSettingsQuery,
} from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import {
  DumbbellIcon,
  EngineMotorElectroIcon,
  FeatherIcon,
  PotentiometerSymbol,
} from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

// minPosition
// maxPosition
// sleepRatio
// swappedMotorWires
// swappedPotentiometerWires

const Motor = () => {
  const { data: potentiometerValue } =
    useGetPotentiometerQuery(undefined, {
      pollingInterval: 500,
    }) || {};
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

  const onClickLeft = () => {
    // TODO
    console.log("onClickLeft");
  };

  const onClickRight = () => {
    // TODO
    console.log("onClickRight");
  };

  const onSelectMin = () => {
    // TODO
    console.log("onSelectMin");
  };

  const onSelectMax = () => {
    // TODO
    console.log("onSelectMax");
  };

  const onSwapMotor = () => {
    swapMotorWires(!swappedMotorWires);
  };

  const onSwapPotentiometer = () => {
    swapPotentiometerWires(!swappedPotentiometerWires);
  };

  return (
    <>
      <Container>
        <Item className={styles.tinyPadding} onClick={onClickLeft}>
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
        <Item className={styles.tinyPadding}>
          <Icon
            className={styles.icon}
            icon={IconNames.CARET_RIGHT}
            onClick={onClickRight}
          />
        </Item>
      </Container>
      <Container>
        <Item
          className={clsx(styles.flexColumn, styles.tinyPadding)}
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
          className={clsx(styles.flexColumn, styles.tinyPadding)}
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

        <Item>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.FLOPPY_DISK}
          />
        </Item>

        <Item
          className={clsx(styles.flexColumn, styles.tinyPadding)}
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
          className={clsx(styles.flexColumn, styles.tinyPadding)}
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
    </>
  );
};

export default Motor;
