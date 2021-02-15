/*
 * @Author: sun.t
 * @Date: 2020-09-14 15:50:04
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-01-17 00:26:17
 * @remark: 1. rawData发生变化会导致所有高度缓存刷新
 */
import React, { useCallback, forwardRef, createContext, ReactElement, useMemo } from "react";
import { VariableSizeGrid as Grid } from "react-window";
import { IProps, IHeadersStyle, IStickyContext } from "./interfaces";
import { getRenderedCursor, headerBuilder, columnsBuilder, preprocess, preprocessRawData } from "./helper";
import Cell from "./Cell";
import StickyHeader from "./StickyHeader";
import StickyColumns from "./StickyColumns";

const innerGridElementType = forwardRef<HTMLDivElement, any>(({ children, ...rest }, ref) => (
  <StickyGridContext.Consumer>
    {({
      innerClassName,
      bodyClassName,
      stickyBodyClassName,
      headerClassName,
      stickyHeaderClassName,
      stickyHeight,
      stickyWidth,
      nonStrickyWidth,
      columns,
      columnLeftCache,
      columnWidthCache,
      stickyColumnsCount,
      rowHeightCache,
      rowTopCache,
      rawData,
      useStickyIsScrolling,
      placeholder,
      childrenRawName,
      groupRowRender,
    }) => {
      // If useIsScrolling is enabled for this grid, children's props receives an additional isScrolling boolean prop
      const isScrolling = children.length > 0 ? children[0].props.isScrolling : false;

      const [minRow, maxRow, minColumn, maxColumn, GroupRows] = getRenderedCursor({ children, childrenRawName, nonStrickyWidth });

      const isHeader = stickyHeight > 0;

      let nonStickyHeaderColumns: IHeadersStyle[] = [],
        stickyHeaderColumns: IHeadersStyle[] = [];

      if (isHeader) {
        // 计算冻结列头位置
        stickyHeaderColumns = headerBuilder({
          minColumn: 0,
          maxColumn: stickyColumnsCount - 1,
          stickyHeight,
          columnLeftCache,
          columnWidthCache,
          offsetWidth: 0,
          offsetIndex: 0,
        });
        // 计算非冻结列头位置
        nonStickyHeaderColumns = headerBuilder({
          minColumn,
          maxColumn,
          stickyHeight,
          columnLeftCache,
          columnWidthCache,
          offsetWidth: stickyWidth,
          offsetIndex: stickyColumnsCount,
        });
      }

      // 固定行位置
      const rowsOfStickyColumns = columnsBuilder({
        minRow,
        maxRow,
        stickyWidth,
        rowHeightCache,
        rowTopCache,
      });

      // body样式
      const containerStyle = {
        ...rest.style,
        width: `${parseFloat(rest.style.width) + stickyWidth}px`,
        height: `${parseFloat(rest.style.height) + stickyHeight}px`,
      };

      return (
        <div className={innerClassName} ref={ref} {...{ ...rest, style: containerStyle }}>
          {isHeader ? (
            <StickyHeader
              columns={columns}
              stickyHeaderColumns={stickyHeaderColumns}
              headerColumns={nonStickyHeaderColumns}
              stickyHeight={stickyHeight}
              stickyWidth={stickyWidth}
              stickyClassName={stickyHeaderClassName}
              className={headerClassName}
            />
          ) : null}
          {/* 固定列 */}
          {stickyColumnsCount ? (
            <StickyColumns
              columns={columns}
              rawData={rawData}
              rows={rowsOfStickyColumns}
              stickyHeight={stickyHeight}
              stickyWidth={stickyWidth}
              stickyColumnsCount={stickyColumnsCount}
              columnWidthCache={columnWidthCache}
              className={stickyBodyClassName}
              isScrolling={isScrolling}
              placeholder={placeholder}
              useIsScrolling={useStickyIsScrolling}
              groupRowRender={groupRowRender}
              childrenRawName={childrenRawName}
            />
          ) : null}
          <div className={bodyClassName} style={{ top: stickyHeight, left: stickyWidth, position: "absolute" }}>
            {children}

            {/* 分组行 */}
            {Object.values(GroupRows).map(({ style, columnIndex, data, key }) => (
              <div style={style} key={key}>
                {groupRowRender ? groupRowRender({ columnIndex: columnIndex + stickyColumnsCount, data, width: nonStrickyWidth }) : null}
              </div>
            ))}
          </div>
        </div>
      );
    }}
  </StickyGridContext.Consumer>
));

const StickyGridContext = createContext<IStickyContext>({
  stickyHeight: 0,
  stickyWidth: 0,
  nonStrickyWidth: 0,
  columns: [],
  stickyColumnsCount: 0,
  columnLeftCache: [],
  columnWidthCache: [],
  rowHeightCache: [],
  rowTopCache: [],
  rawData: [],
  innerClassName: "",
  bodyClassName: "",
  stickyBodyClassName: "",
  headerClassName: "",
  stickyHeaderClassName: "",
  childrenRawName: "children",
});

/**
 * 虚拟表格
 * 不定宽高行列 \ 冻结行列
 * 注意点
 * 1.冻结列请给定宽度
 * @param param0
 * @interface const Component: <RecordType>(props: IProps<RecordType>, ref?: React.Ref<Grid>) => ReactElement | null = (props, ref) => {};
 */
function Component<RecordType>(props: IProps<RecordType>, ref?: React.Ref<Grid>): ReactElement | null {
  const {
    outerRef,
    innerRef,
    direction,
    columnWidth,
    rowHeight,
    columns,
    rawData,
    height,
    width,
    onScroll,
    header,
    placeholder,
    itemKey,
    initialScrollLeft,
    initialScrollTop,
    overscanColumnCount,
    overscanRowCount,
    style,
    useStickyIsScrolling,
    useIsScrolling,
    childrenRawName = "children",

    groupRowRender,

    className = "",
    innerClassName = "",
    bodyClassName = "",
    stickyBodyClassName = "",
    headerClassName = "",
    stickyHeaderClassName = "",
  } = props;
  // 预计算
  const {
    stickyHeight,
    stickyWidth,
    nonStrickyWidth,
    stickyColumnsCount,
    nonStrickyColumnsCount,
    columnLeftCache,
    columnWidthCache,
  } = useMemo(
    () => preprocess<RecordType>({ header, columns, columnWidth }),
    [header, columns, columnWidth]
  );

  // 这里关于行位置&行高的缓存考虑
  // 1. 如果放到这里统一计算, 那只要rawData不变其实就只用计算一次,提高空间成本来降低时间成本
  // 2. 如果放到后面计算, 那每次只要滚动发生,从第一行到当前展示最大行数,计算是无法避免的,也就是说行数越大,滚动到越末尾,时间成本越高.
  // 方案1:问题就在实时数据场景,rowData其实用的时候是一直发生变化的.但是这里要注意区分的是是rowData行数发生变化,还是其间的数据发生变化.
  // Todo 这里主要问题在如何管理下面这个函数的依赖项,这里可以不直接使用rawData作为依赖项,可以使用props传递进来的函数来计算出一个基础类型来作为依赖项. 但是react会有警告.
  // const rowHeightDep = rowKey ?  rowKey() : rawData
  const { rowHeightCache, rowTopCache, flatRawData } = useMemo(
    () => preprocessRawData({ rowHeight, rawData, columnsLength: columns.length, childrenRawName }),
    [rawData, rowHeight, columns.length, childrenRawName]
  );

  // 单元格渲染
  const GridCell = useCallback(
    ({ columnIndex, rowIndex, style, data, isScrolling }) => {
      const row = data[rowIndex];

      // 判断是否分组行
      if (row[childrenRawName]) {
        return null;
      }

      return (
        <Cell
          columnIndex={columnIndex + stickyColumnsCount}
          rowIndex={rowIndex}
          style={style}
          column={columns[stickyColumnsCount + columnIndex]}
          data={row}
          showPlaceholder={isScrolling && placeholder}
          placeholder={placeholder}
        />
      );
    },
    [stickyColumnsCount, columns, placeholder, childrenRawName]
  );

  // 手动将columns划分开,这里需要加上偏移量
  const _columnWidth = useCallback((index) => columnWidthCache[index + stickyColumnsCount], [columnWidthCache, stickyColumnsCount]),
    _rowHegiht = useCallback((index) => rowHeightCache[index], [rowHeightCache]);

  return (
    <StickyGridContext.Provider
      value={{
        stickyHeight,
        stickyWidth,
        nonStrickyWidth,
        columns,
        stickyColumnsCount,
        columnLeftCache,
        columnWidthCache,
        rowHeightCache,
        rowTopCache,
        useStickyIsScrolling,
        innerClassName,
        bodyClassName,
        stickyBodyClassName,
        headerClassName,
        stickyHeaderClassName,
        rawData: flatRawData,
        childrenRawName,
        // func
        placeholder,
        groupRowRender,
      }}
    >
      <Grid
        ref={ref}
        outerRef={outerRef}
        innerRef={innerRef}
        direction={direction}
        style={style}
        className={className}
        height={height}
        width={width}
        itemData={flatRawData}
        columnCount={nonStrickyColumnsCount}
        rowCount={flatRawData.length}
        columnWidth={_columnWidth}
        rowHeight={_rowHegiht}
        useIsScrolling={useIsScrolling}
        initialScrollLeft={initialScrollLeft}
        initialScrollTop={initialScrollTop}
        overscanColumnCount={overscanColumnCount}
        overscanRowCount={overscanRowCount}
        innerElementType={innerGridElementType}
        // outerElementType
        itemKey={itemKey}
        onScroll={(props) => {
          onScroll && onScroll(props);
        }}
        onItemsRendered={({
          overscanColumnStartIndex,
          overscanColumnStopIndex,
          overscanRowStartIndex,
          overscanRowStopIndex,
          visibleColumnStartIndex,
          visibleColumnStopIndex,
          visibleRowStartIndex,
          visibleRowStopIndex,
        }) => {
          console.log("item render");
        }}
      >
        {GridCell}
      </Grid>
    </StickyGridContext.Provider>
  );
}

export default forwardRef(Component);
