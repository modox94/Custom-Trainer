import { Button, ControlGroup, InputGroup, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styles from "./InputNumber.module.css";

const InputNumber = props => {
  const { onDecrease, onIncrease, value } = props;

  return (
    <ControlGroup fill>
      <Button
        large
        intent={Intent.PRIMARY}
        icon={IconNames.MINUS}
        onClick={onDecrease}
      />
      <InputGroup
        className={styles.textAlignCenter}
        large
        readOnly
        type="number"
        value={value}
      />
      <Button
        large
        intent={Intent.PRIMARY}
        icon={IconNames.PLUS}
        onClick={onIncrease}
      />
    </ControlGroup>
  );
};

InputNumber.propTypes = {
  onDecrease: PropTypes.func,
  onIncrease: PropTypes.func,
  value: PropTypes.number,
};

InputNumber.defaultProps = {
  onDecrease: noop,
  onIncrease: noop,
  value: 0,
};

export default InputNumber;
