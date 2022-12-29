import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React from "react";
import { DumbbellIcon, FeatherIcon, PotentiometerRegularIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const Motor = () => {
  return (
    <>
      <Container>
        <Item className={styles.tinyPadding}>
          <Icon className={styles.icon} icon={IconNames.CARET_LEFT} />
        </Item>
        <Item className={clsx(styles.flexColumn)}>
          <PotentiometerRegularIcon
            className={clsx(styles.icon50, styles.blueIcon)}
          />
          <div className={styles.text}>
            <p>
              <b>0.157</b>
            </p>
          </div>
        </Item>
        <Item className={styles.tinyPadding}>
          <Icon className={styles.icon} icon={IconNames.CARET_RIGHT} />
        </Item>
      </Container>
      <Container>
        <Item className={clsx(styles.flexColumn)}>
          <FeatherIcon className={clsx(styles.icon50)} />
          <div className={styles.text}>
            <p>
              <b>0.157</b>
            </p>
          </div>
        </Item>
        <Item>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.REFRESH}
          />
        </Item>
        <Item className={clsx(styles.flexColumn)}>
          <DumbbellIcon className={clsx(styles.icon50)} />
          <div className={styles.text}>
            <p>
              <b>0.157</b>
            </p>
          </div>
        </Item>
      </Container>
    </>
  );
};

export default Motor;
