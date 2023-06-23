import {
  Button,
  Callout,
  Divider,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get } from "lodash";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { checkProgramTitle, useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { PE_MODE } from "../../constants/programEditorConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getProgramTitle } from "../../selectors/environmentSelectors";
import { setProgramTitle } from "../../slices/environmentSlice";
import { getTranslationPath } from "../../utils/translationUtils";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./EnterTitle.module.css";

const { PROGRAM_EDITOR } = PAGES;
const { COMMON_TRK, PROGRAM_EDITOR_TRK } = TRANSLATION_ROOT_KEYS;
const { next } = TRANSLATION_KEYS[COMMON_TRK];
const { programTitleError, typeProgramTitle } =
  TRANSLATION_KEYS[PROGRAM_EDITOR_TRK];

const getTPath = (...args) => getTranslationPath(PROGRAM_EDITOR_TRK, ...args);

const DISPLAY = {
  "{numbers}": "123",
  "{backspace}": "⌫",
  "{lock}": "caps",
  "{shift}": "⇧",
  "{abc}": "abc",
  "{space}": "⎵",
};

const LAYOUT_NAME = {
  default: "default",
  lock: "lock",
  shift: "shift",
  numbers: "numbers",
};

const LAYOUT = {
  [LAYOUT_NAME.default]: [
    "{numbers} q w e r t y u i o p {backspace}",
    "{lock} a s d f g h j k l",
    "{shift} z x c v b n m",
    "{space}",
  ],
  [LAYOUT_NAME.lock]: [
    "{numbers} Q W E R T Y U I O P {backspace}",
    "{lock} A S D F G H J K L",
    "{shift} Z X C V B N M",
    "{space}",
  ],
  [LAYOUT_NAME.shift]: [
    "{numbers} Q W E R T Y U I O P {backspace}",
    "{lock} A S D F G H J K L",
    "{shift} Z X C V B N M",
    "{space}",
  ],
  [LAYOUT_NAME.numbers]: [
    "{abc} 1 2 3 {backspace}",
    "( 4 5 6 #",
    ") 7 8 9 {space}",
    "_ , 0 . -",
  ],
};

const EnterTitle = props => {
  const { mode } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyboardRef = useRef();
  const title = useSelector(getProgramTitle);
  const [layout, setLayout] = useState(LAYOUT_NAME.default);
  const filenameEditMatch = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}/:${SUB_PATHS.FILENAME}`,
  );
  const filenameCopyMatch = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/${SUB_PATHS[PROGRAM_EDITOR].TITLE}/:${SUB_PATHS.FILENAME}`,
  );
  const filename = get(filenameEditMatch || filenameCopyMatch, [
    "params",
    SUB_PATHS.FILENAME,
  ]);
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      skip: [PE_MODE.NEW].includes(mode),
      refetchOnMountOrArgChange: true,
    }) || {};
  const programTitle = get(programs, [filename, "title"], "");
  const [input, setInput] = useState(
    mode === PE_MODE.EDIT ? title || programTitle : title,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    switch (mode) {
      case PE_MODE.NEW:
      case PE_MODE.COPY:
        keyboardRef.current?.setInput(title);
        break;

      case PE_MODE.EDIT:
        keyboardRef.current?.setInput(title || programTitle);
        break;

      default:
        break;
    }
  }, [mode, programTitle, title]);

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
    switch (button) {
      case "{shift}": {
        const newLayoutName =
          layout === LAYOUT_NAME.default
            ? LAYOUT_NAME.shift
            : LAYOUT_NAME.default;
        setLayout(newLayoutName);
        break;
      }

      case "{lock}": {
        const newLayoutName =
          layout === LAYOUT_NAME.default
            ? LAYOUT_NAME.lock
            : LAYOUT_NAME.default;
        setLayout(newLayoutName);
        break;
      }

      case "{numbers}":
        setLayout(LAYOUT_NAME.numbers);
        break;

      case "{abc}":
        setLayout(LAYOUT_NAME.default);
        break;

      default:
        if (layout === LAYOUT_NAME.shift) {
          setLayout(LAYOUT_NAME.default);
        }
        break;
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

  const onNextStep = useCallback(() => {
    const inputTrimed = input.trim();

    if (inputTrimed && !error) {
      dispatch(setProgramTitle(inputTrimed));

      switch (mode) {
        case PE_MODE.NEW:
          navigate(
            `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].NEW}/${SUB_PATHS[PROGRAM_EDITOR].EDITOR}`,
          );
          break;

        case PE_MODE.EDIT:
          navigate(
            `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/${SUB_PATHS[PROGRAM_EDITOR].EDITOR}/${filename}`,
          );
          break;

        case PE_MODE.COPY:
          navigate(
            `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/${SUB_PATHS[PROGRAM_EDITOR].EDITOR}/${filename}`,
          );
          break;

        default:
          break;
      }
    }
  }, [dispatch, error, filename, input, mode, navigate]);
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
                  (error && Intent.DANGER) ||
                  (input.trim().length > 0 ? Intent.SUCCESS : Intent.NONE)
                }
                text={t(getTranslationPath(COMMON_TRK, next))}
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
              <Callout icon={IconNames.ERROR} intent={Intent.DANGER}>
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
};
EnterTitle.defaultProps = {
  mode: PE_MODE.NEW,
};

export default EnterTitle;
