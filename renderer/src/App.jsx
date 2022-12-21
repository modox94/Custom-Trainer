import { PortalProvider } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import clsx from "clsx";
import "normalize.css";
import { useSelector } from "react-redux";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import MainPage from "./components/MainPage/MainPage";
import ManualMode from "./components/ManualMode/ManualMode";
import Navigation from "./components/Navigation/Navigation";
import EditorMenu from "./components/ProgramEditor/EditorMenu";
import ProgramEditor from "./components/ProgramEditor/ProgramEditor";
import ProgramMode from "./components/ProgramMode/ProgramMode";
import SelectProgram from "./components/SelectProgram/SelectProgram";
import Advanced from "./components/Settings/Advanced";
import Interface from "./components/Settings/Interface";
import Performance from "./components/Settings/Performance";
import Peripheral from "./components/Settings/Peripheral";
import Settings from "./components/Settings/Settings";
import Translate from "./components/Settings/Translate";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "./constants/pathConst";
import { PE_MODE } from "./constants/programEditorConst";
import { SP_MODE } from "./constants/selectProgramConst";
import { getFooterStatus } from "./selectors/environmentSelectors";

const OutletProvider = () => <Outlet />;

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;

const App = () => {
  const footerStatus = useSelector(getFooterStatus);

  return (
    <PortalProvider>
      <MemoryRouter>
        <div
          className={clsx("app", {
            withHeader: !footerStatus,
            withHeaderAndFooter: footerStatus,
          })}
        >
          <Navigation />

          <Routes>
            <Route path={PAGES_PATHS[MAIN]} element={<MainPage />} />
            <Route path={PAGES_PATHS[MANUAL_MODE]} element={<ManualMode />} />

            <Route path={PAGES_PATHS[SETTINGS]} element={<OutletProvider />}>
              <Route path={SUB_PATHS.ROOT} element={<Settings />} />
              <Route
                path={SUB_PATHS[SETTINGS].TRANSLATE}
                element={<Translate />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].INTERFACE}
                element={<Interface />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].PERIPHERAL}
                element={<Peripheral />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].PERFORMANCE}
                element={<Performance />}
              />
              <Route
                path={SUB_PATHS[SETTINGS].ADVANCED}
                element={<Advanced />}
              />
            </Route>

            <Route
              path={PAGES_PATHS[SELECT_PROGRAM]}
              element={<OutletProvider />}
            >
              <Route
                path={SUB_PATHS.ROOT}
                element={<SelectProgram mode={SP_MODE.SELECT} />}
              />
              <Route
                path={`:${SUB_PATHS.FILENAME}`}
                element={<ProgramMode />}
              />
            </Route>
            <Route
              path={PAGES_PATHS[PROGRAM_EDITOR]}
              element={<OutletProvider />}
            >
              <Route path={SUB_PATHS.ROOT} element={<EditorMenu />} />
              <Route
                path={SUB_PATHS[PROGRAM_EDITOR].NEW}
                element={<ProgramEditor mode={PE_MODE.NEW} />}
              />
              <Route
                path={SUB_PATHS[PROGRAM_EDITOR].EDIT}
                element={<OutletProvider />}
              >
                <Route
                  path={SUB_PATHS.ROOT}
                  element={<SelectProgram mode={SP_MODE.EDIT} />}
                />
                <Route
                  path={`:${SUB_PATHS.FILENAME}`}
                  element={<ProgramEditor mode={PE_MODE.EDIT} />}
                />
              </Route>
              <Route
                path={SUB_PATHS[PROGRAM_EDITOR].COPY}
                element={<OutletProvider />}
              >
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

          <Footer />
        </div>
      </MemoryRouter>
    </PortalProvider>
  );
};

export default App;
