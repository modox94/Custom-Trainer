import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { ERRORS, SPACE } from "../../constants/commonConst";
import { TRANSLATION_ROOT_KEYS } from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import styles from "./Error.module.css";

const { ERRORS_TRK } = TRANSLATION_ROOT_KEYS;

const getTPath = (...args) => getTranslationPath(ERRORS_TRK, ...args);

const Error = props => {
  const { className, error, br } = props;
  const { t } = useTranslation();

  if (!error) {
    return null;
  }

  return (
    <>
      <span className={clsx(styles.redText, className)}>
        <Icon className={styles.redIcon} icon={IconNames.WARNING_SIGN} />
        {`${SPACE}${t(getTPath(error))}`}
      </span>
      {br && <br />}
    </>
  );
};

Error.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOf(Object.values(ERRORS)),
  br: PropTypes.bool,
};
Error.defaultProps = {
  className: "",
  error: "",
  br: false,
};

export default Error;
