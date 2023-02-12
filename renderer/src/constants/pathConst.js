export const PAGES = {
  MAIN: "MAIN",
  MANUAL_MODE: "MANUAL_MODE",
  SETTINGS: "SETTINGS",
  SELECT_PROGRAM: "SELECT_PROGRAM",
  PROGRAM_EDITOR: "PROGRAM_EDITOR",
};

export const PAGES_PATHS = {
  [PAGES.MAIN]: "/",
  [PAGES.MANUAL_MODE]: "/manual_mode",
  [PAGES.SETTINGS]: "/settings",
  [PAGES.SELECT_PROGRAM]: "/select_program",
  [PAGES.PROGRAM_EDITOR]: "/program_editor",
};

export const SUB_PATHS = {
  FILENAME: "filename",
  ROOT: "",
  [PAGES.PROGRAM_EDITOR]: {
    NEW: "new",
    EDIT: "edit",
    COPY: "copy",
    DELETE: "delete",
  },
  [PAGES.SETTINGS]: {
    TRANSLATE: "translate",
    INTERFACE: "interface",
    PERIPHERAL: "peripheral",
    PERFORMANCE: "performance",
    ADVANCED: "advanced",
    MOTOR: "motor",
    RPM: "rpm",
    HEARTBEAT: "heartbeat",
  },
};
