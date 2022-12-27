import { Button, Icon, Intent } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import clsx from "clsx";
import { get, noop } from "lodash";
import { Duration } from "luxon";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMatch, useNavigate } from "react-router-dom";
import {
  editProgram,
  saveNewProgram,
  useGetProgramsQuery,
} from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { DEFAULT_STEPS, PE_MODE } from "../../constants/programEditorConst";
import {
  MAX_RES_LEVEL,
  MAX_RPM_LEVEL,
  RES_STEP,
  RPM_STEP,
} from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import BarChart from "../BarChart/BarChart";
import { DumbbellIcon, GaugeHighIcon } from "../Icons";
import { Container, Item } from "../SquareGrid/SquareGrid";
import EnterTitle from "./EnterTitle";
import styles from "./ProgramEditor.module.css";

const { MAIN, PROGRAM_EDITOR } = PAGES;
const { COMMON } = TRANSLATION_ROOT_KEYS;
const { add, deleteTKey, save } = TRANSLATION_KEYS[COMMON];

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const ProgramEditor = props => {
  const { mode } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const filenameEditMatch = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].EDIT}/:${SUB_PATHS.FILENAME}`,
  );
  const filenameCopyMatch = useMatch(
    `${PAGES_PATHS[PROGRAM_EDITOR]}/${SUB_PATHS[PROGRAM_EDITOR].COPY}/:${SUB_PATHS.FILENAME}`,
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
  const programSteps = get(programs, [filename, "steps"], DEFAULT_STEPS);
  const [steps, setSteps] = useState(programSteps);
  const { resistanceLevel, targetRpm } = steps[currentStep];

  const onSaveProgram = () => {
    switch (mode) {
      case PE_MODE.NEW:
      case PE_MODE.COPY:
        saveNewProgram({ title, maxResistanceLevel: MAX_RES_LEVEL, steps });
        navigate(PAGES_PATHS[MAIN]);
        break;

      case PE_MODE.EDIT:
        editProgram(filename, {
          title,
          maxResistanceLevel: MAX_RES_LEVEL,
          steps,
        });
        navigate(PAGES_PATHS[MAIN]);
        break;

      default:
        break;
    }
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
      let newCurrentStep = currentStep;
      if (newCurrentStep > newSteps.length - 1) {
        newCurrentStep -= 1;
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
    return <EnterTitle mode={mode} setTitle={setTitle} />;
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
          <GaugeHighIcon className={styles.icon50} />
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
          <DumbbellIcon className={styles.icon50} />
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
          setStep={setCurrentStep}
        />

        <Item className={clsx(styles.tinyPadding, styles.tripleButtonItem)}>
          <Button
            large
            intent={Intent.PRIMARY}
            icon={IconNames.PLUS}
            text={t(getTPath(add))}
            onClick={onAddStep}
          />
          <Button
            large
            intent={Intent.DANGER}
            icon={IconNames.TRASH}
            text={t(getTPath(deleteTKey))}
            disabled={steps.length <= 1}
            onClick={onDeleteStep}
          />
          <Button
            large
            intent={Intent.SUCCESS}
            icon={IconNames.FLOPPY_DISK}
            text={t(getTPath(save))}
            onClick={onSaveProgram}
          />
        </Item>
      </Container>
    </>
  );
};

ProgramEditor.propTypes = {
  mode: PropTypes.string,
};
ProgramEditor.defaultProps = {
  mode: PE_MODE.NEW,
};

export default ProgramEditor;
