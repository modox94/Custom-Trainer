import { Button, Classes, Text } from "@blueprintjs/core";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import styles from "./Settings.module.css";

const SettingLine = props => {
  const {
    className,
    titleClassName,
    title,
    buttonClassName,
    buttonIcon,
    buttonText,
    onClick,
    valueClassName,
    value,
  } = props;

  return (
    <div className={clsx(styles.settingButtonContainer, className)}>
      <Text
        className={clsx(Classes.TEXT_LARGE, styles.maxWidth75, titleClassName)}
      >
        {title}
      </Text>

      {((buttonIcon || buttonText || onClick) && (
        <Button
          className={clsx(styles.settingButtonMargin, buttonClassName)}
          large
          icon={buttonIcon}
          text={buttonText}
          onClick={onClick}
        />
      )) || (
        <Text className={clsx(Classes.TEXT_LARGE, valueClassName)}>
          {value}
        </Text>
      )}
    </div>
  );
};

SettingLine.propTypes = {
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  buttonClassName: PropTypes.string,
  buttonIcon: PropTypes.node,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  valueClassName: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};
SettingLine.defaultProps = {
  className: "",
  titleClassName: "",
  title: "",
  buttonClassName: "",
  buttonText: "",
  valueClassName: "",
  value: "",
};

export default SettingLine;
