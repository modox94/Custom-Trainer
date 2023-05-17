import { Alignment, Intent, Switch } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { editSettings, useGetSettingsQuery } from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { resetCursorNone, tryCursorNone } from "../../slices/environmentSlice";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import AlertWithTimer from "./AlertWithTimer";
import styles from "./Settings.module.css";

const { COMMON_TRK, SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { cancelTKey, yes } = TRANSLATION_KEYS[COMMON_TRK];
const { cursorNoneTitle, cursorNoneMsg, showTipsTKey, devStatusTKey } =
  TRANSLATION_KEYS[SETTINGS_TRK];

const Interface = props => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const cursorNone = get(settings, [FILE_CONST.INTERFACE, "cursorNone"], false);
  const showTips = get(settings, [FILE_CONST.INTERFACE, "showTips"], false);
  const devStatus = get(settings, [FILE_CONST.INTERFACE, "devStatus"], false);

  const onChangeCursorNone = event => {
    const checked = get(event, ["target", "checked"]);
    if (checked) {
      dispatch(tryCursorNone());
      setShowAlert(true);
    } else if (cursorNone) {
      editSettings(FILE_CONST.INTERFACE, "cursorNone", false);
    }
  };

  const onCancelCursorNone = () => {
    setShowAlert(false);
    dispatch(resetCursorNone());
  };

  const onConfirmCursorNone = () => {
    editSettings(FILE_CONST.INTERFACE, "cursorNone", true);
    dispatch(resetCursorNone());
    setShowAlert(false);
  };

  const onChangeShowTips = event => {
    const checked = get(event, ["target", "checked"]);
    editSettings(FILE_CONST.INTERFACE, "showTips", checked);
  };

  const onChangeDevStatus = event => {
    const checked = get(event, ["target", "checked"]);
    editSettings(FILE_CONST.INTERFACE, "devStatus", checked);
  };

  return (
    <>
      <Container fullHeight>
        <Item className={styles.overflowItem}>
          <Switch
            large
            alignIndicator={Alignment.RIGHT}
            label={t(getTranslationPath(SETTINGS_TRK, cursorNoneTitle))}
            checked={Boolean(cursorNone)}
            onChange={onChangeCursorNone}
          />
          <Switch
            large
            alignIndicator={Alignment.RIGHT}
            label={t(getTranslationPath(SETTINGS_TRK, showTipsTKey))}
            checked={Boolean(showTips)}
            onChange={onChangeShowTips}
          />
          <Switch
            large
            alignIndicator={Alignment.RIGHT}
            label={t(getTranslationPath(SETTINGS_TRK, devStatusTKey))}
            checked={Boolean(devStatus)}
            onChange={onChangeDevStatus}
          />
        </Item>
        <Item className={styles.overflowItem}></Item>
      </Container>

      {showAlert && (
        <AlertWithTimer
          isOpen
          large
          canEscapeKeyCancel
          canOutsideClickCancel
          intent={Intent.SUCCESS}
          icon={IconNames.CONFIRM}
          cancelButtonText={t(getTranslationPath(COMMON_TRK, cancelTKey))}
          confirmButtonText={t(getTranslationPath(COMMON_TRK, yes))}
          onCancel={onCancelCursorNone}
          onConfirm={onConfirmCursorNone}
        >
          <p>{t(getTranslationPath(SETTINGS_TRK, cursorNoneMsg))}</p>
        </AlertWithTimer>
      )}
    </>
  );
};

export default Interface;
