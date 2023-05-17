import { PortalProvider } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import clsx from "clsx";
import { get } from "lodash";
import "normalize.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { useGetBootQuery, useGetSettingsQuery } from "./api/ipc";
import Footer from "./components/Footer/Footer";
import MainPage from "./components/MainPage/MainPage";
import ManualMode from "./components/ManualMode/ManualMode";
import Navigation from "./components/Navigation/Navigation";
import EditorMenu from "./components/ProgramEditor/EditorMenu";
import ProgramEditor from "./components/ProgramEditor/ProgramEditor";
import ProgramMode from "./components/ProgramMode/ProgramMode";
import SelectProgram from "./components/SelectProgram/SelectProgram";
import Advanced from "./components/Settings/Advanced";
import Calibration from "./components/Settings/Calibration";
import HeartBeat from "./components/Settings/HeartBeat";
import Interface from "./components/Settings/Interface";
import Motor from "./components/Settings/Motor";
import Performance from "./components/Settings/Performance";
import Peripheral from "./components/Settings/Peripheral";
import Rpm from "./components/Settings/Rpm";
import Settings from "./components/Settings/Settings";
import Translate from "./components/Settings/Translate";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "./constants/pathConst";
import { PE_MODE } from "./constants/programEditorConst";
import { FILE_CONST } from "./constants/reduxConst";
import { SP_MODE } from "./constants/selectProgramConst";
import { LANGS_CODES } from "./constants/translationConst";
import {
  getCursorNoneTemp,
  getFooterStatus,
} from "./selectors/environmentSelectors";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;

const App = () => {
  const { i18n } = useTranslation();
  const footerStatus = useSelector(getFooterStatus);
  const cursorNoneTemp = useSelector(getCursorNoneTemp);
  const { data: settings = {} } =
    useGetSettingsQuery(undefined, { refetchOnMountOrArgChange: true }) || {};
  const lang = get(settings, [FILE_CONST.INTERFACE, "lang"], "");
  const cursorNone = get(settings, [FILE_CONST.INTERFACE, "cursorNone"], false);
  const showTips = get(settings, [FILE_CONST.INTERFACE, "showTips"], false);
  const devStatus = get(settings, [FILE_CONST.INTERFACE, "devStatus"], false);
  useGetBootQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (lang && LANGS_CODES[lang] && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [i18n, lang]);

  useEffect(() => {
    const body = document.querySelector("body");
    body.classList.toggle("cursorNone", cursorNone || cursorNoneTemp);
  }, [cursorNone, cursorNoneTemp]);

  const withFooter = Boolean(footerStatus || devStatus);

  return (
    <PortalProvider>
      <MemoryRouter>
        <div
          className={clsx("app", {
            withHeader: !withFooter,
            withHeaderAndFooter: withFooter,
          })}
        >
          <Navigation />

          <Routes>
            <Route path={PAGES_PATHS[MAIN]} element={<MainPage />} />

            <Route path={PAGES_PATHS[MANUAL_MODE]} element={<ManualMode />} />

            <Route path={PAGES_PATHS[SETTINGS]} element={<Outlet />}>
              <Route path={SUB_PATHS.ROOT} element={<Settings />} />
              <Route
                path={SUB_PATHS[SETTINGS].TRANSLATE}
                element={<Translate />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].INTERFACE}
                element={<Interface />}
              />

              <Route path={SUB_PATHS[SETTINGS].PERIPHERAL} element={<Outlet />}>
                <Route path={SUB_PATHS.ROOT} element={<Peripheral />} />
                <Route path={SUB_PATHS[SETTINGS].MOTOR} element={<Motor />} />
                <Route
                  path={SUB_PATHS[SETTINGS].CALIBRATION}
                  element={<Calibration />}
                />
                <Route path={SUB_PATHS[SETTINGS].RPM} element={<Rpm />} />
                <Route
                  path={SUB_PATHS[SETTINGS].HEARTBEAT}
                  element={<HeartBeat />}
                />
              </Route>

              <Route
                path={SUB_PATHS[SETTINGS].PERFORMANCE}
                element={<Performance />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].ADVANCED}
                element={<Advanced />}
              />
            </Route>

            <Route path={PAGES_PATHS[SELECT_PROGRAM]} element={<Outlet />}>
              <Route
                path={SUB_PATHS.ROOT}
                element={<SelectProgram mode={SP_MODE.SELECT} />}
              />
              <Route
                path={`:${SUB_PATHS.FILENAME}`}
                element={<ProgramMode />}
              />
            </Route>

            <Route path={PAGES_PATHS[PROGRAM_EDITOR]} element={<Outlet />}>
              <Route path={SUB_PATHS.ROOT} element={<EditorMenu />} />
              <Route
                path={SUB_PATHS[PROGRAM_EDITOR].NEW}
                element={<ProgramEditor mode={PE_MODE.NEW} />}
              />
              <Route path={SUB_PATHS[PROGRAM_EDITOR].EDIT} element={<Outlet />}>
                <Route
                  path={SUB_PATHS.ROOT}
                  element={<SelectProgram mode={SP_MODE.EDIT} />}
                />
                <Route
                  path={`:${SUB_PATHS.FILENAME}`}
                  element={<ProgramEditor mode={PE_MODE.EDIT} />}
                />
              </Route>
              <Route path={SUB_PATHS[PROGRAM_EDITOR].COPY} element={<Outlet />}>
                <Route
                  path={SUB_PATHS.ROOT}
                  element={<SelectProgram mode={SP_MODE.COPY} />}
                />
                <Route
                  path={`:${SUB_PATHS.FILENAME}`}
                  element={<ProgramEditor mode={PE_MODE.COPY} />}
                />
              </Route>
              <Route
                path={SUB_PATHS[PROGRAM_EDITOR].DELETE}
                element={<SelectProgram mode={SP_MODE.DELETE} />}
              />
            </Route>
          </Routes>

          {withFooter && <Footer />}
        </div>
      </MemoryRouter>
    </PortalProvider>
  );
};

export default App;
