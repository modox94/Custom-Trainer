import {
  Button,
  Intent,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { setFullScreen, useGetProgramsQuery } from "../../api/ipc";
import { COMMON_CONST } from "../../constants/commonConst";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import DialogCustom from "../DialogCustom/DialogCustom";
import ErrorText from "../ErrorText/ErrorText";
import styles from "./Navigation.module.css";

const { DASH } = COMMON_CONST;
const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;
const { COMMON_TRK, WORKOUT_TRK, PROGRAM_EDITOR_TRK, SETTINGS_TRK, TIPS_TRK } =
  TRANSLATION_ROOT_KEYS;
const { back, fullscreen, warning, cancelTKey, continueTKey, allDataWillLost } =
  TRANSLATION_KEYS[COMMON_TRK];
const { newProgram, editProgram, copyProgram, deleteProgram, saveToFile } =
  TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];
const { programMode } = TRANSLATION_KEYS[WORKOUT_TRK];
const { languageTKey, interfaceTKey, peripheral, performance, advanced } =
  TRANSLATION_KEYS[SETTINGS_TRK];
const { motorBut, calibrationBut, rpmSettingsBut, heartBeatSettingsBut } =
  TRANSLATION_KEYS[TIPS_TRK];

const getTPath = (...args) => getTranslationPath(COMMON_TRK, ...args);

const DANGER_PATH_ARRAY = [
  `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}`,
  `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}`,
  `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}`,
];

const DEFAULT_DIALOG_PROPS = {
  isOpen: false,
};

const Navigation = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [dialogProps, setDialogProps] = useState(DEFAULT_DIALOG_PROPS);
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
        setTitle(t(getTPath(SETTINGS)));
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].TRANSLATE}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, languageTKey),
          )}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].INTERFACE}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, interfaceTKey),
          )}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, peripheral),
          )}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].MOTOR}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, peripheral),
          )} ${DASH} ${t(getTranslationPath(TIPS_TRK, motorBut))}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].CALIBRATION}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, peripheral),
          )} ${DASH} ${t(getTranslationPath(TIPS_TRK, calibrationBut))}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].RPM}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, peripheral),
          )} ${DASH} ${t(getTranslationPath(TIPS_TRK, rpmSettingsBut))}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERIPHERAL}/${SUB_PATHS[SETTINGS].HEARTBEAT}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, peripheral),
          )} ${DASH} ${t(getTranslationPath(TIPS_TRK, heartBeatSettingsBut))}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].PERFORMANCE}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, performance),
          )}`,
        );
        break;

      case `${PAGES_PATHS[SETTINGS]}/${SUB_PATHS[SETTINGS].ADVANCED}`:
        setTitle(
          `${t(getTPath(SETTINGS))} ${DASH} ${t(
            getTranslationPath(SETTINGS_TRK, advanced),
          )}`,
        );
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

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].SAVE_TO}`:
        setTitle(t(getTranslationPath(PROGRAM_EDITOR_TRK, saveToFile)));
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
    const { pathname } = location;

    if (DANGER_PATH_ARRAY.find(pathEl => pathname.includes(pathEl))) {
      setDialogProps({
        isOpen: true,
        icon: IconNames.WARNING_SIGN,
        title: t(getTranslationPath(COMMON_TRK, warning)),
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        isCloseButtonShown: true,
        body: (
          <ErrorText
            text={t(getTranslationPath(COMMON_TRK, allDataWillLost))}
          />
        ),
        footerMinimal: true,
      });
    } else {
      navigate(-1);
    }
  };

  const goBackForce = () => {
    setDialogProps(DEFAULT_DIALOG_PROPS);
    navigate(-1);
  };

  const onCloseDialog = () => {
    setDialogProps(DEFAULT_DIALOG_PROPS);
  };

  return (
    <>
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

      <DialogCustom
        {...dialogProps}
        onClose={onCloseDialog}
        footer={
          <>
            <Button
              large
              intent={Intent.NONE}
              icon={IconNames.CROSS}
              text={t(getTranslationPath(COMMON_TRK, cancelTKey))}
              onClick={onCloseDialog}
            />
            <Button
              large
              intent={Intent.DANGER}
              icon={IconNames.WARNING_SIGN}
              text={t(getTranslationPath(COMMON_TRK, continueTKey))}
              onClick={goBackForce}
            />
          </>
        }
      />
    </>
  );
};

export default Navigation;
