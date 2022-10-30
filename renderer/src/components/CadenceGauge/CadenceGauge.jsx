import React from "react";
import { useGetCadenceQuery } from "../../api/ipc";
import Round from "../Scales/Round";

const CadenceGauge = props => {
  const cadence = useGetCadenceQuery();

  return (
    <>
      <Round />
      {cadence?.data}
    </>
  );
};

export default CadenceGauge;
