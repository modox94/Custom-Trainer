import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { TRANSLATION_ROOT_KEYS } from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import SquareGrid from "../SquareGrid/SquareGrid";

const { COMMON } = TRANSLATION_ROOT_KEYS;
const { MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const MainPage = props => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const items = useMemo(() => {
    return [
      {
        title: t(getTPath(MANUAL_MODE)),
        onClick: () => navigate(PAGES_PATHS[MANUAL_MODE]),
      },

      {
        title: t(getTPath(SELECT_PROGRAM)),
        onClick: () => navigate(PAGES_PATHS[SELECT_PROGRAM]),
      },

      {
        title: t(getTPath(SETTINGS)),
        onClick: () => navigate(PAGES_PATHS[SETTINGS]),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, t, i18n.language]);

  return <SquareGrid columns={3} items={items} />;
};

export default MainPage;
