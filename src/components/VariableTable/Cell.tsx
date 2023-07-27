import React, { CSSProperties, memo } from "react";
import styled from "styled-components";
import { areEqual } from "react-window";
import { IVariableColumn, TObject } from "./interfaces";

interface IProps {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
  column: IVariableColumn;
  record: TObject;
}

const Cell = styled.div``;

const Component = ({ columnIndex, rowIndex, style, column, record }: IProps) => {
  if (!column) return null;
  const { render, dataIndex } = column,
    value = record[dataIndex];

  return (
    <Cell style={style}>
      {render
        ? render({
            columnIndex,
            rowIndex,
            dataIndex,
            value,
            record,
            column,
          })
        : value}
    </Cell>
  );
};

export default memo(Component, areEqual);

// export default memo(Component, (prevProps, nextProps) => {
//   const { showPlaceholder: prevShowPlaceholder, placeholder: prevPlaceholder, ...prevRest } = prevProps;
//   const { showPlaceholder: nextShowPlaceholder, placeholder: nextPlaceholder, ...nextRest } = nextProps;

//   return areEqual(prevRest, nextRest);
// });
