import React, { useState } from "react";
import BarChart from "../BarChart/BarChart";
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./NewProgram.module.css";

const DEFAULT_STEPS = [{ resistanceLevel: 6, targetRpm: 60 }];

const NewProgram = props => {
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [currentStep, setCurrentStep] = useState(0);

  const onPrevStep = () => {
    const newCurrentStep = currentStep - 1;

    if (newCurrentStep >= 0) {
      setCurrentStep(newCurrentStep);
    }
  };

  const onNextStep = () => {
    const stepsLength = steps.length;
    const newCurrentStep = currentStep + 1;

    if (newCurrentStep >= stepsLength) {
      const newSteps = [...steps, steps[stepsLength - 1]];
      setSteps(newSteps);
    }

    setCurrentStep(newCurrentStep);
  };

  return (
    <>
      <Container>
        <Item>
          <h1>TODO EDIT PROG</h1>
        </Item>
        <Item>
          <h1>TODO EDIT PROG</h1>
        </Item>
        <Item>
          <h1>TODO DELETE PROG</h1>
        </Item>
      </Container>

      <Container>
        <Item onClick={onPrevStep}>
          <h1>{"<"}</h1>
        </Item>
        <BarChart
          className={styles.barChart}
          steps={steps}
          currentStep={currentStep}
        />

        <Item onClick={onNextStep}>
          <h1>{">"}</h1>
        </Item>
      </Container>
    </>
  );
};

export default NewProgram;
