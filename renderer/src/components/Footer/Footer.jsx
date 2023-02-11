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
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  DumbbellIcon,
  GaugeHighIcon,
  MicrochipIcon,
  WiresWireIcon,
} from "../Icons";
import styles from "./Footer.module.css";

const containerStyle = { top: "unset" };
const DASH = " — ";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;
const {
  COMMON,
  PROGRAM_EDITOR,
  TIPS,
  SETTINGS: SETTINGS_TRK,
} = TRANSLATION_ROOT_KEYS;
const { ok } = TRANSLATION_KEYS[COMMON];
const { languageTKey, interfaceTKey, peripheral } =
  TRANSLATION_KEYS[SETTINGS_TRK];
const {
  tipBut,
  tipDescrip,
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
  languageTip,
  interfaceTip,
  peripheralTip,
  manualModeTip,
  selectProgramTip,
  programEditorTip,
} = TRANSLATION_KEYS[TIPS];

const getTPath = (...args) => getTranslationPath(TIPS, ...args);

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
        if (!footerStatus) {
          dispatch(showFooter());
        }
        setTipsPath([pathname]);
        break;
      }

      case PAGES_PATHS[MANUAL_MODE]:
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
        if (!footerStatus) {
          dispatch(showFooter());
        }
        setTipsPath([PAGES_PATHS[PROGRAM_EDITOR]]);
        break;
      }

      case PAGES_PATHS[SETTINGS]: {
        if (!footerStatus) {
          dispatch(showFooter());
        }
        setTipsPath([pathname]);
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
    footerStatus,
    dispatch,
    filenameMatchPE_EDIT,
    filenameMatchPE_COPY,
    location,
  ]);

  const tipsObject = useMemo(() => {
    return {
      [PAGES_PATHS[MAIN]]: [
        {
          buttonIcon: (
            <Icon className={styles.greenIcon} icon={IconNames.SWAP_VERTICAL} />
          ),
          buttonText: t(getTranslationPath(COMMON, MANUAL_MODE)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon
                    className={styles.greenIcon}
                    icon={IconNames.SWAP_VERTICAL}
                  />
                  {`${DASH}${t(getTPath(manualModeTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <MicrochipIcon className={styles.greenIcon} />,
          buttonText: t(getTranslationPath(COMMON, SELECT_PROGRAM)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <MicrochipIcon className={styles.greenIcon} />
                  {`${DASH}${t(getTPath(selectProgramTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: (
            <Icon className={styles.blueIcon} icon={IconNames.EDIT} />
          ),
          buttonText: t(getTranslationPath(COMMON, PROGRAM_EDITOR)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon className={styles.blueIcon} icon={IconNames.EDIT} />
                  {`${DASH}${t(getTPath(programEditorTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <Icon className={styles.blueIcon} icon={IconNames.COG} />,
          buttonText: t(getTranslationPath(COMMON, SETTINGS)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon className={styles.blueIcon} icon={IconNames.COG} />
                  {`${DASH}${t(getTPath(settingsTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: (
            <Icon className={styles.redIcon} icon={IconNames.POWER} />
          ),
          buttonText: t(getTPath(quitBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon className={styles.redIcon} icon={IconNames.POWER} />
                  {`${DASH}${t(getTPath(quitTip))}`}
                </>
              ),
            }),
        },
      ],
      [PAGES_PATHS[PROGRAM_EDITOR]]: [
        {
          buttonIcon: <GaugeHighIcon />,
          buttonText: t(getTPath(rpmBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <GaugeHighIcon />
                  {`${DASH}${t(getTPath(rpmTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <Icon icon={IconNames.STOPWATCH} />,
          buttonText: t(getTPath(totalDurationBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon icon={IconNames.STOPWATCH} />
                  {`${DASH}${t(getTPath(totalDurationTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <DumbbellIcon />,
          buttonText: t(getTPath(resistanceBut)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <DumbbellIcon />
                  {`${DASH}${t(getTPath(resistanceTip))}`}
                </>
              ),
            }),
        },
      ],
      [PAGES_PATHS[SETTINGS]]: [
        {
          buttonIcon: (
            <Icon className={styles.blueIcon} icon={IconNames.TRANSLATE} />
          ),
          buttonText: t(getTranslationPath(SETTINGS_TRK, languageTKey)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon
                    className={styles.blueIcon}
                    icon={IconNames.TRANSLATE}
                  />
                  {`${DASH}${t(getTPath(languageTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: (
            <Icon className={styles.blueIcon} icon={IconNames.APPLICATION} />
          ),
          buttonText: t(getTranslationPath(SETTINGS_TRK, interfaceTKey)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <Icon
                    className={styles.blueIcon}
                    icon={IconNames.APPLICATION}
                  />
                  {`${DASH}${t(getTPath(interfaceTip))}`}
                </>
              ),
            }),
        },
        {
          buttonIcon: <WiresWireIcon className={styles.blueIcon} />,
          buttonText: t(getTranslationPath(SETTINGS_TRK, peripheral)),
          onClick: () =>
            setTip({
              body: (
                <>
                  <WiresWireIcon className={styles.blueIcon} />
                  {`${DASH}${t(getTPath(peripheralTip))}`}
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
        <Button
          icon={IconNames.HELP}
          text={t(getTPath(tipBut))}
          onClick={() => setTip({ body: t(getTPath(tipDescrip)) })}
        />
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
        title={t(getTPath(tipTitle))}
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
