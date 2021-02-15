/*
 * @Author: sun.t
 * @Date: 2021-01-16 11:37:02
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-01-17 00:32:07
 */
import React from "react";
import { IStickyColumnsProps } from "./interfaces";
import styled from "styled-components";
import Cell from "./Cell";

const Container = styled.div`
  position: sticky;
  left: 0;
  z-index: 2;
  width: min-content;
`;

const Row = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
`;

/**
 * 固定列组件
 * @param param0
 */
const StickyColumns = ({
  rows,
  stickyHeight,
  stickyWidth,
  stickyColumnsCount,
  columnWidthCache,
  rawData,
  columns,
  className,
  isScrolling,
  placeholder,
  useIsScrolling = false,
  groupRowRender,
  childrenRawName,
}: IStickyColumnsProps) => {
  const childrensPlaceholder = new Array(stickyColumnsCount).fill(0);

  return (
    <Container className={className} style={{ top: stickyHeight, width: stickyWidth, height: `calc(100% - ${stickyHeight}px)` }}>
      {rows.map(({ rowIndex, ...style }) => {
        const row = rawData[rowIndex];

        // 渲染分组行
        if (row[childrenRawName]) {
          return (
            <Row key={rowIndex} style={{ ...style, width: stickyWidth }}>
              {groupRowRender ? groupRowRender({ columnIndex: 0, data: row, width: stickyWidth }) : null}
            </Row>
          );
        }

        return (
          <Row style={style} key={rowIndex}>
            {childrensPlaceholder.map((ph: any, index: number) => {
              const width = columnWidthCache[index];
              return (
                <Cell
                  key={index}
                  style={{ width }}
                  columnIndex={index}
                  rowIndex={rowIndex}
                  column={columns[index]}
                  data={row}
                  showPlaceholder={isScrolling && useIsScrolling}
                  placeholder={placeholder}
                />
              );
            })}
          </Row>
        );
      })}
    </Container>
  );
};

export default StickyColumns;
