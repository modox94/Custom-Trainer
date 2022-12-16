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

const { PROGRAM_EDITOR: PE_TRK } = TRANSLATION_ROOT_KEYS;
const { newProgram, editProgram, copyProgram, deleteProgram } =
  TRANSLATION_KEYS[PE_TRK];
const { PROGRAM_EDITOR } = PAGES;

const getTPath = (...args) => getTranslationPath(PE_TRK, ...args);

const EditorMenu = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickNew = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}`,
      ),
    [navigate],
  );

  const onClickEdit = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}`,
      ),
    [navigate],
  );

  const onClickCopy = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}`,
      ),
    [navigate],
  );

  const onClickDelete = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].DELETE}`,
      ),
    [navigate],
  );

  return (
    <>
      <Container>
        <Item onClick={onClickNew}>
          <h1>{t(getTPath(newProgram))}</h1>
        </Item>
        <Item onClick={onClickEdit}>
          <h1>{t(getTPath(editProgram))}</h1>
        </Item>
        <Item onClick={onClickCopy}>
          <h1>{t(getTPath(copyProgram))}</h1>
        </Item>
      </Container>
      <Container>
        <Item onClick={onClickDelete}>
          <h1>{t(getTPath(deleteProgram))}</h1>
        </Item>
      </Container>
    </>
  );
};

export default EditorMenu;
