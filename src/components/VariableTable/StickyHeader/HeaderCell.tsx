/*
 * @Author: sun.t
 * @Date: 2021-03-27 17:37:50
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-03-27 21:50:29
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
  onSort: (dataIndex: string, order: "ascend" | "descend" | undefined, column: IVariableColumn) => void;
  onResize: (dataIndex: string, width: number, column: IVariableColumn) => void;
  onReposition: (from: string, to: string, position: "front" | "back") => void;
}

const Cell = styled.div`
  display: flex;
  flexdirection: row;
  position: absolute;
`;

// 缓存包装
const Component = memo(({ tableHeight, style, column, dataIndex, onSort, onResize, onReposition }: IMemoCellProp) => {
  const { title, sorter, sortOrder, resizer, reposition } = column;

  const child = typeof title === "function" ? title({ dataIndex, column }) : title || "";

  const _style: CSSProperties = {
    position: "absolute",
    ...style,
  };

  if (!reposition) {
    _style.display = "flex";
    _style.flexDirection = "row";
  }

  const Wrapper = reposition ? DragWrapper : ({ style, children }: ICellProps) => <div style={style}>{children}</div>;

  return (
    <Wrapper style={_style} column={column} onReposition={onReposition}>
      {child}

      {sorter ? (
        <Sort sortOrder={sortOrder} onSort={(_sortOrder) => onSort(dataIndex, sortOrder === _sortOrder ? undefined : _sortOrder, column)} />
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
}, areEqual);

export default Component;
