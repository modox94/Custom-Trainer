import { chunk, get } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProgramsQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { SP_MODE } from "../../constants/TODOconst";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { SELECT_PROGRAM, PROGRAM_EDITOR } = PAGES;

const SelectProgram = props => {
  const { mode } = props;
  const navigate = useNavigate();
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    }) || {};

  const items = useMemo(() => {
    return chunk(
      (Object.keys(programs) || []).map((fileName, idx) => {
        let onClick;
        switch (mode) {
          case SP_MODE.SELECT:
            onClick = () =>
              navigate(`${PAGES_PATHS[SELECT_PROGRAM]}/${fileName}`);
            break;

          case SP_MODE.EDIT:
            onClick = () =>
              navigate(`${PAGES_PATHS[PROGRAM_EDITOR]}/edit/${fileName}`);
            break;

          case SP_MODE.DELETE:
            onClick = () => console.log("delete!!!");
            break;

          default:
            break;
        }

        return {
          key: fileName,
          onClick,
          children: <h1>{get(programs, [fileName, "title"], "")}</h1>,
        };
      }),
      3,
    );
  }, [mode, navigate, programs]);

  return items.map(row => (
    <Container key={row.reduce((acc, item) => acc + item.key, "")}>
      {row.map(item => {
        const { key, onClick, children } = item;
        return (
          <Item key={key} onClick={onClick}>
            {children}
          </Item>
        );
      })}
    </Container>
  ));
};

SelectProgram.propTypes = {
  mode: PropTypes.string,
};
SelectProgram.defaultProps = {
  mode: SP_MODE.SELECT,
};

export default SelectProgram;
