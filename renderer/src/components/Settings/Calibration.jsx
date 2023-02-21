import React from "react";
import { Container, Item } from "../SquareGrid/SquareGrid";

const Calibration = () => {
  return (
    <>
      <Container>
        <Item>
          <h1>{"t(getTPath(performance))"}</h1>
        </Item>
        <Item></Item>
      </Container>
      <Container>
        <Item></Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Calibration;
