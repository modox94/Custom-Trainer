import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { noop } from "lodash";
import { Duration } from "luxon";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveNewProgram } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import {
  DEFAULT_STEPS,
  MAX_RES_LEVEL,
  MAX_RPM_LEVEL,
  RES_STEP,
  RPM_STEP,
} from "../../constants/TODOconst";
import BarChart from "../BarChart/BarChart";
import { Container, Item } from "../SquareGrid/SquareGrid";
import EnterTitle from "./EnterTitle";
import styles from "./NewProgram.module.css";

const { MAIN } = PAGES;

const NewProgram = props => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const { resistanceLevel, targetRpm } = steps[currentStep];

  const onSaveProgram = () => {
    saveNewProgram({ title, maxResistanceLevel: 10, steps });
    navigate(PAGES_PATHS[MAIN]);
  };

  const onPrevStep = () => {
    const newCurrentStep = currentStep - 1;

    if (newCurrentStep >= 0) {
      setCurrentStep(newCurrentStep);
    }
  };

  const onNextStep = () => {
    const newCurrentStep = currentStep + 1;

    if (newCurrentStep === steps.length) {
      onAddStep();
    } else {
      setCurrentStep(newCurrentStep);
    }
  };

  const onAddStep = () => {
    const newSteps = [...steps];
    newSteps.splice(currentStep + 1, 0, steps[currentStep]);
    setSteps(newSteps);
    setCurrentStep(currentStep + 1);
  };

  const onDeleteStep = () => {
    if (steps.length > 1) {
      const newSteps = [...steps];
      newSteps.splice(currentStep, 1);
      let newCurrentStep = currentStep - 1;
      if (newCurrentStep < 0) {
        newCurrentStep = 0;
      }
      setCurrentStep(newCurrentStep);
      setSteps(newSteps);
    }
  };

  const programDuration = useMemo(() => {
    const dur = Duration.fromObject({ minutes: steps.length });

    if (steps.length > 60) {
      return dur.toFormat("hh:mm:ss");
    }

    return dur.toFormat("mm:ss");
  }, [steps.length]);

  const onResistanceUp = () => {
    const newResistance = resistanceLevel + RES_STEP;

    if (newResistance > MAX_RES_LEVEL) {
      return;
    }

    const newSteps = steps.map((step, idx) => {
      if (idx === currentStep) {
        return { ...step, resistanceLevel: newResistance };
      }
      return step;
    });

    setSteps(newSteps);
  };

  const onResistanceDown = () => {
    const newResistance = resistanceLevel - RES_STEP;

    if (newResistance < RES_STEP) {
      return;
    }

    const newSteps = steps.map((step, idx) => {
      if (idx === currentStep) {
        return { ...step, resistanceLevel: newResistance };
      }
      return step;
    });

    setSteps(newSteps);
  };

  const onRpmUp = () => {
    const newTargetRpm = targetRpm + RPM_STEP;

    if (newTargetRpm > MAX_RPM_LEVEL) {
      return;
    }

    const newSteps = steps.map((step, idx) => {
      if (idx === currentStep) {
        return { ...step, targetRpm: newTargetRpm };
      }
      return step;
    });

    setSteps(newSteps);
  };

  const onRpmDown = () => {
    const newTargetRpm = targetRpm - RPM_STEP;

    if (newTargetRpm < RPM_STEP) {
      return;
    }

    const newSteps = steps.map((step, idx) => {
      if (idx === currentStep) {
        return { ...step, targetRpm: newTargetRpm };
      }
      return step;
    });

    setSteps(newSteps);
  };

  if (!title) {
    return <EnterTitle setTitle={setTitle} />;
  }

  return (
    <>
      <Container>
        <Item className={styles.tinyPadding} onClick={noop}>
          <div className={styles.doubleButtonIconWrap} onClick={onRpmUp}>
            <Icon
              className={clsx(styles.doubleButtonIcon, {
                [styles.inActive]: targetRpm + RPM_STEP > MAX_RPM_LEVEL,
              })}
              icon={IconNames.CARET_UP}
            />
          </div>
          <div className={styles.doubleButtonIconWrap} onClick={onRpmDown}>
            <Icon
              className={clsx(styles.doubleButtonIcon, {
                [styles.inActive]: targetRpm - RPM_STEP < RPM_STEP,
              })}
              icon={IconNames.CARET_DOWN}
            />
          </div>
        </Item>
        <Item className={clsx(styles.tinyPadding, styles.flexColumn)}>
          <Icon className={styles.icon50} icon={IconNames.DASHBOARD} />
          <div className={styles.text}>
            <p>
              <b>{targetRpm}</b>
            </p>
          </div>
        </Item>

        <Item className={clsx(styles.tinyPadding, styles.flexColumn)}>
          <Icon className={styles.icon50} icon={IconNames.STOPWATCH} />
          <div className={styles.text}>
            <p>
              <b>{programDuration}</b>
            </p>
          </div>
        </Item>

        <Item className={clsx(styles.tinyPadding, styles.flexColumn)}>
          <Icon className={styles.icon50} icon={IconNames.MOUNTAIN} />
          <div className={styles.text}>
            <p>
              <b>{resistanceLevel}</b>
            </p>
          </div>
        </Item>
        <Item className={styles.tinyPadding} onClick={noop}>
          <div className={styles.doubleButtonIconWrap} onClick={onResistanceUp}>
            <Icon
              className={clsx(styles.doubleButtonIcon, {
                [styles.inActive]: resistanceLevel + RES_STEP > MAX_RES_LEVEL,
              })}
              icon={IconNames.CARET_UP}
            />
          </div>
          <div
            className={styles.doubleButtonIconWrap}
            onClick={onResistanceDown}
          >
            <Icon
              className={clsx(styles.doubleButtonIcon, {
                [styles.inActive]: resistanceLevel - RES_STEP < RES_STEP,
              })}
              icon={IconNames.CARET_DOWN}
            />
          </div>
        </Item>
      </Container>

      <Container>
        <Item className={styles.tinyPadding} onClick={noop}>
          <div className={styles.doubleButtonIconWrap} onClick={onNextStep}>
            <Icon
              className={styles.doubleButtonIcon}
              icon={
                currentStep >= steps.length - 1
                  ? IconNames.SMALL_PLUS
                  : IconNames.CARET_RIGHT
              }
            />
          </div>

          <div className={styles.doubleButtonIconWrap} onClick={onPrevStep}>
            <Icon
              className={clsx(styles.doubleButtonIcon, {
                [styles.inActive]: currentStep === 0,
              })}
              icon={IconNames.CARET_LEFT}
            />
          </div>
        </Item>

        <BarChart
          className={styles.barChart}
          steps={steps}
          currentStep={currentStep}
          isEditor
        />

        <Item className={clsx(styles.tinyPadding, styles.tripleButtonItem)}>
          <Button
            large
            intent="primary"
            icon="plus"
            text="Добавить" // TODO
            onClick={onAddStep}
          />
          <Button
            large
            intent="danger"
            icon="trash"
            text="Удалить" // TODO
            disabled={steps.length <= 1}
            onClick={onDeleteStep}
          />
          <Button
            large
            intent="success"
            icon="floppy-disk"
            text="Сохранить" // TODO
            onClick={onSaveProgram}
          />
        </Item>
      </Container>
    </>
  );
};

export default NewProgram;
