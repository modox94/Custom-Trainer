import { Button, Callout, Divider, InputGroup } from "@blueprintjs/core";
import { get, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatch } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { checkProgramTitle, useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { NP_MODE } from "../../constants/TODOconst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./EnterTitle.module.css";

const { PROGRAM_EDITOR } = PAGES;
const { COMMON, PROGRAM_EDITOR: PE_TRK } = TRANSLATION_ROOT_KEYS;
const { next } = TRANSLATION_KEYS[COMMON];
const { programTitleError, typeProgramTitle } = TRANSLATION_KEYS[PE_TRK];

const getTPath = (...args) => getTranslationPath(PE_TRK, ...args);

const DISPLAY = {
  "{numbers}": "123",
  "{backspace}": "⌫",
  "{shift}": "⇧",
  "{abc}": "ABC",
  "{space}": "⎵",
};

const LAYOUT_NAME = {
  default: "default",
  shift: "shift",
  numbers: "numbers",
};

const LAYOUT = {
  [LAYOUT_NAME.default]: [
    "q w e r t y u i o p {backspace}",
    "a s d f g h j k l",
    "{shift} z x c v b n m {numbers}",
    "{space}",
  ],
  [LAYOUT_NAME.shift]: [
    "Q W E R T Y U I O P {backspace}",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {numbers}",
    "{space}",
  ],
  [LAYOUT_NAME.numbers]: [
    "_ 1 2 3 -",
    "( 4 5 6 #",
    ") 7 8 9 {space}",
    "{abc} , 0 . {backspace}",
  ],
};

const EnterTitle = props => {
  const { mode, setTitle } = props;
  const { t } = useTranslation();
  const keyboardRef = useRef();
  const [layout, setLayout] = useState(LAYOUT_NAME.default);
  const filenameMatch = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/:${SUB_PATHS.FILENAME}`,
  );
  const filename = get(filenameMatch, ["params", SUB_PATHS.FILENAME]);
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      skip: mode !== NP_MODE.EDIT,
      refetchOnMountOrArgChange: true,
    }) || {};
  const programTitle = get(programs, [filename, "title"], "");
  const [input, setInput] = useState(programTitle);
  const [error, setError] = useState("");

  const handleShift = () => {
    const newLayoutName =
      layout === LAYOUT_NAME.default ? LAYOUT_NAME.shift : LAYOUT_NAME.default;
    setLayout(newLayoutName);
  };

  const handleNum = () => setLayout(LAYOUT_NAME.numbers);

  const handleDefault = () => setLayout(LAYOUT_NAME.default);

  const checkTitle = useCallback(
    async value => {
      const valueTrimed = value.trim();

      const isAvailableTitle =
        (valueTrimed === programTitle && true) ||
        (await checkProgramTitle(valueTrimed));

      if (valueTrimed && !isAvailableTitle && !error) {
        setError(t(getTPath(programTitleError)));
      } else if (!valueTrimed || (isAvailableTitle && error)) {
        setError("");
      }
    },
    [error, programTitle, t],
  );

  const onKeyBoardChange = value => {
    setInput(value);
    checkTitle(value);
  };

  const onKeyBoardKeyPress = button => {
    if (button === "{shift}" || button === "{lock}") {
      handleShift();
    }

    if (button === "{numbers}") {
      handleNum();
    }

    if (button === "{abc}") {
      handleDefault();
    }
  };

  const onInputChange = useCallback(
    event => {
      const value = get(event, ["target", "value"]);
      setInput(value);
      keyboardRef.current?.setInput(value);
      checkTitle(value);
    },
    [checkTitle],
  );

  const onNextStep = () => {
    const inputTrimed = input.trim();

    if (inputTrimed && !error) {
      setTitle(inputTrimed);
    }
  };

  return (
    <>
      <Container className={styles.inputContainer}>
        <Item className={styles.mediumPadding}>
          <InputGroup
            large
            placeholder={t(getTPath(typeProgramTitle))}
            rightElement={
              <Button
                large
                rightIcon="arrow-right"
                intent={
                  (error && "danger") ||
                  (input.trim().length > 0 ? "success" : "none")
                }
                text={t(getTranslationPath(COMMON, next))}
                disabled={error || input.trim().length === 0}
                onClick={onNextStep}
              />
            }
            type="text"
            value={input}
            onChange={onInputChange}
          />

          {error && (
            <>
              <Divider />
              <Callout icon="error" intent="danger">
                {error}
              </Callout>
            </>
          )}
        </Item>
      </Container>

      <Keyboard
        mergeDisplay
        keyboardRef={ref => (keyboardRef.current = ref)}
        layoutName={layout}
        layout={LAYOUT}
        display={DISPLAY}
        onChange={onKeyBoardChange}
        onKeyPress={onKeyBoardKeyPress}
      />
    </>
  );
};

EnterTitle.propTypes = {
  mode: PropTypes.string,
  setTitle: PropTypes.func,
};
EnterTitle.defaultProps = {
  mode: NP_MODE.NEW,
  setTitle: noop,
};

export default EnterTitle;
