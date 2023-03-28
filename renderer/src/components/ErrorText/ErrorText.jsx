import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ERRORS, SPACE } from "../../constants/commonConst";
import { TRANSLATION_ROOT_KEYS } from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import styles from "./ErrorText.module.css";

const { ERRORS_TRK } = TRANSLATION_ROOT_KEYS;

const getTPath = (...args) => getTranslationPath(ERRORS_TRK, ...args);

const ErrorText = props => {
  const { className, error, text, br } = props;
  const { t } = useTranslation();

  if (!error && !text) {
    return null;
  }

  return (
    <>
      <span className={clsx(styles.redText, className)}>
        <Icon className={styles.redIcon} icon={IconNames.WARNING_SIGN} />
        {`${SPACE}${error ? t(getTPath(error)) : text}`}
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
};
ErrorText.defaultProps = {
  className: "",
  error: "",
  text: "",
  br: false,
};

export default ErrorText;
