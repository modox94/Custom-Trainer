import { Classes } from "@blueprintjs/core";
import clsx from "clsx";
import { round } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { ReactComponent as CircuitSolidSvg } from "./circuit-solid.svg";
import { ReactComponent as DumbbellSvg } from "./dumbbell-solid.svg";
import { ReactComponent as EngineMotorRegularSvg } from "./engine-motor-regular.svg";
import { ReactComponent as EngineMotorSolidSvg } from "./engine-motor-solid.svg";
import { ReactComponent as FeatherSvg } from "./feather.svg";
import { ReactComponent as GaugeHighSvg } from "./gauge-high-solid.svg";
import { ReactComponent as GearsSvg } from "./gears-solid.svg";
import { ReactComponent as HeartPulseSvg } from "./heart-pulse-solid.svg";
import styles from "./index.module.css";
import { ReactComponent as KeyboardRegularSvg } from "./keyboard-regular.svg";
import { ReactComponent as KeyboardSolidSvg } from "./keyboard-solid.svg";
import { ReactComponent as MicrochipSvg } from "./microchip-solid.svg";
import { ReactComponent as PotentiometerRegularSvg } from "./potentiometer-regular.svg";
import { ReactComponent as PotentiometerSolidSvg } from "./potentiometer-solid.svg";
import { ReactComponent as RankingStarSvg } from "./ranking-star-solid.svg";
import { ReactComponent as RuSvg } from "./ru.svg";
import { ReactComponent as UsSvg } from "./us.svg";
import { ReactComponent as WiresWireSvg } from "./wires-wire-solid.svg";

const IconWrapper = props => {
  const { children, className } = props;

  return (
    <span className={clsx(Classes.ICON, styles.iconWrapper, className)}>
      {children}
    </span>
  );
};

IconWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element,
};
IconWrapper.defaultProps = {
  className: "",
};

export const CircuitSolidIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <CircuitSolidSvg />
    </IconWrapper>
  );
};

export const DumbbellIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <DumbbellSvg />
    </IconWrapper>
  );
};

export const EngineMotorRegularIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <EngineMotorRegularSvg />
    </IconWrapper>
  );
};

export const EngineMotorSolidIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <EngineMotorSolidSvg />
    </IconWrapper>
  );
};

export const FeatherIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <FeatherSvg />
    </IconWrapper>
  );
};

export const GaugeHighIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <GaugeHighSvg />
    </IconWrapper>
  );
};

export const GearsIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <GearsSvg />
    </IconWrapper>
  );
};

export const HeartPulseIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <HeartPulseSvg />
    </IconWrapper>
  );
};

export const KeyboardRegularIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <KeyboardRegularSvg />
    </IconWrapper>
  );
};

export const KeyboardSolidIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <KeyboardSolidSvg />
    </IconWrapper>
  );
};

export const MicrochipIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <MicrochipSvg />
    </IconWrapper>
  );
};

export const PotentiometerRegularIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <PotentiometerRegularSvg />
    </IconWrapper>
  );
};

export const PotentiometerSolidIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <PotentiometerSolidSvg />
    </IconWrapper>
  );
};

export const RankingStarIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <RankingStarSvg />
    </IconWrapper>
  );
};

export const RuIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <RuSvg />
    </IconWrapper>
  );
};

export const UsIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <UsSvg />
    </IconWrapper>
  );
};

export const WiresWireIcon = props => {
  const { children, ...otherProps } = props;

  return (
    <IconWrapper {...otherProps}>
      <WiresWireSvg />
    </IconWrapper>
  );
};

export const PotentiometerSymbol = props => {
  const { position, ...otherProps } = props;

  const lineX = 15 + round(70 * position);
  const headX1 = lineX - 5;
  const headX2 = lineX + 5;

  return (
    <IconWrapper {...otherProps}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 100 80"
      >
        <g fill="none" stroke="currentColor" stroke-width="4">
          <polyline
            points="0,40 10,40 15,50 25,30 35,50 45,30 55,50
          65,30 75,50 85,30 90,40 100,40"
          />
          <g>
            <line x1={lineX} y1="80" x2={lineX} y2="50" />
            <polyline
              points={`${headX1},58.660254 ${lineX},50 ${headX2},58.660254`}
            />
          </g>
        </g>
      </svg>
    </IconWrapper>
  );
  // Potentiometer (circuit diagram element, horizontal orientation)
  // Originally produced by K. Bolino, 7 May 2008.
  // Released into the public domain by the author.
};

PotentiometerSymbol.propTypes = {
  position: PropTypes.number,
};
PotentiometerSymbol.defaultProps = {
  position: 0.5,
};
