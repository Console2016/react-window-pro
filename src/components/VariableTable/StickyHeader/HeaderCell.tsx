/*
 * @Author: sun.t
 * @Date: 2021-03-27 17:37:50
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-03-31 17:56:02
 */
import React, { CSSProperties, memo } from "react";
import { areEqual } from "react-window";
import Sort from "./Sort";
import Resizer from "./Resizer";
import DragWrapper from "./DragWrapper";
import { IVariableColumn } from "../interfaces";
import styled from "styled-components";
import { ICellProps } from "./interfaces";

interface ICellStyle extends CSSProperties {
  left: number;
  width: number;
}

interface IMemoCellProp {
  tableHeight: number;
  style: ICellStyle;
  column: IVariableColumn;
  dataIndex: string;
  isDraging: boolean;
  onSort: (dataIndex: string, order: "ascend" | "descend" | undefined, column: IVariableColumn) => void;
  onResize: (dataIndex: string, width: number, column: IVariableColumn) => void;
  onReposition: (from: string, to: string, position: "front" | "back") => void;
  toggleDragState: (isDraging: boolean) => void;
}

const Cell = styled.div`
  display: flex;
  flexdirection: row;
  position: absolute;
`;

// 缓存包装
const Component = memo(
  ({ tableHeight, style, column, dataIndex, isDraging, onSort, onResize, onReposition, toggleDragState }: IMemoCellProp) => {
    const { title, sorter, sortOrder, resizer, reposition } = column;

    const child = typeof title === "function" ? title({ dataIndex, column, isDraging }) : title || "";

    const _style: CSSProperties = {
      position: "absolute",
      ...style,
    };

    if (!reposition) {
      _style.display = "flex";
      _style.flexDirection = "row";
    }

    const Wrapper = reposition
      ? DragWrapper
      : ({ style, children, isDraging }: ICellProps) => {
          // 不可拖拽单元样式
          let dragingStyle: CSSProperties = {};
          if (isDraging) {
            dragingStyle.filter = "grayscale(80%)";
          }

          return <div style={{ ...style, ...dragingStyle }}>{children}</div>;
        };

    return (
      <Wrapper style={_style} column={column} onReposition={onReposition} toggleDragState={toggleDragState} isDraging={isDraging}>
        {child}

        {sorter ? (
          <Sort
            sortOrder={sortOrder}
            onSort={(_sortOrder) => onSort(dataIndex, sortOrder === _sortOrder ? undefined : _sortOrder, column)}
          />
        ) : null}

        {resizer ? (
          <Resizer
            style={{
              height: tableHeight,
            }}
            onDragEnd={({ translation: { x } }) => onResize(dataIndex, x, column)}
          />
        ) : null}
      </Wrapper>
    );
  },
  areEqual
);

export default Component;
