import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { EngineMotorRegularIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { SETTINGS } = PAGES;

const Peripheral = props => {
  const navigate = useNavigate();

  const onClickMotor = () =>
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].MOTOR}`,
    );

  const onClickRPM = () =>
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].RPM}`,
    );

  const onClickHeartBeat = () =>
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].HEARTBEAT}`,
    );

  return (
    <>
      <Container>
        <Item onClick={onClickMotor}>
          <EngineMotorRegularIcon
            className={clsx(styles.icon, styles.blueIcon)}
          />
        </Item>
        <Item onClick={onClickRPM}>
          <h1>TODO RPM</h1>
        </Item>
      </Container>
      <Container>
        <Item onClick={onClickHeartBeat}>
          <h1>TODO HeartBeat</h1>
        </Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Peripheral;
