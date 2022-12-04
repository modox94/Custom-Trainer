import { Button, InputGroup } from "@blueprintjs/core";
import { get, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./EnterTitle.module.css";

const DISPLAY = {
  "{numbers}": "123",
  "{backspace}": "⌫",
  "{shift}": "⇧",
  "{abc}": "ABC",
};

const LAYOUT_NAME = {
  default: "default",
  shift: "shift",
  numbers: "numbers",
};

const LAYOUT = {
  [LAYOUT_NAME.default]: [
    "q w e r t y u i o p",
    "a s d f g h j k l",
    "{shift} z x c v b n m {backspace}",
    "{numbers} {space}",
  ],
  [LAYOUT_NAME.shift]: [
    "Q W E R T Y U I O P",
    "A S D F G H J K L",
    "{shift} Z X C V B N M {backspace}",
    "{numbers} {space}",
  ],
  [LAYOUT_NAME.numbers]: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
};

const EnterTitle = props => {
  const { setTitle } = props;
  const keyboardRef = useRef();
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState(LAYOUT_NAME.default);

  const handleShift = () => {
    const newLayoutName =
      layout === LAYOUT_NAME.default ? LAYOUT_NAME.shift : LAYOUT_NAME.default;
    setLayout(newLayoutName);
  };

  const handleNum = () => setLayout(LAYOUT_NAME.numbers);

  const handleDefault = () => setLayout(LAYOUT_NAME.default);

  const onKeyBoardChange = value => {
    setInput(value);
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

  const onInputChange = event => {
    const value = get(event, ["target", "value"]);
    setInput(value);

    keyboardRef.current?.setInput(value);
  };

  const onNextStep = () => {
    setTitle(input.trim());
  };

  return (
    <>
      <Container className={styles.inputContainer}>
        <Item className={styles.mediumPadding}>
          <InputGroup
            large
            placeholder="Введите название программы..." // TODO
            rightElement={
              <Button
                large
                rightIcon="arrow-right"
                intent={input.trim().length > 0 ? "success" : "none"}
                text="Next step" // TODO
                disabled={input.trim().length === 0}
                onClick={onNextStep}
              />
            }
            type="text"
            value={input}
            onChange={onInputChange}
          />
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
  setTitle: PropTypes.func,
};
EnterTitle.defaultProps = {
  setTitle: noop,
};

export default EnterTitle;
