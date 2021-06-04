import React, { useRef } from "react";
import { CSSProperties } from "styled-components";
import { TPlaceholder, TObject, IVariableColumn } from "../interfaces";
import Placeholder from "../Placeholder";
import Cell from "../Cell";

interface IProps {
  style: CSSProperties;
  isScrolling: boolean;
  placeholder?: TPlaceholder;
  record: TObject;
  columnIndex: number;
  rowIndex: number;
  column: IVariableColumn;
}

const Component: React.FC<IProps> = ({ isScrolling, style, placeholder, columnIndex, rowIndex, record, column }) => {
  const showPlaceholder = isScrolling && placeholder;

  const isRendered = useRef(false);

  const renderCell = () => <Cell columnIndex={columnIndex} rowIndex={rowIndex} style={style} column={column} record={record} />;

  if (isRendered.current) {
    return renderCell();
  } else {
    if (showPlaceholder) {
      return (
        <Placeholder
          style={style}
          placeholder={placeholder}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          record={record}
          column={column}
        />
      );
    } else {
      isRendered.current = true;
      return renderCell();
    }
  }
};

export default Component;
