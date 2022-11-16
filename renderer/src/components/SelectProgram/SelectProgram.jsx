import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProgramsListQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import SquareGrid from "../SquareGrid/SquareGrid";

const { SELECT_PROGRAM } = PAGES;

const SelectProgram = props => {
  const navigate = useNavigate();
  const { data: programs } = useGetProgramsListQuery() || {};

  const items = useMemo(() => {
    return (programs || []).map(programTitle => ({
      title: programTitle,
      onClick: () => navigate(`${PAGES_PATHS[SELECT_PROGRAM]}/${programTitle}`),
    }));
  }, [navigate, programs]);

  return <SquareGrid columns={3} items={items} />;
};

export default SelectProgram;
