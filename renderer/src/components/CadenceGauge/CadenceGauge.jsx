import React from "react";
import { useGetCadenceQuery } from "../../api/ipc";
import SectorOfRound from "../Scales/SectorOfRound";
import { round } from "lodash";

const MAX_VALUE = 120;

const CadenceGauge = props => {
  const { data } = useGetCadenceQuery() || {};
  const percent = data / MAX_VALUE;

  return (
    <>
      <SectorOfRound percent={percent} />

      {round(data)}
    </>
  );
};

export default CadenceGauge;
