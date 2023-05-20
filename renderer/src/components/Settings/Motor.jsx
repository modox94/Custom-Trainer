import { Button, Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, isFinite, round } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DANGERmoveBack,
  DANGERmoveForward,
  editSettings,
  useGetPotentiometerQuery,
  useGetSettingsQuery,
} from "../../api/ipc";
import { DASH, ERRORS } from "../../constants/commonConst";
import { FILE_CONST } from "../../constants/reduxConst";
import {
  MAX_POTEN_VALUE,
  MIN_MOTOR_STROKE,
  MIN_POTEN_VALUE,
  MOTOR_FIELDS,
} from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import DialogCustom from "../DialogCustom/DialogCustom";
import ErrorText from "../ErrorText/ErrorText";
import {
  DumbbellIcon,
  EngineMotorElectroIcon,
  FeatherIcon,
  PotentiometerSymbol,
} from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { ok, warning, errorTKey, cancelTKey, continueTKey } =
  TRANSLATION_KEYS[COMMON_TRK];
const { motorDisclaimerMsg } = TRANSLATION_KEYS[SETTINGS_TRK];

const errorsWithCustomFooter = [
  ERRORS.MOTOR_MIN_HIGH_MAX_LOW,
  ERRORS.MOTOR_SHORT_STROKE,
  ERRORS.MOTOR_SETTINGS_RESET,
];

const Motor = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState(true);
  const [error, setError] = useState(false);

  const { data: potentiometerValueRaw } =
    useGetPotentiometerQuery(undefined, {
      pollingInterval: 500,
    }) || {};
  const potentiometerValue = round(potentiometerValueRaw);
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const minPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.MIN_POS],
    null,
  );
  const maxPosition = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.MAX_POS],
    null,
  );
  const swappedMotorWires = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SWAP_MOTOR_WIRES],
    null,
  );
  const swappedPotentiometerWires = get(
    settings,
    [FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SWAP_POTEN_WIRES],
    null,
  );

  const disabled = loading || !isFinite(potentiometerValue);

  const onClickLeft = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);

    try {
      const result = await DANGERmoveBack();
      if (result?.error) {
        console.log("error", result.error);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const onClickRight = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);

    try {
      const result = await DANGERmoveForward();
      if (result?.error) {
        console.log("error", result.error);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoading(false);
  };

  const resetError = () => setError(false);

  const onChangeHard = (event, errorArg) => {
    const { newSettings } = errorArg || error || {};

    if (newSettings) {
      editSettings(FILE_CONST.PERIPHERAL, newSettings);
    }

    resetError();
  };

  const onSelectMin = () => {
    if (disabled) {
      return;
    }

    const newError = {
      target: MOTOR_FIELDS.MIN_POS,
      newSettings: {
        [MOTOR_FIELDS.MIN_POS]: potentiometerValue,
        [MOTOR_FIELDS.SLEEP_RATIO]: null,
      },
    };

    if (
      potentiometerValue > MAX_POTEN_VALUE ||
      potentiometerValue < MIN_POTEN_VALUE
    ) {
      newError.code = ERRORS.POTEN_VALUE_OUT_RANGE;
      setError(newError);
      return;
    }
    if (potentiometerValue > MAX_POTEN_VALUE - MIN_MOTOR_STROKE) {
      newError.code = ERRORS.MOTOR_MIN_MAX_INVALID;
      setError(newError);
      return;
    }
    if (maxPosition === null) {
      // do nothing
    } else if (potentiometerValue >= maxPosition) {
      newError.newSettings[MOTOR_FIELDS.MAX_POS] = null;
      newError.code = ERRORS.MOTOR_MIN_HIGH_MAX_LOW;
      setError(newError);
      return;
    } else if (Math.abs(maxPosition - potentiometerValue) < MIN_MOTOR_STROKE) {
      newError.newSettings[MOTOR_FIELDS.MAX_POS] = null;
      newError.code = ERRORS.MOTOR_SHORT_STROKE;
      setError(newError);
      return;
    }

    onChangeHard(undefined, newError);
  };

  const onSelectMax = () => {
    if (disabled) {
      return;
    }

    const newError = {
      target: MOTOR_FIELDS.MAX_POS,
      newSettings: {
        [MOTOR_FIELDS.MAX_POS]: potentiometerValue,
        [MOTOR_FIELDS.SLEEP_RATIO]: null,
      },
    };

    if (
      potentiometerValue > MAX_POTEN_VALUE ||
      potentiometerValue < MIN_POTEN_VALUE
    ) {
      newError.code = ERRORS.POTEN_VALUE_OUT_RANGE;
      setError(newError);
      return;
    }
    if (potentiometerValue < MIN_POTEN_VALUE + MIN_MOTOR_STROKE) {
      newError.code = ERRORS.MOTOR_MIN_MAX_INVALID;
      setError(newError);
      return;
    }
    if (minPosition === null) {
      // do nothing
    } else if (minPosition >= potentiometerValue) {
      newError.newSettings[MOTOR_FIELDS.MIN_POS] = null;
      newError.code = ERRORS.MOTOR_MIN_HIGH_MAX_LOW;
      setError(newError);
      return;
    } else if (Math.abs(minPosition - potentiometerValue) < MIN_MOTOR_STROKE) {
      newError.newSettings[MOTOR_FIELDS.MIN_POS] = null;
      newError.code = ERRORS.MOTOR_SHORT_STROKE;
      setError(newError);
      return;
    }

    onChangeHard(undefined, newError);
  };

  const onSwapMotor = () => {
    if (disabled) {
      return;
    }

    const newError = {
      target: MOTOR_FIELDS.SWAP_MOTOR_WIRES,
      code: ERRORS.MOTOR_SETTINGS_RESET,
      newSettings: {
        [MOTOR_FIELDS.SWAP_MOTOR_WIRES]: !swappedMotorWires,
        [MOTOR_FIELDS.MIN_POS]: null,
        [MOTOR_FIELDS.MAX_POS]: null,
        [MOTOR_FIELDS.SLEEP_RATIO]: null,
      },
    };

    setError(newError);
  };

  const onSwapPotentiometer = () => {
    if (disabled) {
      return;
    }

    const newError = {
      target: MOTOR_FIELDS.SWAP_POTEN_WIRES,
      code: ERRORS.MOTOR_SETTINGS_RESET,
      newSettings: {
        [MOTOR_FIELDS.SWAP_POTEN_WIRES]: !swappedPotentiometerWires,
        [MOTOR_FIELDS.MIN_POS]: null,
        [MOTOR_FIELDS.MAX_POS]: null,
        [MOTOR_FIELDS.SLEEP_RATIO]: null,
      },
    };

    setError(newError);
  };

  return (
    <>
      <Container>
        <Item
          className={clsx(styles.tinyPadding, { [styles.opacity50]: disabled })}
          onClick={onClickLeft}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_LEFT} />
        </Item>
        <Item className={clsx(styles.flexColumn, styles.smallPadding)}>
          <PotentiometerSymbol
            className={clsx(styles.icon50, styles.blueIcon)}
            position={potentiometerValue}
          />
          <div className={styles.text}>
            <p>
              <b>{String(potentiometerValue)}</b>
            </p>
          </div>
        </Item>
        <Item
          className={clsx(styles.tinyPadding, { [styles.opacity50]: disabled })}
          onClick={onClickRight}
        >
          <Icon className={styles.icon} icon={IconNames.CARET_RIGHT} />
        </Item>
      </Container>
      <Container>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [styles.opacity50]: disabled,
          })}
          onClick={onSwapMotor}
        >
          <Icon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
            icon={IconNames.REFRESH}
          />
          <EngineMotorElectroIcon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedMotorWires,
              [styles.grayIcon]: !swappedMotorWires,
            })}
          />
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [styles.opacity50]: disabled,
          })}
          onClick={onSwapPotentiometer}
        >
          <Icon
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
            icon={IconNames.REFRESH}
          />
          <PotentiometerSymbol
            className={clsx(styles.icon50, styles.tinyPadding, {
              [styles.blueIcon]: swappedPotentiometerWires,
              [styles.grayIcon]: !swappedPotentiometerWires,
            })}
          />
        </Item>

        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [styles.opacity50]: disabled,
          })}
          onClick={onSelectMin}
        >
          <FeatherIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{!isFinite(minPosition) ? DASH : minPosition}</b>
            </p>
          </div>
        </Item>
        <Item
          className={clsx(styles.flexColumn, styles.smallPadding, {
            [styles.opacity50]: disabled,
          })}
          onClick={onSelectMax}
        >
          <DumbbellIcon className={styles.icon50} />
          <div className={styles.text}>
            <p>
              <b>{!isFinite(maxPosition) ? DASH : maxPosition}</b>
            </p>
          </div>
        </Item>
      </Container>

      {error && (
        <DialogCustom
          isOpen={Boolean(error)}
          icon={IconNames.WARNING_SIGN}
          title={
            error?.code === ERRORS.MOTOR_SETTINGS_RESET
              ? t(getTranslationPath(COMMON_TRK, warning))
              : t(getTranslationPath(COMMON_TRK, errorTKey))
          }
          canEscapeKeyClose={false}
          canOutsideClickClose={false}
          isCloseButtonShown={false}
          onClose={resetError}
          body={<ErrorText error={error?.code} />}
          footerMinimal
          okBtn={!errorsWithCustomFooter.includes(error?.code)}
          footer={
            errorsWithCustomFooter.includes(error?.code) ? (
              <>
                <Button
                  large
                  intent={Intent.PRIMARY}
                  icon={IconNames.TICK}
                  text={t(getTranslationPath(COMMON_TRK, cancelTKey))}
                  onClick={resetError}
                />
                <Button
                  large
                  intent={Intent.DANGER}
                  icon={IconNames.EDIT}
                  text={t(getTranslationPath(COMMON_TRK, continueTKey))}
                  onClick={onChangeHard}
                />
              </>
            ) : undefined
          }
        />
      )}

      {disclaimer && (
        <DialogCustom
          isOpen={disclaimer}
          icon={IconNames.WARNING_SIGN}
          title={t(getTranslationPath(COMMON_TRK, warning))}
          canEscapeKeyClose={false}
          canOutsideClickClose={false}
          isCloseButtonShown={false}
          onClose={() => setDisclaimer(false)}
          body={
            <ErrorText
              text={t(getTranslationPath(SETTINGS_TRK, motorDisclaimerMsg))}
            />
          }
          footerMinimal
          goBackBtn
          footer={
            <Button
              large
              intent={Intent.DANGER}
              icon={IconNames.TICK}
              text={t(getTranslationPath(COMMON_TRK, ok))}
              onClick={() => setDisclaimer(false)}
            />
          }
        />
      )}
    </>
  );
};

export default Motor;
