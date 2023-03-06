import {
  Button,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  Intent,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { chunk, get } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { deleteProgram, useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { SP_MODE } from "../../constants/selectProgramConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;
const { COMMON_TRK, PROGRAM_EDITOR_TRK } = TRANSLATION_ROOT_KEYS;
const { deleteTKey, cancelTKey, copyTKey } = TRANSLATION_KEYS[COMMON_TRK];
const { deleteProgHead, deleteProgMsg, copyProgHead, copyProgMsg } =
  TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];

const TARGET_DEFAULT = null;

const SelectProgram = props => {
  const { mode } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [target, setTarget] = useState(TARGET_DEFAULT);
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    }) || {};

  const onDialogClose = useCallback(() => {
    switch (mode) {
      case SP_MODE.COPY:
      case SP_MODE.DELETE:
        setTarget(TARGET_DEFAULT);
        break;

      default:
        break;
    }
  }, [mode]);

  const onDialogBtn1 = useCallback(() => {
    switch (mode) {
      case SP_MODE.COPY:
        navigate(
          `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/${target}`,
        );
        break;

      case SP_MODE.DELETE:
        deleteProgram(target);
        setTarget(TARGET_DEFAULT);
        break;

      default:
        break;
    }
  }, [mode, navigate, target]);

  const onDialogBtn2 = useCallback(() => {
    switch (mode) {
      case SP_MODE.COPY:
      case SP_MODE.DELETE:
        onDialogClose();
        break;

      default:
        break;
    }
  }, [mode, onDialogClose]);

  const dialogProps = useMemo(() => {
    let header = "";
    let message = "";
    let btn1Text = "";
    let btn1Icon = undefined;
    let btn1Intent = Intent.NONE;
    let btn2Text = "";
    let btn2Icon = undefined;
    let btn2Intent = Intent.NONE;

    switch (mode) {
      case SP_MODE.COPY:
        header = getTranslationPath(PROGRAM_EDITOR_TRK, copyProgHead);
        message = getTranslationPath(PROGRAM_EDITOR_TRK, copyProgMsg);

        btn1Text = getTranslationPath(COMMON_TRK, copyTKey);
        btn1Icon = IconNames.DUPLICATE;
        btn1Intent = Intent.PRIMARY;
        btn2Text = getTranslationPath(COMMON_TRK, cancelTKey);
        break;

      case SP_MODE.DELETE:
        header = getTranslationPath(PROGRAM_EDITOR_TRK, deleteProgHead);
        message = getTranslationPath(PROGRAM_EDITOR_TRK, deleteProgMsg);

        btn1Text = getTranslationPath(COMMON_TRK, deleteTKey);
        btn1Icon = IconNames.TRASH;
        btn1Intent = Intent.DANGER;
        btn2Text = getTranslationPath(COMMON_TRK, cancelTKey);
        break;

      default:
        break;
    }

    return {
      header,
      message,
      btn1Text,
      btn1Icon,
      btn1Intent,
      btn2Text,
      btn2Icon,
      btn2Intent,
    };
  }, [mode]);

  const items = useMemo(() => {
    return chunk(
      (Object.keys(programs) || []).map((fileName, idx) => {
        let onClick;
        switch (mode) {
          case SP_MODE.SELECT:
            onClick = () =>
              navigate(`${PAGES_PATHS[SELECT_PROGRAM]}/${fileName}`);
            break;

          case SP_MODE.EDIT:
            onClick = () =>
              navigate(
                `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/${fileName}`,
              );
            break;

          case SP_MODE.COPY:
          case SP_MODE.DELETE:
            onClick = () => setTarget(fileName);
            break;

          default:
            break;
        }

        return {
          key: fileName,
          onClick,
          children: <h1>{get(programs, [fileName, "title"], "")}</h1>,
        };
      }),
      3,
    );
  }, [mode, navigate, programs]);

  return (
    <>
      <Dialog
        isOpen={Boolean(target)}
        className={Classes.TEXT_LARGE}
        title={t(dialogProps.header)}
        canOutsideClickClose
        isCloseButtonShown
        onClose={onDialogClose}
      >
        <DialogBody>
          <p className={Classes.TEXT_LARGE}>
            {t(dialogProps.message, {
              programTitle: get(programs, [target, "title"], ""),
            })}
          </p>
        </DialogBody>
        <DialogFooter minimal>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
              icon={dialogProps.btn1Icon}
              intent={dialogProps.btn1Intent}
              text={t(dialogProps.btn1Text)}
              onClick={onDialogBtn1}
            />
            <Button
              large
              icon={dialogProps.btn2Icon}
              intent={dialogProps.btn2Intent}
              text={t(dialogProps.btn2Text)}
              onClick={onDialogBtn2}
            />
          </div>
        </DialogFooter>
      </Dialog>
      {items.map(row => (
        <Container key={row.reduce((acc, item) => acc + item.key, "")}>
          {row.map(item => {
            const { key, onClick, children } = item;
            return (
              <Item key={key} onClick={onClick}>
                {children}
              </Item>
            );
          })}
        </Container>
      ))}
    </>
  );
};

SelectProgram.propTypes = {
  mode: PropTypes.string,
};
SelectProgram.defaultProps = {
  mode: SP_MODE.SELECT,
};

export default SelectProgram;
