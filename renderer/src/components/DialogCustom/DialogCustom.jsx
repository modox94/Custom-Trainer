import { Classes, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";

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
    body,
    footerMinimal,
    footer,
  } = props;

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
      <DialogBody>
        <p className={Classes.TEXT_LARGE}>{body}</p>
      </DialogBody>
      <DialogFooter minimal={Boolean(footerMinimal)}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>{footer}</div>
      </DialogFooter>
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
};

export default DialogCustom;
