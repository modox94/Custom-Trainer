import { PortalProvider } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "normalize.css";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import ManualMode from "./components/ManualMode/ManualMode";
import Navigation from "./components/Navigation/Navigation";
import EditorMenu from "./components/ProgramEditor/EditorMenu";
import NewProgram from "./components/ProgramEditor/NewProgram";
import ProgramMode from "./components/ProgramMode/ProgramMode";
import SelectProgram from "./components/SelectProgram/SelectProgram";
import Settings from "./components/Settings/Settings";
import { PAGES, PAGES_PATHS } from "./constants/pathConst";

const OutletProvider = () => <Outlet />;

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;

const App = () => {
  return (
    <PortalProvider>
      <MemoryRouter>
        <div className="app">
          <Navigation />

          <Routes>
            <Route path={PAGES_PATHS[MAIN]} element={<MainPage />} />
            <Route path={PAGES_PATHS[MANUAL_MODE]} element={<ManualMode />} />
            <Route path={PAGES_PATHS[SETTINGS]} element={<Settings />} />

            <Route
              path={PAGES_PATHS[SELECT_PROGRAM]}
              element={<OutletProvider />}
            >
              <Route path="" element={<SelectProgram />} />
              <Route path=":programTitle" element={<ProgramMode />} />
            </Route>
            <Route
              path={PAGES_PATHS[PROGRAM_EDITOR]}
              element={<OutletProvider />}
            >
              <Route path="" element={<EditorMenu />} />
              <Route path="new" element={<NewProgram />} />
            </Route>
          </Routes>
        </div>
      </MemoryRouter>
    </PortalProvider>
  );
};

export default App;
