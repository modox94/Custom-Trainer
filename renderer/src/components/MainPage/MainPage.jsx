import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { appQuit, storeTest } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { TRANSLATION_ROOT_KEYS } from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./MainPage.module.css";

const { COMMON } = TRANSLATION_ROOT_KEYS;
const { MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const MainPage = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      console.log("storeTest", await storeTest());
    })();
  }, []);

  const onClickMM = useCallback(
    () => navigate(PAGES_PATHS[MANUAL_MODE]),
    [navigate],
  );
  const onClickSP = useCallback(
    () => navigate(PAGES_PATHS[SELECT_PROGRAM]),
    [navigate],
  );
  const onClickS = useCallback(
    () => navigate(PAGES_PATHS[SETTINGS]),
    [navigate],
  );

  return (
    <>
      <Container>
        <Item onClick={onClickMM}>
          <h1>{t(getTPath(MANUAL_MODE))}</h1>
        </Item>
        <Item onClick={onClickSP}>
          <h1>{t(getTPath(SELECT_PROGRAM))}</h1>
        </Item>
        <Item onClick={onClickS}>
          <h1>{t(getTPath(SETTINGS))}</h1>
        </Item>
      </Container>
      <Container>
        <Item onClick={onClickS}>
          <h1>{t(getTPath(SETTINGS))}</h1>
        </Item>
        <Item onClick={onClickS}>
          <h1>{t(getTPath(SETTINGS))}</h1>
        </Item>
        <Item onClick={appQuit}>
          <Icon className={styles.icon} icon={IconNames.POWER} />
        </Item>
      </Container>
    </>
  );
};

export default MainPage;
