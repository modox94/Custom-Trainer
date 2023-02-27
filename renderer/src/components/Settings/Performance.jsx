import React from "react";
import { turnOnSPI } from "../../api/ipc";
import { Container, Item } from "../SquareGrid/SquareGrid";

const Performance = props => {
  // turnOnSPI
  // useGetBootQuery

  return (
    <>
      <Container>
        <Item></Item>
        <Item></Item>
      </Container>
      <Container>
        <Item></Item>
        <Item></Item>
      </Container>
    </>
  );
};

export default Performance;
