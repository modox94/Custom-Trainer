import { Button, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { setFullScreen } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import {
  useGetCadenceQuery,
  useGetProgramQuery,
  setMotorLevel,
  stopMotor,
} from "../../api/ipc";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;
const { COMMON } = TRANSLATION_ROOT_KEYS;
const { back, fullscreen, programMode } = TRANSLATION_KEYS[COMMON];

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const ProgramMode = props => {
  const location = useLocation();
  const programTitle = useMemo(
    () => location.pathname.slice(PAGES_PATHS[SELECT_PROGRAM].length + 1),
    [location],
  );
  const { data: currentRpm } = useGetCadenceQuery() || {};
  const { data: programArray } = useGetProgramQuery(programTitle) || {};

  useEffect(() => {
    return stopMotor;
  }, []);

  return (
    <>
      <span>currentRpm: {currentRpm}</span>
      <span>programArray: {JSON.stringify(programArray)}</span>
    </>
  );
};

export default ProgramMode;
