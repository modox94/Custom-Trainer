import clsx from "clsx";
import { round } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useGetCadenceQuery } from "../../api/ipc";
import SectorOfRound from "../Scales/SectorOfRound";
import styles from "./CadenceGauge.module.css";

const MAX_VALUE = 120;

const CadenceGauge = props => {
  const { className, targetRpm } = props;
  const { data = 0 } = useGetCadenceQuery() || {};
  const value = useMemo(() => round(data / MAX_VALUE, 2), [data]);
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
      <div className={styles.digitalValue}>{round(data)}</div>
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
