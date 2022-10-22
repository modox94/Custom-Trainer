import React from 'react';
import { useGetCadenceQuery } from '../../api/ipc';

const CadenceGauge = (props) => {
  const cadence = useGetCadenceQuery();

  return <>{cadence?.data}</>;
};

export default CadenceGauge;
