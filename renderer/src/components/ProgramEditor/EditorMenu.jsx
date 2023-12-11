import { Alert, Classes, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadFromProgram } from "../../api/ipc";
import { ERRORS } from "../../constants/commonConst";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import {
  getProgramSteps,
  getProgramTitle,
  resetProgramSteps,
  resetProgramTitle,
} from "../../slices/environmentSlice";
import { getTranslationPath } from "../../utils/translationUtils";
import ErrorText from "../ErrorText/ErrorText";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { COMMON_TRK, PROGRAM_EDITOR_TRK } = TRANSLATION_ROOT_KEYS;
const { ok } = TRANSLATION_KEYS[COMMON_TRK];
const {
  copyProgram,
  deleteProgram,
  editProgram,
  loadFromFile,
  newProgram,
  programLoaded,
  saveToFile,
} = TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];
const { PROGRAM_EDITOR } = PAGES;

const getTPath = (...args) => getTranslationPath(PROGRAM_EDITOR_TRK, ...args);

const EditorMenu = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alertProps, setAlertProps] = useState(null);
  const title = useSelector(getProgramTitle);
  const savedSteps = useSelector(getProgramSteps);

  useEffect(() => {
    if (title?.length > 0) {
      dispatch(resetProgramTitle());
    }
    if (savedSteps !== undefined) {
      dispatch(resetProgramSteps());
    }
  }, [dispatch, savedSteps, title]);

  const onClickNew = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}`,
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

  const onClickSaveTo = useCallback(
    () =>
      navigate(
        `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].SAVE_TO}`,
      ),
    [navigate],
  );

  const onClickLoadFrom = useCallback(async () => {
    setLoading(true);

    const result = await loadFromProgram();
    if (result?.data) {
      setAlertProps({
        intent: Intent.SUCCESS,
        icon: IconNames.CONFIRM,
        children: t(getTPath(programLoaded), {
          programTitle: get(result, ["data", "title"], ""),
        }),
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
          onClick={onClickNew}
        >
          <h1>{t(getTPath(newProgram))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickEdit}
        >
          <h1>{t(getTPath(editProgram))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickCopy}
        >
          <h1>{t(getTPath(copyProgram))}</h1>
        </Item>
      </Container>
      <Container>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickDelete}
        >
          <h1>{t(getTPath(deleteProgram))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickSaveTo}
        >
          <h1>{t(getTPath(saveToFile))}</h1>
        </Item>
        <Item
          className={clsx({ [Classes.SKELETON]: loading })}
          onClick={onClickLoadFrom}
        >
          <h1>{t(getTPath(loadFromFile))}</h1>
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
          confirmButtonText={t(getTranslationPath(COMMON_TRK, ok))}
          onCancel={onCloseAlert}
          onConfirm={onCloseAlert}
        >
          {alertProps.children}
        </Alert>
      )}
    </>
  );
};

export default EditorMenu;
