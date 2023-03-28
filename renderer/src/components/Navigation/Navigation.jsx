import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { setFullScreen, useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import styles from "./Navigation.module.css";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;
const { COMMON_TRK, WORKOUT_TRK, PROGRAM_EDITOR_TRK } = TRANSLATION_ROOT_KEYS;
const { back, fullscreen } = TRANSLATION_KEYS[COMMON_TRK];
const { newProgram, editProgram, copyProgram, deleteProgram } =
  TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];
const { programMode } = TRANSLATION_KEYS[WORKOUT_TRK];

const getTPath = (...args) => getTranslationPath(COMMON_TRK, ...args);

const Navigation = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const filenameMatch = useMatch(
    `${PAGES_PATHS[SELECT_PROGRAM]}/:${SUB_PATHS.FILENAME}`,
  );

  const { data: programs = {} } = useGetProgramsQuery();
  const programTitle = useMemo(() => {
    if (filenameMatch) {
      const filename = get(filenameMatch, ["params", SUB_PATHS.FILENAME]);

      return get(programs, [filename, "title"], "") || "";
    }

    return "";
  }, [filenameMatch, programs]);

  useEffect(() => {
    const { pathname } = location;

    switch (pathname) {
      case PAGES_PATHS[MAIN]:
        setTitle(t(getTPath(MAIN)));
        break;

      case PAGES_PATHS[MANUAL_MODE]:
        setTitle(t(getTPath(MANUAL_MODE)));
        break;

      case PAGES_PATHS[SETTINGS]:
      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].TRANSLATE}`:
        setTitle(t(getTPath(SETTINGS)));
        break;

      case PAGES_PATHS[SELECT_PROGRAM]:
        setTitle(t(getTPath(SELECT_PROGRAM)));
        break;

      case PAGES_PATHS[PROGRAM_EDITOR]:
        setTitle(t(getTPath(PROGRAM_EDITOR)));
        break;

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}`:
        setTitle(t(getTranslationPath(PROGRAM_EDITOR_TRK, newProgram)));
        break;

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}`:
        setTitle(t(getTranslationPath(PROGRAM_EDITOR_TRK, editProgram)));
        break;

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}`:
        setTitle(t(getTranslationPath(PROGRAM_EDITOR_TRK, copyProgram)));
        break;

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].DELETE}`:
        setTitle(t(getTranslationPath(PROGRAM_EDITOR_TRK, deleteProgram)));
        break;

      default: {
        if (filenameMatch) {
          const newTitle = `${t(
            getTranslationPath(WORKOUT_TRK, programMode),
          )}: ${programTitle}`;
          setTitle(newTitle);
        }
        break;
      }
    }
  }, [location, filenameMatch, programTitle, t]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Navbar fixedToTop className={styles.navbar}>
      <NavbarGroup>
        <Button
          large
          icon={IconNames.ARROW_LEFT}
          text={t(getTPath(back))}
          disabled={location.pathname === PAGES_PATHS[MAIN]}
          onClick={goBack}
        />
      </NavbarGroup>
      <NavbarGroup>
        <NavbarHeading>{title}</NavbarHeading>
      </NavbarGroup>
      <NavbarGroup>
        <Button
          large
          rightIcon={IconNames.FULLSCREEN}
          text={t(getTPath(fullscreen))}
          onClick={setFullScreen}
        />
      </NavbarGroup>
    </Navbar>
  );
};

export default Navigation;
