import { Alert, Classes, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadFromSettings, resetSettings, saveToSettings } from "../../api/ipc";
import { ERRORS } from "../../constants/commonConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import ErrorText from "../ErrorText/ErrorText";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { COMMON_TRK, PROGRAM_EDITOR_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { cancelTKey, ok } = TRANSLATION_KEYS[COMMON_TRK];
const { resetSettingsMsg, resetSettingsTitle, settingsLoaded } =
  TRANSLATION_KEYS[SETTINGS_TRK];
const { loadFromFile, saveToFile } = TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const Advanced = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState(null);

  const resetSettingsFn = useCallback(async () => {
    setAlertProps(null);
    resetSettings();
  }, []);

  const onClickResetSettings = useCallback(async () => {
    setAlertProps({
      intent: Intent.WARNING,
      icon: IconNames.WARNING_SIGN,
      cancelButtonText: t(getTranslationPath(COMMON_TRK, cancelTKey)),
      onConfirm: resetSettingsFn,
      children: t(getTPath(resetSettingsMsg)),
    });
  }, [resetSettingsFn, t]);

  const onClickLoadFrom = useCallback(async () => {
    setLoading(true);

    const result = await loadFromSettings();
    if (result?.data) {
      setAlertProps({
        intent: Intent.SUCCESS,
        icon: IconNames.CONFIRM,
        children: t(getTPath(settingsLoaded)),
      });
    } else {
      setAlertProps({
        intent: Intent.DANGER,
        icon: IconNames.ERROR,
        children: (
          <ErrorText
            error={result?.error || ERRORS.UNKNOWN_ERROR}
            icon={false}
          />
        ),
      });
    }

    setLoading(false);
  }, [t]);

  const onCloseAlert = useCallback(() => {
    setAlertProps(null);
  }, []);

  return (
    <>
      <Container>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickResetSettings}
        >
          <h1>{t(getTPath(resetSettingsTitle))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={saveToSettings}
        >
          <h1>{t(getTranslationPath(PROGRAM_EDITOR_TRK, saveToFile))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickLoadFrom}
        >
          <h1>{t(getTranslationPath(PROGRAM_EDITOR_TRK, loadFromFile))}</h1>
        </Item>
      </Container>

      {alertProps && (
        <Alert
          isOpen
          large
          canEscapeKeyCancel
          canOutsideClickCancel
          intent={alertProps.intent}
          icon={alertProps.icon}
          cancelButtonText={alertProps.cancelButtonText}
          confirmButtonText={t(getTranslationPath(COMMON_TRK, ok))}
          onCancel={onCloseAlert}
          onConfirm={alertProps.onConfirm || onCloseAlert}
        >
          {alertProps.children}
        </Alert>
      )}
    </>
  );
};

export default Advanced;
