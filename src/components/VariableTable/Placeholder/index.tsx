import React from "react";
import { CSSProperties } from "styled-components";
import { TPlaceholder, TObject, IVariableColumn } from "../interfaces";

interface IPlaceholderProps {
  style: CSSProperties;
  placeholder: TPlaceholder;
  columnIndex: number;
  rowIndex: number;
  record: TObject;
  column: IVariableColumn;
}

function Component({ style, placeholder, columnIndex, rowIndex, record, column }: IPlaceholderProps) {
  const { dataIndex } = column,
    value = record[dataIndex];
  return (
    <div style={style}>
      {typeof placeholder === "function" ? placeholder({ columnIndex, rowIndex, dataIndex, record, column, value }) : placeholder}
    </div>
  );
}

export default Component;
