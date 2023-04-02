import {
  Alignment,
  DialogBody,
  DialogStep,
  MultistepDialog,
  Position,
} from "@blueprintjs/core";
import PropTypes from "prop-types";
import React from "react";

const buttonPropShape = PropTypes.shape({
  active: PropTypes.bool,
  alignText: PropTypes.oneOf(Object.values(Alignment)),
  fill: PropTypes.bool,
  large: PropTypes.bool,
  loading: PropTypes.bool,
  minimal: PropTypes.bool,
  outlined: PropTypes.bool,
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  small: PropTypes.bool,
});

const MultistepDialogCustom = props => {
  const { dialogSteps, ...otherProps } = props;

  return (
    <MultistepDialog {...otherProps}>
      {dialogSteps.map(dialogStepProps => {
        const { panel, ...otherDialogStepProps } = dialogStepProps;

        return (
          <DialogStep
            panel={<DialogBody>{panel}</DialogBody>}
            {...otherDialogStepProps}
          />
        );
      })}
    </MultistepDialog>
  );
};

MultistepDialogCustom.propTypes = {
  "aria-describedby": PropTypes.string,
  "aria-labelledby": PropTypes.string,
  autoFocus: PropTypes.bool,
  backButtonProps: buttonPropShape,
  backdropClassName: PropTypes.string,
  backdropProps: PropTypes.object,
  canEscapeKeyClose: PropTypes.bool,
  canOutsideClickClose: PropTypes.bool,
  className: PropTypes.string,
  closeButtonProps: buttonPropShape,
  enforceFocus: PropTypes.bool,
  finalButtonProps: buttonPropShape,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  initialStepIndex: PropTypes.number,
  isCloseButtonShown: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  lazy: PropTypes.bool,
  navigationPosition: PropTypes.oneOf([
    Position.LEFT,
    Position.TOP,
    Position.RIGHT,
  ]),
  nextButtonProps: buttonPropShape,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onClosed: PropTypes.func,
  onClosing: PropTypes.func,
  onOpened: PropTypes.func,
  onOpening: PropTypes.func,
  portalClassName: PropTypes.string,
  resetOnClose: PropTypes.bool,
  shouldReturnFocusOnClose: PropTypes.bool,
  showCloseButtonInFooter: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
  transitionDuration: PropTypes.number,
  transitionName: PropTypes.string,
  usePortal: PropTypes.bool,

  dialogSteps: PropTypes.arrayOf(
    PropTypes.shape({
      backButtonProps: buttonPropShape,
      className: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nextButtonProps: buttonPropShape,
      panel: PropTypes.node.isRequired,
      panelClassName: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
};
MultistepDialogCustom.defaultProps = {
  isOpen: false,
  navigationPosition: Position.TOP,
};

export default MultistepDialogCustom;
