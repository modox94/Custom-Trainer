import {
  Button,
  ButtonGroup,
  Classes,
  Dialog,
  Icon,
  Navbar,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useMatch } from "react-router-dom";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getFooterStatus } from "../../selectors/environmentSelectors";
import { hideFooter, showFooter } from "../../slices/environmentSlice";
import { getTranslationPath } from "../../utils/translationUtils";
import stylesMainPage from "../MainPage/MainPage.module.css";
import styles from "./Footer.module.css";

const containerStyle = { top: "unset" };
const DASH = " — ";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;
const { COMMON, PROGRAM_EDITOR, TIPS } = TRANSLATION_ROOT_KEYS;
const { ok } = TRANSLATION_KEYS[COMMON];
const {
  tipTitle,
  settingsTip,
  quitBut,
  quitTip,
  rpmBut,
  rpmTip,
  totalDurationBut,
  totalDurationTip,
  resistanceBut,
  resistanceTip,
} = TRANSLATION_KEYS[TIPS];

const TIP_DEFAULT = null;
const TIPS_PATH_DEFAULT = null;

const Footer = props => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const footerStatus = useSelector(getFooterStatus);
  const [tip, setTip] = useState(TIP_DEFAULT);
  const [tipsPath, setTipsPath] = useState(TIPS_PATH_DEFAULT);

  const filenameMatchPE_EDIT = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/:${SUB_PATHS.FILENAME}`,
  );
  const filenameMatchPE_COPY = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/:${SUB_PATHS.FILENAME}`,
  );

  useEffect(() => {
    const { pathname } = location;

    switch (pathname) {
      case PAGES_PATHS[MAIN]: {
        const path = [PAGES_PATHS[MAIN]];
        if (!footerStatus) {
          dispatch(showFooter());
        }
        setTipsPath(path);
        break;
      }

      case PAGES_PATHS[MANUAL_MODE]:
      case PAGES_PATHS[SETTINGS]:
      case PAGES_PATHS[SELECT_PROGRAM]:
      case PAGES_PATHS[PROGRAM_EDITOR]:
      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}`:
      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}`:
      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].DELETE}`:
        if (footerStatus) {
          dispatch(hideFooter());
        }
        break;

      case `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}`: {
        const path = [PAGES_PATHS[PROGRAM_EDITOR]];
        if (!footerStatus) {
          dispatch(showFooter());
        }
        setTipsPath(path);
        break;
      }

      default: {
        if (filenameMatchPE_EDIT || filenameMatchPE_COPY) {
          const path = [PAGES_PATHS[PROGRAM_EDITOR]];
          if (!footerStatus) {
            dispatch(showFooter());
          }
          setTipsPath(path);
        } else {
          if (footerStatus) {
            dispatch(hideFooter());
          }
        }
        break;
      }
    }
  }, [
    location,
    location.pathname,
    footerStatus,
    dispatch,
    filenameMatchPE_EDIT,
    filenameMatchPE_COPY,
  ]);

  const tipsObject = useMemo(() => {
    return {
      [PAGES_PATHS[MAIN]]: [
        {
          buttonIcon: (
            <Icon
              className={stylesMainPage.settingsIcon}
              icon={IconNames.COG}
            />
          ),
          buttonText: t(getTranslationPath(COMMON, SETTINGS)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon
                    className={stylesMainPage.settingsIcon}
                    icon={IconNames.COG}
                  />
                  {`${DASH}${t(getTranslationPath(TIPS, settingsTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: (
            <Icon className={stylesMainPage.quitIcon} icon={IconNames.POWER} />
          ),
          buttonText: t(getTranslationPath(TIPS, quitBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon
                    className={stylesMainPage.quitIcon}
                    icon={IconNames.POWER}
                  />
                  {`${DASH}${t(getTranslationPath(TIPS, quitTip))}`}
                </>
              ),
            }),
        },
      ],
      [PAGES_PATHS[PROGRAM_EDITOR]]: [
        {
          buttonIcon: <Icon icon={IconNames.DASHBOARD} />,
          buttonText: t(getTranslationPath(TIPS, rpmBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon icon={IconNames.DASHBOARD} />
                  {`${DASH}${t(getTranslationPath(TIPS, rpmTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <Icon icon={IconNames.STOPWATCH} />,
          buttonText: t(getTranslationPath(TIPS, totalDurationBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon icon={IconNames.STOPWATCH} />
                  {`${DASH}${t(getTranslationPath(TIPS, totalDurationTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <Icon icon={IconNames.MOUNTAIN} />,
          buttonText: t(getTranslationPath(TIPS, resistanceBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon icon={IconNames.MOUNTAIN} />
                  {`${DASH}${t(getTranslationPath(TIPS, resistanceTip))}`}
                </>
              ),
            }),
        },
      ],
    };
  }, [t, setTip]);

  const onTipClose = useCallback(() => setTip(TIP_DEFAULT), [setTip]);

  if (!footerStatus) {
    return null;
  }

  return (
    <Navbar fixedToTop className={styles.footer} style={containerStyle}>
      <ButtonGroup large minimal>
        {get(tipsObject, tipsPath, []).map((tipEl, idx) => {
          return (
            <Button
              key={`${tipsPath.join("-")}-${idx}`}
              icon={tipEl.buttonIcon}
              text={tipEl.buttonText}
              onClick={tipEl.onClick}
            />
          );
        })}
      </ButtonGroup>

      <Dialog
        isOpen={Boolean(tip)}
        title={t(getTranslationPath(TIPS, tipTitle))}
        canOutsideClickClose
        isCloseButtonShown
        onClose={onTipClose}
      >
        <div className={Classes.DIALOG_BODY}>
          <p className={Classes.TEXT_LARGE}>{get(tip, ["body"], "")}</p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
              icon={IconNames.TICK}
              text={t(getTranslationPath(COMMON, ok))}
              onClick={onTipClose}
            />
          </div>
        </div>
      </Dialog>
    </Navbar>
  );
};

export default Footer;