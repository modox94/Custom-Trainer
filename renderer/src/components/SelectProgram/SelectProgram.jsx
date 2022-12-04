import { chunk } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ipcApi, { useGetProgramsListQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { Container, Item } from "../SquareGrid/SquareGrid";

const { SELECT_PROGRAM } = PAGES;

const SelectProgram = props => {
  const navigate = useNavigate();
  const { data: programs } = useGetProgramsListQuery() || {};
  const { refetch } = ipcApi.endpoints.getProgramsList.useQuerySubscription();

  useEffect(() => refetch(), [refetch]);

  const items = useMemo(() => {
    return chunk(
      (programs || []).map(([fileName, programTitle], idx) => ({
        key: fileName,
        onClick: () => navigate(`${PAGES_PATHS[SELECT_PROGRAM]}/${fileName}`),
        children: <h1>{programTitle}</h1>,
      })),
      3,
    );
  }, [navigate, programs]);

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

export default SelectProgram;
