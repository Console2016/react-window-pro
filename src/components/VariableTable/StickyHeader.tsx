import React, { memo } from "react";
import styled, { CSSProperties } from "styled-components";
import { areEqual } from "react-window";
import { IStickyHeaderProps, IVariableColumn } from "./interfaces";

export const Container = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  z-index: 3;
`;

const Cell = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
`;

const StickyHeaders = styled.div`
  z-index: 3;
  position: sticky;
  left: 0;
  display: flex;
  flex-direction: row;
`;

const Headers = styled.div`
  position: absolute;
`;

// 缓存包装
const MemoCell = memo(({ style, column, dataIndex }: { style: CSSProperties; column: IVariableColumn; dataIndex: string }) => {
  const { title } = column;

  const child = typeof title === "function" ? title({ dataIndex, column }) : title || "";

  return (
    <Cell style={style} key={dataIndex}>
      {child}
    </Cell>
  );
}, areEqual);

/**
 * 固定表头组件
 * @param param0
 */
const StickyHeader = ({
  stickyHeight,
  stickyWidth,
  stickyHeaderColumns,
  headerColumns,
  columns,
  stickyClassName,
  className,
}: IStickyHeaderProps) => {
  const scrollableStyle = { left: stickyWidth };

  return (
    <Container>
      {/* 冻结列头 */}
      {stickyHeaderColumns.length ? (
        <StickyHeaders className={stickyClassName} style={{ height: stickyHeight, width: stickyWidth }}>
          {stickyHeaderColumns.map((style, index) => {
            const { dataIndex } = columns[index];
            return <MemoCell style={style} key={dataIndex} column={columns[index]} dataIndex={dataIndex} />;
          })}
        </StickyHeaders>
      ) : null}

      {/* 非冻结列头 */}
      <Headers className={className} style={scrollableStyle}>
        {headerColumns.map(({ columnIndex, ...style }) => {
          const { dataIndex } = columns[columnIndex];
          return <MemoCell style={style} key={dataIndex} column={columns[columnIndex]} dataIndex={dataIndex} />;
        })}
      </Headers>
    </Container>
  );
};

export default StickyHeader;
