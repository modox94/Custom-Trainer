import { chunk, get, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { SP_MODE } from "../../constants/TODOconst";
import { Container, Item } from "../SquareGrid/SquareGrid";
import { Button, Classes, Dialog } from "@blueprintjs/core";
import { getTranslationPath } from "../../utils/translationUtils";
import { useTranslation } from "react-i18next";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";

const { SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;
const { COMMON, WORKOUT } = TRANSLATION_ROOT_KEYS;
const { back, deleteTKey } = TRANSLATION_KEYS[COMMON];
const { trainingDone, trainingDoneMsg } = TRANSLATION_KEYS[WORKOUT];

const getTPath = (...args) => getTranslationPath(WORKOUT, ...args);

const SelectProgram = props => {
  const { mode } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    }) || {};

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
            onClick = () => console.log("copy!!!");
            break;

          case SP_MODE.DELETE:
            onClick = () => console.log("delete!!!");
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
        // isOpen={true}
        className={Classes.TEXT_LARGE}
        title={t(getTPath(trainingDone))}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
      >
        <div className={Classes.DIALOG_BODY}>
          <p className={Classes.TEXT_LARGE}>{t(getTPath(trainingDoneMsg))}</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
              icon="trash"
              intent="danger"
              text={t(getTranslationPath(COMMON, deleteTKey))}
              onClick={noop}
            />
            <Button
              large
              icon="arrow-left"
              intent="primary"
              text={t(getTranslationPath(COMMON, back))}
              onClick={noop}
            />
          </div>
        </div>
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
