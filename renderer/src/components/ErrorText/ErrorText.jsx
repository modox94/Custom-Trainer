import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { COMMON_CONST, ERRORS } from "../../constants/commonConst";
import {
  MAX_POTEN_VALUE,
  MIN_MOTOR_STROKE,
  MIN_POTEN_VALUE,
} from "../../constants/settingsConst";
import { TRANSLATION_ROOT_KEYS } from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import styles from "./ErrorText.module.css";

const { ERRORS_TRK } = TRANSLATION_ROOT_KEYS;

const getTPath = (...args) => getTranslationPath(ERRORS_TRK, ...args);
const CONSTANTS_OBJECT = {
  MAX_POTEN_VALUE,
  MIN_POTEN_VALUE,
  MIN_MOTOR_STROKE,
};

const ErrorText = props => {
  const { className, error, text, br, icon } = props;
  const { t } = useTranslation();

  if (!error && !text) {
    return null;
  }

  return (
    <>
      <span className={clsx(styles.redText, className)}>
        {icon && (
          <Icon className={styles.redIcon} icon={IconNames.WARNING_SIGN} />
        )}
        {`${COMMON_CONST.SPACE}${
          error ? t(getTPath(error), CONSTANTS_OBJECT) : text
        }`}
      </span>
      {br && <br />}
    </>
  );
};

ErrorText.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOf(Object.values(ERRORS)),
  text: PropTypes.string,
  br: PropTypes.bool,
  icon: PropTypes.bool,
};
ErrorText.defaultProps = {
  className: "",
  text: "",
  br: false,
  icon: true,
};

export default ErrorText;
