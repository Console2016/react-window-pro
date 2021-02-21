/*
 * @Author: sun.t
 * @Date: 2021-02-18 13:23:51
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-02-20 22:43:48
 */
import React, { createContext, forwardRef, ReactElement, useCallback, useMemo, ForwardedRef } from "react";
import { VariableSizeGrid as Matrix } from "react-window";
import Cell from "./Cell";
import { usePreprocess, useRespond } from "./helper";
import { ScrollbarSize } from "./constant";
import { IProps, IContext, IRawItem } from "./interfaces";

const EmptyArray: IRawItem[] = [];

const MatrixContext = createContext<IContext>({
  innerClassName: "",
  scrollbarSize: ScrollbarSize,
});

const innerGridElementType = forwardRef<HTMLDivElement, any>(({ children, ...rest }, ref) => (
  <MatrixContext.Consumer>
    {({ innerClassName, scrollbarSize }) => {
      const containerStyle = {
        ...rest.style,
        width: rest.style.width,
        marginRight: scrollbarSize,
      };

      return (
        <div className={innerClassName} ref={ref} {...{ ...rest, style: containerStyle }}>
          {children}
        </div>
      );
    }}
  </MatrixContext.Consumer>
));

/**
 * 虚拟矩阵组件
 * @param props
 * @param ref
 */
function Component<RecordType>(props: IProps<RecordType>, ref?: ForwardedRef<Matrix>): ReactElement | null {
  const {
    outerRef,
    innerRef,
    groupRowHeight = 40,
    cellHeight,
    cellWidth,
    height,
    width,
    rawData = EmptyArray,
    itemKey,
    placeholder,
    groupRowRender,
    cellRender,
    className,
    style,
    scrollbarSize = ScrollbarSize,
    innerClassName = "",
    useIsScrolling,
    overscanRowCount,
    childrenRawName = "children",
    // initialScrollLeft,
    initialScrollTop,
    onScroll,
  } = props;

  const _width = width - scrollbarSize;

  const { columnCount, rowCount, positionMap, positionCache, rowHeightCache } = useMemo(
    () => usePreprocess({ groupRowHeight, rawData, cellHeight, cellWidth, childrenRawName, width: _width }),
    [rawData, groupRowHeight, cellHeight, cellWidth, childrenRawName, _width]
  );

  const refCache = useRespond({ rowHeightCache, cellWidth });

  const _rowHegiht = useCallback((index) => rowHeightCache[index], [rowHeightCache]),
    _columnWidth = useCallback(() => cellWidth, [cellWidth]);

  // 单元格渲染
  const GridCell = useCallback(
    ({ columnIndex, rowIndex, style, isScrolling }) => {
      const cellData = positionMap[`${rowIndex}-${columnIndex}`];

      let _style = { ...style };

      if (typeof cellData === "undefined") {
        return null;
      }

      const isGroupCell = cellData[childrenRawName];

      // 分组样式
      if (isGroupCell) {
        _style.width = _width;
        // _style.borderBottom = "1px solid";
      }

      return (
        <Cell
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          style={_style}
          data={cellData}
          isGroupCell={isGroupCell}
          showPlaceholder={isScrolling && placeholder}
          placeholder={placeholder}
          groupRowRender={groupRowRender}
          cellRender={cellRender}
        ></Cell>
      );
    },
    [placeholder, childrenRawName, positionMap, groupRowRender, _width]
  );

  return (
    <MatrixContext.Provider value={{ innerClassName, scrollbarSize }}>
      <Matrix
        ref={(e: Matrix) => {
          refCache.current = e;
          if (typeof ref === "function") {
            ref(e);
          } else {
            ref && (ref.current = e);
          }
        }}
        outerRef={outerRef}
        innerRef={innerRef}
        height={height}
        width={width}
        className={className}
        style={{ ...style, overflow: "overlay" }}
        itemKey={itemKey}
        useIsScrolling={useIsScrolling}
        onScroll={(props) => {
          onScroll && onScroll(props);
        }}
        overscanRowCount={overscanRowCount}
        columnCount={columnCount}
        rowCount={rowCount}
        rowHeight={_rowHegiht}
        columnWidth={_columnWidth}
        innerElementType={innerGridElementType}
        // initialScrollLeft={initialScrollLeft}
        initialScrollTop={initialScrollTop}
      >
        {GridCell}
      </Matrix>
    </MatrixContext.Provider>
  );
}

export default forwardRef(Component);
