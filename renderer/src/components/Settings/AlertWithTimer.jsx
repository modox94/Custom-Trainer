import { Alert } from "@blueprintjs/core";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import zeroFill from "zero-fill";

const AlertWithTimer = props => {
  const {
    timerDuration,
    children,
    cancelButtonText: cancelButtonTextProp,
    onCancel,
    ...otherProps
  } = props;
  const [cancelButtonText, setCancelButtonText] =
    useState(cancelButtonTextProp);
  const { seconds, minutes, hours, isRunning } = useTimer({
    expiryTimestamp: new Date().setMilliseconds(
      new Date().getMilliseconds() + timerDuration,
    ),
  });

  useEffect(() => {
    let newCancelButtonText = "";
    if (hours > 0) {
      newCancelButtonText += `${zeroFill(2, hours)}:`;
    }
    if (minutes > 0) {
      newCancelButtonText += `${zeroFill(2, minutes)}:`;
    }
    if (seconds > 0) {
      newCancelButtonText += `${zeroFill(2, seconds)}`;
    }
    newCancelButtonText = `${cancelButtonTextProp} (${newCancelButtonText})`;

    if (newCancelButtonText !== cancelButtonText) {
      setCancelButtonText(newCancelButtonText);
    }
  }, [cancelButtonText, cancelButtonTextProp, hours, minutes, seconds]);

  useEffect(() => {
    if (!isRunning) {
      onCancel();
    }
  }, [isRunning, onCancel]);

  return (
    <Alert
      cancelButtonText={cancelButtonText}
      onCancel={onCancel}
      {...otherProps}
    >
      {children}
    </Alert>
  );
};

AlertWithTimer.propTypes = {
  timerDuration: PropTypes.number,
};
AlertWithTimer.defaultProps = {
  timerDuration: 3000,
};

export default AlertWithTimer;
