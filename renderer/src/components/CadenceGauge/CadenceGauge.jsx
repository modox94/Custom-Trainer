import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { round } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { RUNNINIG_STATUS } from "../../constants/reduxConst";
import { useCadenceState } from "../../utils/commonUtils";
import SectorOfRound from "../Scales/SectorOfRound";
import styles from "./CadenceGauge.module.css";

const { PAUSE } = RUNNINIG_STATUS;
const MAX_VALUE = 120;

const CadenceGauge = props => {
  const { className, targetRpm } = props;
  const [currentCadence, , runningStatus] = useCadenceState();

  const value = useMemo(
    () => round(currentCadence / MAX_VALUE, 2),
    [currentCadence],
  );
  const leftEdge = useMemo(
    () => round((targetRpm - 10) / MAX_VALUE, 2),
    [targetRpm],
  );
  const rightEdge = useMemo(
    () => round((targetRpm + 10) / MAX_VALUE, 2),
    [targetRpm],
  );

  return (
    <div className={clsx(className, styles.container)}>
      <div className={styles.digitalValue}>
        {runningStatus === PAUSE ? (
          <Icon className={styles.pause} icon={IconNames.PAUSE} />
        ) : (
          round(currentCadence)
        )}
      </div>
      <SectorOfRound value={value} leftEdge={leftEdge} rightEdge={rightEdge} />
    </div>
  );
};

CadenceGauge.propTypes = {
  className: PropTypes.string,
  targetRpm: PropTypes.number,
};
CadenceGauge.defaultProps = {
  className: "",
};

export default CadenceGauge;
