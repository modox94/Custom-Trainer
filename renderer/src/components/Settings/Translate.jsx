import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { editSettings } from "../../api/ipc";
import { FILE_CONST } from "../../constants/reduxConst";
import { LANGS_CODES } from "../../constants/translationConst";
import { ReactComponent as RuIcon } from "../Icons/ru.svg";
import { ReactComponent as UsIcon } from "../Icons/us.svg";
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
        className={clsx(styles.customIcon, {
          [styles.selected]: i18n.language === LANGS_CODES.ru,
        })}
        onClick={selectRu}
      >
        <RuIcon />
      </Item>
      <Item
        className={clsx(styles.customIcon, {
          [styles.selected]: i18n.language === LANGS_CODES.en,
        })}
        onClick={selectEn}
      >
        <UsIcon />
      </Item>
    </Container>
  );
};

export default Translate;
