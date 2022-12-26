import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { editSettings } from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import { LANGS_CODES } from "../../constants/translationConst";
import { RuIcon, UsIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./Settings.module.css";

const Translate = props => {
  const { i18n } = useTranslation();

  const changeLanguage = langCode => {
    editSettings(FILE_CONST.INTERFACE, "lang", langCode);
  };

  const selectRu =
    i18n.language === LANGS_CODES.ru
      ? undefined
      : () => changeLanguage(LANGS_CODES.ru);

  const selectEn =
    i18n.language === LANGS_CODES.en
      ? undefined
      : () => changeLanguage(LANGS_CODES.en);

  return (
    <Container>
      <Item
        className={clsx(styles.langIconContainer, {
          [styles.selected]: i18n.language === LANGS_CODES.ru,
        })}
        onClick={selectRu}
      >
        <RuIcon className={styles.langIcon} />
      </Item>
      <Item
        className={clsx(styles.langIconContainer, {
          [styles.selected]: i18n.language === LANGS_CODES.en,
        })}
        onClick={selectEn}
      >
        <UsIcon className={styles.langIcon} />
      </Item>
    </Container>
  );
};

export default Translate;
