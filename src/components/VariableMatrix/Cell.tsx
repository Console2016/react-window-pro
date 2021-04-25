import React, { CSSProperties, memo, useRef } from "react";
import styled from "styled-components";
import { areEqual } from "react-window";
import Placeholder from "./Placeholder";
import { IRawItem, TPlaceholder, TRowRender, TCellRender } from "./interfaces";

interface IProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  data: IRawItem;
  showPlaceholder: boolean;
  isGroupCell: boolean;
  placeholder: TPlaceholder;
  groupRowRender?: TRowRender;
  cellRender?: TCellRender;
}

const Cell = styled.div``;

const Component = ({
  columnIndex,
  rowIndex,
  style,
  data,
  showPlaceholder,
  isGroupCell,
  placeholder,
  groupRowRender,
  cellRender,
}: IProps) => {
  const { id } = data;
  const isRendered = useRef(false);

  const renderCell = () => {
    if (isGroupCell) {
      return <Cell style={style}>{groupRowRender ? groupRowRender({ rowIndex, columnIndex, data, style }) : id}</Cell>;
    }

    return (
      <Cell style={style}>
        {cellRender
          ? cellRender({
              columnIndex,
              rowIndex,
              data,
              style,
            })
          : id}
      </Cell>
    );
  };

  if (isRendered.current) {
    return renderCell();
  } else {
    if (showPlaceholder) {
      return <Placeholder style={style} placeholder={placeholder} columnIndex={columnIndex} rowIndex={rowIndex} data={data} />;
    } else {
      isRendered.current = true;
      return renderCell();
    }
  }
};

export default memo(Component, areEqual);
