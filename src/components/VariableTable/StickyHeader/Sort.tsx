/*
 * @Author: sun.t
 * @Date: 2021-01-17 01:12:36
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-04-04 14:45:45
 */
import React from "react";
import styled from "styled-components";

const Sort = styled.div`
  position: absolute;
  right: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

// 降序
const SortDESC = styled.div`
  border-style: solid;
  border-width: 6px 6px 0 6px;
  width: 0px;
  height: 0px;

  // &:hover {
  //   border-color: #1890ff transparent transparent transparent;
  //   cursor: pointer;
  // }

  ${(props: { active: boolean; type: "ascend" | "descend" }) =>
    props.active
      ? "border-color: #1890ff transparent transparent transparent;"
      : "border-color: rgba(191, 191, 191) transparent transparent transparent;"};
`;

// 升序
const SortASC = styled.div`
  border-style: solid;
  border-width: 0 6px 6px 6px;
  width: 0px;
  height: 0px;

  // &:hover {
  //   border-color: transparent transparent #1890ff transparent;
  //   cursor: pointer;
  // }

  ${(props: { active: boolean; type: "ascend" | "descend" }) =>
    props.active
      ? "border-color: transparent transparent #1890ff transparent;"
      : "border-color: transparent transparent rgba(191, 191, 191) transparent;"};
`;

interface IProps {
  sortOrder?: "ascend" | "descend" | false;
  // onSort: (sort: "ascend" | "descend") => void;
}

const Component = function ({ sortOrder }: IProps) {
  return (
    <Sort>
      <SortASC active={sortOrder === "ascend"} type="ascend" />
      <SortDESC active={sortOrder === "descend"} type="descend" />
    </Sort>
  );
};

export default Component;
