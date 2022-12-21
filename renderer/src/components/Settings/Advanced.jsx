import { Alignment, Switch } from "@blueprintjs/core";
import React from "react";
import { Container, Item } from "../SquareGrid/SquareGrid";

const Advanced = props => {
  return (
    <>
      <Container>
        <Item>
          <Switch
            large
            alignIndicator={Alignment.RIGHT}
            // innerLabel="innerLabel"
            // innerLabelChecked="innerLabelChecked"
          >
            test
          </Switch>
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

export default Advanced;
