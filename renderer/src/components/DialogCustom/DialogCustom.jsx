import {
  Button,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { isString, noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";

const { COMMON_TRK } = TRANSLATION_ROOT_KEYS;
const { back, ok } = TRANSLATION_KEYS[COMMON_TRK];

const DialogCustom = props => {
  const {
    isOpen,
    className,
    icon,
    title,
    canEscapeKeyClose,
    canOutsideClickClose,
    isCloseButtonShown,
    onClose,
    body: propsBody,
    footerMinimal,
    footer,
    goBackBtn,
    okBtn,
  } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const body = isString(propsBody) ? <p>{propsBody}</p> : propsBody;

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Dialog
      isOpen={isOpen}
      className={className}
      icon={icon}
      title={title}
      canEscapeKeyClose={Boolean(canEscapeKeyClose)}
      canOutsideClickClose={Boolean(canOutsideClickClose)}
      isCloseButtonShown={Boolean(isCloseButtonShown)}
      onClose={onClose}
    >
      <DialogBody className={Classes.TEXT_LARGE}>{body}</DialogBody>

      {(goBackBtn || footer || okBtn) && (
        <DialogFooter minimal={Boolean(footerMinimal)}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {goBackBtn && (
              <Button
                intent={Intent.PRIMARY}
                large
                icon={IconNames.ARROW_LEFT}
                text={t(getTranslationPath(COMMON_TRK, back))}
                onClick={goBack}
              />
            )}
            {footer}
            {okBtn && (
              <Button
                large
                icon={IconNames.TICK}
                text={t(getTranslationPath(COMMON_TRK, ok))}
                onClick={onClose}
              />
            )}
          </div>
        </DialogFooter>
      )}
    </Dialog>
  );
};

DialogCustom.propTypes = {
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
  canEscapeKeyClose: PropTypes.bool,
  canOutsideClickClose: PropTypes.bool,
  isCloseButtonShown: PropTypes.bool,
  onClose: PropTypes.func,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  footerMinimal: PropTypes.bool,
  footer: PropTypes.node,
  goBackBtn: PropTypes.bool,
};
DialogCustom.defaultProps = {
  isOpen: true,
  className: "",
  title: "",
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  isCloseButtonShown: true,
  onClose: noop,
  body: "",
  footerMinimal: true,
  footer: <></>,
  goBackBtn: false,
};

export default DialogCustom;
