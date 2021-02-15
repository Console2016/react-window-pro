/*
 * @Author: sun.t
 * @Date: 2021-01-17 01:12:36
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-01-17 01:21:31
 */
import React from "react";
import styled, { css } from "styled-components";

const Sort = styled.div`
  position: absolute;
  right: 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

// // 活跃
// const activeMixin = css`
//   border-color: ${(props) => (props.type === "ASC" && props.isActive ? "white" : "black")};
// `;

// 降序
const SortDESC = styled.div`
  border-style: solid;
  border-width: 6px 6px 0 6px;
  border-color: white transparent transparent transparent;
  width: 0px;
  height: 0px;

  &:hover {
    border-color: red transparent transparent transparent;
    cursor: pointer;
  }
`;

// 升序
const SortASC = styled.div`
  border-style: solid;
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent white transparent;
  width: 0px;
  height: 0px;

  &:hover {
    border-color: transparent transparent red transparent;
    cursor: pointer;
  }

  ${(props) => (props.is ? "color: blue;" : "color: blue;")};
`;

interface IProps {
  sort?: "ASC" | "DESC" | "";
}

const Component = function ({ sort }: IProps) {
  return (
    <Sort>
      {/* <SortASC is={sort === "ASC"} type="ASC" />
      <SortDESC is={sort === "DESC"} type="DESC" /> */}
    </Sort>
  );
};

export default Component;
