import {
  Alignment,
  Classes,
  DialogBody,
  DialogStep,
  Intent,
  MultistepDialog,
  Position,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { isObject, isString } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import "./MultistepDialogCustom.css";
import styles from "./MultistepDialogCustom.module.css";

const { COMMON_TRK } = TRANSLATION_ROOT_KEYS;
const { back, next, cancelTKey, finish } = TRANSLATION_KEYS[COMMON_TRK];

const getTPath = (...args) => getTranslationPath(COMMON_TRK, ...args);

const buttonPropShape = PropTypes.shape({
  active: PropTypes.bool,
  alignText: PropTypes.oneOf(Object.values(Alignment)),
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fill: PropTypes.bool,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  intent: PropTypes.oneOf(Object.values(Intent)),
  large: PropTypes.bool,
  loading: PropTypes.bool,
  minimal: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  outlined: PropTypes.bool,
  rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  small: PropTypes.bool,
  text: PropTypes.node,
  type: PropTypes.oneOf(["submit", "reset", "button"]),
});

const MultistepDialogCustom = props => {
  const {
    dialogSteps,
    style: propsStyle,
    backButtonProps: propsBackButtonProps,
    closeButtonProps: propsCloseButtonProps,
    finalButtonProps: propsFinalButtonProps,
    nextButtonProps: propsNextButtonProps,
    ...otherProps
  } = props;

  const { t } = useTranslation();

  const style = useMemo(
    () => ({ minWidth: "unset", ...propsStyle }),
    [propsStyle],
  );

  const backButtonProps = useMemo(
    () =>
      isObject(propsBackButtonProps)
        ? {
            icon: IconNames.ARROW_LEFT,
            intent: Intent.NONE,
            large: true,
            text: t(getTPath(back)),
            ...propsBackButtonProps,
          }
        : propsBackButtonProps,
    [propsBackButtonProps, t],
  );
  const closeButtonProps = useMemo(
    () =>
      isObject(propsCloseButtonProps)
        ? {
            icon: IconNames.CROSS,
            intent: Intent.DANGER,
            large: true,
            text: t(getTPath(cancelTKey)),
            ...propsCloseButtonProps,
          }
        : propsCloseButtonProps,
    [propsCloseButtonProps, t],
  );
  const finalButtonProps = useMemo(
    () =>
      isObject(propsFinalButtonProps)
        ? {
            icon: IconNames.TICK,
            intent: Intent.SUCCESS,
            large: true,
            text: t(getTPath(finish)),
            ...propsFinalButtonProps,
          }
        : propsFinalButtonProps,
    [propsFinalButtonProps, t],
  );
  const nextButtonProps = useMemo(
    () =>
      isObject(propsNextButtonProps)
        ? {
            icon: IconNames.ARROW_RIGHT,
            intent: Intent.PRIMARY,
            large: true,
            text: t(getTPath(next)),
            ...propsNextButtonProps,
          }
        : propsNextButtonProps,
    [propsNextButtonProps, t],
  );

  return (
    <MultistepDialog
      style={style}
      backButtonProps={backButtonProps}
      closeButtonProps={closeButtonProps}
      finalButtonProps={finalButtonProps}
      nextButtonProps={nextButtonProps}
      {...otherProps}
    >
      {dialogSteps.map(dialogStepProps => {
        const { panel: propsPanel, ...otherDialogStepProps } = dialogStepProps;
        const panel = isString(propsPanel) ? <p>{propsPanel}</p> : propsPanel;

        return (
          <DialogStep
            panel={
              <DialogBody
                className={clsx(Classes.TEXT_LARGE, styles.dialogBodyMaxHeight)}
              >
                {panel}
              </DialogBody>
            }
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
