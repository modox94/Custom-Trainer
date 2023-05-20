import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, round } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRunningStatus } from "../../actions/environmentActions";
import { useGetCadenceQuery } from "../../api/ipc";
import { RUNNINIG_STATUS } from "../../constants/reduxConst";
import { getRunningStatus } from "../../selectors/environmentSelectors";
import SectorOfRound from "../Scales/SectorOfRound";
import styles from "./CadenceGauge.module.css";

const { PAUSE } = RUNNINIG_STATUS;
const MAX_VALUE = 120;

const CadenceGauge = props => {
  const { className, targetRpm } = props;
  const dispatch = useDispatch();
  const runningStatus = useSelector(getRunningStatus);
  const cadenceObject = useGetCadenceQuery();
  const currentCadence = get(cadenceObject, ["data", "result"], 0);
  const lastTimecode = get(cadenceObject, ["data", "lastTimecode"]);
  const value = useMemo(
    () => (runningStatus === PAUSE ? 0 : round(currentCadence / MAX_VALUE, 2)),
    [currentCadence, runningStatus],
  );
  const leftEdge = useMemo(
    () => round((targetRpm - 10) / MAX_VALUE, 2),
    [targetRpm],
  );
  const rightEdge = useMemo(
    () => round((targetRpm + 10) / MAX_VALUE, 2),
    [targetRpm],
  );

  useEffect(() => {
    dispatch(updateRunningStatus(lastTimecode));
  }, [dispatch, lastTimecode]);

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
