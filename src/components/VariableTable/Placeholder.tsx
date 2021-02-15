import React from "react";
import { IPlaceholderProps } from "./interfaces";

function Component({ style, placeholder, columnIndex, rowIndex }: IPlaceholderProps) {
  return <div style={style}>{typeof placeholder === "function" ? placeholder({ columnIndex, rowIndex }) : placeholder}</div>;
}

export default Component;
