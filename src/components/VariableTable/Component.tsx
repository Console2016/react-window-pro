/*
 * @Author: sun.t
 * @Date: 2020-09-14 15:50:04
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-08-15 11:09:43
 * @remark: 1. rawData发生变化会导致所有高度缓存刷新
 */
import React, { useCallback, forwardRef, createContext, ReactElement, useMemo, ForwardedRef, useImperativeHandle } from "react";
import { VariableSizeGrid } from "react-window";
import { StyleSheetManager } from "styled-components";
import { IProps, IHeadersStyle, IStickyContext, VariableTable } from "./interfaces";
import { getRenderedCursor, headerBuilder, columnsBuilder, preprocessRawData } from "./helper";
import { usePreprocess, useRespond, useInitialScroll } from "./hooks";
import ScrollCell from "./ScrollCell";
import StickyHeader from "./StickyHeader";
import StickyColumns from "./StickyColumns";
import Empty from "./image/empty.svg";
import { CSSProperties } from "styled-components";

const innerGridElementType = forwardRef<HTMLDivElement, any>(({ children, ...rest }, ref) => (
  <StickyGridContext.Consumer>
    {({
      height,
      width,
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
      nonStrickyColumnsCount,
      rowHeightCache,
      rowTopCache,
      rawData,
      placeholder,
      childrenRawName,
      groupRowRender,
      emptyRender,
      onChange,
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
          minColumn: Number.isFinite(minColumn) ? minColumn : 0,
          maxColumn: Number.isFinite(maxColumn) ? maxColumn : nonStrickyColumnsCount - 1,
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

      const containerWidth = parseFloat(rest.style.width) + stickyWidth;

      // body样式
      const containerStyle = {
        ...rest.style,
        width: `${containerWidth}px`,
        height: `${parseFloat(rest.style.height) + stickyHeight}px`,
      };

      const emptyStyle: CSSProperties = {
        display: "flex",
        height: "100%",
        paddingTop: 50,
        flexDirection: "column",
        alignItems: "center",
        width: Math.max(containerWidth, width),
        top: stickyHeight,
        left: stickyWidth,
        position: "absolute",
        opacity: 0.5,
        // color: "rgba(0, 0, 0, 0.25)",
      };

      return (
        <div className={innerClassName} ref={ref} {...{ ...rest, style: containerStyle }}>
          {/* 列头 */}
          {isHeader ? (
            <StickyHeader
              tableHeight={height}
              columns={columns}
              stickyHeaderColumns={stickyHeaderColumns}
              headerColumns={nonStickyHeaderColumns}
              stickyHeight={stickyHeight}
              stickyWidth={stickyWidth}
              nonStrickyWidth={nonStrickyWidth}
              stickyClassName={stickyHeaderClassName}
              className={headerClassName}
              onChange={onChange}
            />
          ) : null}

          {rawData.length > 0 ? (
            <>
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
                  groupRowRender={groupRowRender}
                  childrenRawName={childrenRawName}
                />
              ) : null}
              <div className={bodyClassName} style={{ top: stickyHeight, left: stickyWidth, position: "absolute" }}>
                {children}

                {/* 分组行 */}
                {Object.values(GroupRows).map(({ style, columnIndex, data, key }) => (
                  <div style={style} key={key}>
                    {groupRowRender
                      ? groupRowRender({ columnIndex: columnIndex + stickyColumnsCount, data, width: nonStrickyWidth })
                      : null}
                  </div>
                ))}
              </div>
            </>
          ) : emptyRender ? (
            emptyRender(emptyStyle)
          ) : (
            <div className={bodyClassName} style={emptyStyle}>
              <img src={Empty} style={{ height: "50px", paddingBottom: "10px" }} />
              暂无数据
            </div>
          )}
        </div>
      );
    }}
  </StickyGridContext.Consumer>
));

const StickyGridContext = createContext<IStickyContext>({
  height: 0,
  width: 0,
  stickyHeight: 0,
  stickyWidth: 0,
  nonStrickyWidth: 0,
  columns: [],
  stickyColumnsCount: 0,
  nonStrickyColumnsCount: 0,
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
 * @interface const Component: <RecordType>(props: IProps<RecordType>, ref?: React.Ref<VariableSizeGrid>) => ReactElement | null = (props, ref) => {};
 */
function Component<RecordType>(props: IProps<RecordType>, ref?: ForwardedRef<VariableTable<RecordType>>): ReactElement | null {
  const {
    outerRef,
    innerRef,
    direction,
    columns,
    rawData,
    height,
    width,
    header,
    placeholder,
    initialScrollLeft,
    initialScrollTop,
    overscanColumnCount,
    overscanRowCount,
    style,
    useIsScrolling,
    childrenRawName = "children",
    columnWidth,
    rowHeight,
    onScroll,
    onChange,
    itemKey,
    groupRowRender,
    emptyRender,
    initialScrollRowIndex,
    initialScrollColumnIndex,

    className = "",
    innerClassName = "",
    bodyClassName = "",
    stickyBodyClassName = "",
    headerClassName = "",
    stickyHeaderClassName = "",

    styleSheetManagerProps
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
    avergeColumnWidth,
  } = useMemo(() => usePreprocess<RecordType>({ header, columns, columnWidth }), [header, columns, columnWidth]);

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
    ({ columnIndex, rowIndex, style, data, isScrolling }: any) => {
      const row = data[rowIndex];

      // 判断是否分组行
      if (row[childrenRawName]) {
        return null;
      }

      return (
        <ScrollCell
          isScrolling={isScrolling}
          placeholder={placeholder}
          style={style}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
          column={columns[stickyColumnsCount + columnIndex]}
          record={row}
        />
      );
    },
    [stickyColumnsCount, columns, placeholder, childrenRawName]
  );

  // 手动将columns划分开,这里需要加上偏移量
  const _columnWidth = useCallback((index: number) => columnWidthCache[index + stickyColumnsCount], [columnWidthCache, stickyColumnsCount]),
    _rowHeight = useCallback((index: number) => rowHeightCache[index], [rowHeightCache]);

  // 初始化偏移
  const { _initialScrollLeft, _initialScrollTop } = useInitialScroll({
    initialScrollLeft,
    initialScrollTop,
    initialScrollRowIndex,
    initialScrollColumnIndex,
    columns,
    stickyColumnsCount,
    flatRawData,
    columnWidthCache,
    rowHeightCache,
  });

  const refCache = useRespond({ columns, columnWidth, rowHeightCache });

  // 构建对外ref
  useImperativeHandle(
    ref,
    () => {
      return {
        columns,
        rawData,
        columnWidth: _columnWidth,
        rowHeight: _rowHeight,
        grid: refCache.current,
      };
    },
    [columns, _columnWidth, _rowHeight, rawData]
  );

  const _style = useMemo(() => ({ overflow: "overlay", ...(style || {}) }), [style]);

  return (
    <StyleSheetManager>
      <StickyGridContext.Provider
        value={{
          height,
          width,
          stickyHeight,
          stickyWidth,
          nonStrickyWidth,
          columns,
          stickyColumnsCount,
          nonStrickyColumnsCount,
          columnLeftCache,
          columnWidthCache,
          rowHeightCache,
          rowTopCache,
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
          emptyRender,
          onChange,
        }}
      >
        <VariableSizeGrid
          ref={refCache}
          outerRef={outerRef}
          innerRef={innerRef}
          direction={direction}
          style={_style}
          className={className}
          height={height}
          width={width}
          itemData={flatRawData}
          columnCount={nonStrickyColumnsCount}
          rowCount={flatRawData.length}
          columnWidth={_columnWidth}
          rowHeight={_rowHeight}
          useIsScrolling={useIsScrolling}
          initialScrollLeft={_initialScrollLeft}
          initialScrollTop={_initialScrollTop}
          overscanColumnCount={overscanColumnCount}
          overscanRowCount={overscanRowCount}
          innerElementType={innerGridElementType}
          estimatedColumnWidth={avergeColumnWidth} // 冻结列横向滚动条当数据为空时异常,整体宽度计算错误; 数据回空时会使用该值估算宽度,默认为50
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
            // console.log("item render");
          }}
        >
          {GridCell}
        </VariableSizeGrid>
      </StickyGridContext.Provider>
    </StyleSheetManager>
  );
}

export default forwardRef(Component);
