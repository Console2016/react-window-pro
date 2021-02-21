import React, { CSSProperties } from "react";
import { IRawItem, TPlaceholder } from "./interfaces";

interface IPlaceholderProps {
  style: CSSProperties;
  placeholder: TPlaceholder;
  columnIndex: number;
  rowIndex: number;
  data: IRawItem;
}

function Component({ style, placeholder, columnIndex, rowIndex, data }: IPlaceholderProps) {
  return <div style={style}>{typeof placeholder === "function" ? placeholder({ columnIndex, rowIndex, data }) : placeholder}</div>;
}

export default Component;
