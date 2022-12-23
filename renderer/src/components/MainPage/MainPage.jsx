import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { appQuit } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { ReactComponent as MicrochipIcon } from "../Icons/microchip-solid.svg";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./MainPage.module.css";

const { MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;

const MainPage = props => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickMM = useCallback(
    () => navigate(PAGES_PATHS[MANUAL_MODE]),
    [navigate],
  );
  const onClickSP = useCallback(
    () => navigate(PAGES_PATHS[SELECT_PROGRAM]),
    [navigate],
  );
  const onClickPE = useCallback(
    () => navigate(PAGES_PATHS[PROGRAM_EDITOR]),
    [navigate],
  );
  const onClickS = useCallback(
    () => navigate(PAGES_PATHS[SETTINGS]),
    [navigate],
  );

  return (
    <>
      <Container>
        <Item onClick={onClickMM}>
          <Icon
            className={clsx(styles.icon, styles.greenIcon)}
            icon={IconNames.SWAP_VERTICAL}
          />
        </Item>
        <Item
          className={clsx(styles.customIcon, styles.greenIcon)}
          onClick={onClickSP}
        >
          <MicrochipIcon />
        </Item>
        <Item onClick={onClickPE}>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.EDIT}
          />
        </Item>
      </Container>
      <Container>
        <Item />
        <Item onClick={onClickS}>
          <Icon
            className={clsx(styles.icon, styles.blueIcon)}
            icon={IconNames.COG}
          />
        </Item>
        <Item onClick={appQuit}>
          <Icon
            className={clsx(styles.icon, styles.redIcon)}
            icon={IconNames.POWER}
          />
        </Item>
      </Container>
    </>
  );
};

export default MainPage;
