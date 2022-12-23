import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const { SETTINGS: SETTINGS_TRK } = TRANSLATION_ROOT_KEYS;
const { interfaceTKey, peripheral, performance, advanced } =
  TRANSLATION_KEYS[SETTINGS_TRK];
const { SETTINGS } = PAGES;

const getTPath = (...args) => getTranslationPath(SETTINGS_TRK, ...args);

const Settings = props => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const onClickTranslate = useCallback(
    () => navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].TRANSLATE}`),
    [navigate],
  );

  const onClickInterface = useCallback(
    () => navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].INTERFACE}`),
    [navigate],
  );

  const onClickPeripheral = useCallback(
    () =>
      navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}`),
    [navigate],
  );

  const onClickPerformance = useCallback(
    () =>
      navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERFORMANCE}`),
    [navigate],
  );

  const onClickAdvanced = useCallback(
    () => navigate(`${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].ADVANCED}`),
    [navigate],
  );

  return (
    <>
      <Container>
        <Item onClick={onClickTranslate}>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.TRANSLATE}
          />
        </Item>
        <Item onClick={onClickInterface}>
          <h1>{t(getTPath(interfaceTKey))}</h1>
        </Item>
        <Item onClick={onClickPeripheral}>
          <h1>{t(getTPath(peripheral))}</h1>
        </Item>
      </Container>
      <Container>
        <Item onClick={onClickPerformance}>
          <h1>{t(getTPath(performance))}</h1>
        </Item>
        <Item onClick={onClickAdvanced}>
          <h1>{t(getTPath(advanced))}</h1>
        </Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Settings;
