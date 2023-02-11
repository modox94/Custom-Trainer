import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React from "react";
import { DumbbellIcon, FeatherIcon, PotentiometerSymbol } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const Motor = () => {
  const position = 0.15;

  return (
    <>
      <Container>
        <Item className={styles.tinyPadding}>
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
          <Icon className={styles.icon} icon={IconNames.CARET_RIGHT} />
        </Item>
      </Container>
      <Container>
        <Item className={styles.flexColumn}>
          <FeatherIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>0.15</b>
            </p>
          </div>
        </Item>
        <Item>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.REFRESH}
          />
        </Item>
        <Item className={styles.flexColumn}>
          <DumbbellIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>0.15</b>
            </p>
          </div>
        </Item>
      </Container>
    </>
  );
};

export default Motor;
