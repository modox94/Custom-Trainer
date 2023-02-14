import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React, { useState } from "react";
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
  const [position, setPosition] = useState(15);
  const [minPosition, setMinPosition] = useState(null);
  const [maxPosition, setMaxPosition] = useState(null);
  const [swappedMotorWires, setSwappedMotorWires] = useState(null);
  const [swappedPotentiometerWires, setSwappedPotentiometerWires] =
    useState(null);

  const onClickLeft = () => {
    setPosition(position - 5);
  };

  const onClickRight = () => {
    setPosition(position + 5);
  };

  const onSelectMin = () => {
    setMinPosition(position);
  };

  const onSelectMax = () => {
    setMaxPosition(position);
  };

  const onSwapMotor = () => {
    setSwappedMotorWires(!swappedMotorWires);
  };

  const onSwapPotentiometer = () => {
    setSwappedPotentiometerWires(!swappedPotentiometerWires);
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
            position={position}
          />
          <div className={styles.text}>
            <p>
              <b>{position}</b>
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
