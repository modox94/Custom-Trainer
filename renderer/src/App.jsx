import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "normalize.css";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import ManualMode from "./components/ManualMode/ManualMode";
import Navigation from "./components/Navigation/Navigation";
import ProgramMode from "./components/ProgramMode/ProgramMode";
import SelectProgram from "./components/SelectProgram/SelectProgram";
import Settings from "./components/Settings/Settings";
import { PAGES, PAGES_PATHS } from "./constants/pathConst";

const { MAIN, MANUAL_MODE, SETTINGS, SELECT_PROGRAM } = PAGES;

const App = () => {
  return (
    <MemoryRouter>
      <div className="root">
        <Navigation />

        <Routes>
          <Route path={PAGES_PATHS[MAIN]} element={<MainPage />} />
          <Route path={PAGES_PATHS[MANUAL_MODE]} element={<ManualMode />} />
          <Route path={PAGES_PATHS[SETTINGS]} element={<Settings />} />
          <Route
            path={PAGES_PATHS[SELECT_PROGRAM] + "/:programTitle"}
            element={<ProgramMode />}
          />
          <Route
            path={PAGES_PATHS[SELECT_PROGRAM]}
            element={<SelectProgram />}
          />
        </Routes>
      </div>
    </MemoryRouter>
  );
};

export default App;
