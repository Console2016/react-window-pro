import React, { useCallback, useState } from "react";
import styled from "styled-components";
import HeaderCell from "./HeaderCell";
import { IStickyHeaderProps } from "../interfaces";

export const Container = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  z-index: 3;
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

/**
 * 固定表头组件
 * @param param0
 */
const StickyHeader = ({
  tableHeight,
  stickyHeight,
  stickyWidth,
  stickyHeaderColumns,
  headerColumns,
  columns,
  stickyClassName,
  className,
  onChange,
}: IStickyHeaderProps) => {
  const scrollableStyle = { left: stickyWidth };

  const onSortCallback = useCallback(
    (dataIndex, order, column) => {
      const newColumns = [...columns],
        foundColumnIndex = newColumns.findIndex((col) => col.dataIndex === dataIndex);

      newColumns[foundColumnIndex] = { ...column, sortOrder: order };

      onChange && onChange({ sorter: { dataIndex, order, column, columns: newColumns }, action: "sort" });
    },
    [columns, onChange]
  );

  const onResizeCallback = useCallback(
    (dataIndex, x, column) => {
      const newColumns = [...columns],
        foundColumnIndex = newColumns.findIndex((col) => col.dataIndex === dataIndex),
        width = column.width + x;

      newColumns[foundColumnIndex] = { ...column, width };
      onChange && onChange({ columnSize: { dataIndex, width, column, columns: newColumns }, action: "resizeColumn" });
    },
    [columns, onChange]
  );

  const onRepositionCallback = useCallback(
    (from, to, position) => {
      const newColumns = [...columns],
        fromIndex = newColumns.findIndex((col) => col.dataIndex === from);

      const target = newColumns.splice(fromIndex, 1);

      let toIndex = newColumns.findIndex((col) => col.dataIndex === to);

      if (position === "back") {
        toIndex += 1;
      }

      const frontColumns = newColumns.splice(0, toIndex),
        finalColumns = [...frontColumns, ...target, ...newColumns];

      onChange &&
        onChange({
          columnPosition: { dataIndex: from, from: fromIndex, to: frontColumns.length, columns: finalColumns },
          action: "repositionColumn",
        });
    },
    [columns, onChange]
  );

  const [isDraging, setIsDraging] = useState(false);

  return (
    <Container>
      {/* 冻结列头 */}
      {stickyHeaderColumns.length ? (
        <StickyHeaders className={stickyClassName} style={{ height: stickyHeight, width: stickyWidth }}>
          {stickyHeaderColumns.map((style, index) => {
            const { dataIndex } = columns[index];
            return (
              <HeaderCell
                style={style}
                key={dataIndex}
                isDraging={isDraging}
                column={columns[index]}
                dataIndex={dataIndex}
                onSort={onSortCallback}
                onResize={onResizeCallback}
                onReposition={onRepositionCallback}
                tableHeight={tableHeight}
                toggleDragState={setIsDraging}
              />
            );
          })}
        </StickyHeaders>
      ) : null}

      {/* 非冻结列头 */}
      <Headers className={className} style={scrollableStyle}>
        {headerColumns.map(({ columnIndex, ...style }) => {
          const { dataIndex } = columns[columnIndex];
          return (
            <HeaderCell
              style={style}
              key={dataIndex}
              isDraging={isDraging}
              column={columns[columnIndex]}
              dataIndex={dataIndex}
              onSort={onSortCallback}
              onResize={onResizeCallback}
              onReposition={onRepositionCallback}
              tableHeight={tableHeight}
              toggleDragState={setIsDraging}
            />
          );
        })}
      </Headers>
    </Container>
  );
};

export default StickyHeader;
