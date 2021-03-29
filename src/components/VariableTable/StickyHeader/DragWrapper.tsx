import React from "react";
import useDrag from "./hooks/useDrag";
import { ICellProps } from "./interfaces";

const Component = ({ style, children, column,onReposition }: ICellProps) => {
  const { dataIndex } = column;

  const { onDragStart, onDragEnd, onDragEnter, onDragLeave, onDragOver, onDrop } = useDrag({ column, dataIndex, onReposition });

  return (
    <div
      data-dataindex={dataIndex}
      style={style}
      draggable="true"
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "row", transition: "transform 500ms" }}>{children}</div>
    </div>
  );
};

export default Component;
