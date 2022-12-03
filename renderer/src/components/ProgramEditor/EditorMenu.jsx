import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { COMMON } = TRANSLATION_ROOT_KEYS;
const { newProgram } = TRANSLATION_KEYS[COMMON];
const { PROGRAM_EDITOR } = PAGES;

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const EditorMenu = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickNP = useCallback(
    () => navigate(PAGES_PATHS[PROGRAM_EDITOR] + "/new"),
    [navigate],
  );

  return (
    <Container>
      <Item onClick={onClickNP}>
        <h1>{t(getTPath(newProgram))}</h1>
      </Item>
      <Item>
        <h1>TODO EDIT PROG</h1>
      </Item>
      <Item>
        <h1>TODO DELETE PROG</h1>
      </Item>
    </Container>
  );
};

export default EditorMenu;
