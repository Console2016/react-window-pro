/*
 * @Author: sun.t
 * @Date: 2021-03-26 15:48:19
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-03-27 16:34:16
 */
import React, { useMemo } from "react";
import styled, { CSSProperties } from "styled-components";
import useDragOffset from "./hooks/useDragOffset";

const Resizer = styled.div`
  width: 4px;

  &:hover {
    border-right: 1px dashed rgba(191, 191, 191);
  }
`;

const Component = ({
  style,
  onDragEnd,
}: {
  style: CSSProperties;
  onDragEnd: ({ translation }: { translation: { x: number; y: number } }) => void;
}) => {
  const dragStyle: CSSProperties = useMemo(() => ({ ...style, cursor: "e-resize", position: "absolute", right: 0 }), [style]);

  const { styles, handleMouseDown } = useDragOffset({ direction: "horizontal", style: dragStyle, onDragEnd });

  return (
    <Resizer
      style={styles}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.preventDefault(); //取消dragover的默认行为
        e.stopPropagation();
      }}
    />
  );
};

export default Component;
