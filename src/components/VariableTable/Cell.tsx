import React, { CSSProperties, memo } from "react";
import styled from "styled-components";
import { areEqual } from "react-window";
import Placeholder from "./Placeholder";
import { IVariableColumn, TObject, TPlaceholder } from "./interfaces";

interface IProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  column: IVariableColumn;
  data: TObject;
  showPlaceholder: boolean;
  placeholder: TPlaceholder;
}

const Cell = styled.div``;

const Component = ({ columnIndex, rowIndex, style, column, data, showPlaceholder, placeholder }: IProps) => {
  const { render, dataIndex } = column,
    value = data[dataIndex];

  if (showPlaceholder) {
    return <Placeholder style={style} placeholder={placeholder} columnIndex={columnIndex} rowIndex={rowIndex} />;
  }

  return (
    <Cell style={style}>
      {render
        ? render({
            columnIndex,
            rowIndex,
            dataIndex,
            value,
            record: data,
            column
          })
        : value}
    </Cell>
  );
};

export default memo(Component, areEqual);
