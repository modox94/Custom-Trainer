import clsx from "clsx";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { CaliperPlainIcon, EngineMotorElectroIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { SETTINGS } = PAGES;

const Peripheral = props => {
  const navigate = useNavigate();

  const onClickMotor = () =>
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].MOTOR}`,
    );

  const onClickCalibration = () =>
    navigate(
      `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].CALIBRATION}`,
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
          <EngineMotorElectroIcon
            className={clsx(styles.icon, styles.blueIcon)}
          />
        </Item>
        <Item onClick={onClickCalibration}>
          <CaliperPlainIcon className={clsx(styles.icon, styles.blueIcon)} />
        </Item>
      </Container>
      <Container>
        <Item onClick={onClickHeartBeat}>
          <h1>TODO HeartBeat</h1>
        </Item>
        <Item onClick={onClickRPM}>
          <h1>TODO RPM</h1>
        </Item>
      </Container>
    </>
  );
};

export default Peripheral;
