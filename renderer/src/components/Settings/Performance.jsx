import {
  Alignment,
  Button,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
  Switch,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, isObject } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { turnOnSPI, useGetBootQuery } from "../../api/ipc";
import { ERRORS } from "../../constants/commonConst";
import { BOOT_CONFIG_OPT, BOOT_CONFIG_VALUE } from "../../constants/reduxConst";
import { DIALOG_PERFORMANCE } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import ErrorText from "../ErrorText/ErrorText";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { ok, turnOn } = TRANSLATION_KEYS[COMMON_TRK];
const { spiTitle, spiOnHead, spiOnMsg, spiTipHead, spiTipMsg, spiAboutMsg } =
  TRANSLATION_KEYS[SETTINGS_TRK];

const Performance = props => {
  const { t } = useTranslation();
  const [dialogType, setDialogType] = useState(false);
  const [dialogError, setDialogError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: bootConfig } =
    useGetBootQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const spiStatus = get(bootConfig, [BOOT_CONFIG_OPT.SPI], null);

  const closeDialog = () => {
    setDialogType(false);
    setDialogError(false);
    setLoading(false);
  };

  const turnOnSpiFn = useCallback(async () => {
    if (spiStatus !== BOOT_CONFIG_VALUE.ON) {
      setLoading(true);
      let [error] = (await turnOnSPI()) || [];
      setLoading(false);

      if (error && isObject(error)) {
        error = get(error, ["message"], ERRORS.UNKNOWN_ERROR);
      }

      if (error) {
        setDialogError(error);
      } else {
        closeDialog();
      }
    }
  }, [spiStatus]);

  const onSpiClick = event => {
    if (spiStatus === BOOT_CONFIG_VALUE.ON) {
      setDialogType(DIALOG_PERFORMANCE.SPI_TIP);
    } else {
      setDialogType(DIALOG_PERFORMANCE.SPI_TURN_ON);
    }
  };

  const dialogHead = useMemo(() => {
    switch (dialogType) {
      case DIALOG_PERFORMANCE.SPI_TIP:
        return t(getTranslationPath(SETTINGS_TRK, spiTipHead));

      case DIALOG_PERFORMANCE.SPI_TURN_ON:
        return t(getTranslationPath(SETTINGS_TRK, spiOnHead));

      default:
        return "";
    }
  }, [dialogType, t]);

  const dialogBody = useMemo(() => {
    switch (dialogType) {
      case DIALOG_PERFORMANCE.SPI_TIP:
        return (
          <>
            <p>
              <ErrorText error={dialogError} />
            </p>
            <p>{t(getTranslationPath(SETTINGS_TRK, spiTipMsg))}</p>
            <p>{t(getTranslationPath(SETTINGS_TRK, spiAboutMsg))}</p>
          </>
        );

      case DIALOG_PERFORMANCE.SPI_TURN_ON:
        return (
          <>
            <p>
              <ErrorText error={dialogError} />
            </p>
            <p>{t(getTranslationPath(SETTINGS_TRK, spiOnMsg))}</p>
            <p>{t(getTranslationPath(SETTINGS_TRK, spiAboutMsg))}</p>
          </>
        );

      default:
        break;
    }
    return;
  }, [dialogError, dialogType, t]);

  const dialogFooter = useMemo(() => {
    switch (dialogType) {
      case DIALOG_PERFORMANCE.SPI_TIP:
        return (
          <Button
            large
            icon={IconNames.TICK}
            text={t(getTranslationPath(COMMON_TRK, ok))}
            onClick={closeDialog}
          />
        );

      case DIALOG_PERFORMANCE.SPI_TURN_ON:
        return (
          <>
            <Button
              large
              intent={Intent.DANGER}
              icon={IconNames.WARNING_SIGN}
              text={t(getTranslationPath(COMMON_TRK, turnOn))}
              onClick={turnOnSpiFn}
            />
            <Button
              large
              icon={IconNames.TICK}
              text={t(getTranslationPath(COMMON_TRK, ok))}
              onClick={closeDialog}
            />
          </>
        );

      default:
        return <></>;
    }
  }, [dialogType, t, turnOnSpiFn]);

  return (
    <>
      <Container className={clsx({ [Classes.SKELETON]: loading })} fullHeight>
        <Item className={styles.overflowItem}>
          <Switch
            large
            alignIndicator={Alignment.RIGHT}
            label={t(getTranslationPath(SETTINGS_TRK, spiTitle))}
            checked={spiStatus === BOOT_CONFIG_VALUE.ON}
            onChange={onSpiClick}
          />
        </Item>
        <Item className={styles.overflowItem}></Item>
      </Container>

      <Dialog
        className={clsx({ [Classes.SKELETON]: loading })}
        isOpen={Boolean(dialogType)}
        title={dialogHead}
        canEscapeKeyClose
        canOutsideClickClose
        isCloseButtonShown
        onClose={closeDialog}
      >
        <DialogBody>
          <p className={Classes.TEXT_LARGE}>{dialogBody}</p>
        </DialogBody>
        <DialogFooter minimal>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>{dialogFooter}</div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Performance;
