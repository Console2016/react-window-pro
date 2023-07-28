/*
 * @Author: sun.t
 * @Date: 2021-03-13 22:15:40
 * @Last Modified by: sun.t
 * @Last Modified time: 2023-07-29 00:14:39
 */
import { useEffect, useMemo, useRef } from "react";
import { VariableSizeGrid } from "react-window";
import { IVariableColumn, IPreproccessProps, IInitialScrollProps } from "./interfaces";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_COLUMN_WIDTH } from "./constant";

export function useRespond<RecordType>({
  columns,
  columnWidth,
  rowHeightCache,
}: {
  columns: IVariableColumn<RecordType>[];
  columnWidth?: (index: number) => number;
  rowHeightCache: number[];
}) {
  const ref = useRef<VariableSizeGrid>(null);

  // 宽度发生变化,重置缓存
  useEffect(() => {
    if (ref.current) {
      // 重置0列以后所有缓存
      // 备注: 如果后期cellWidth变成函数, 需要考虑优化,否则外部使用不当会导致每次render都重置
      ref.current.resetAfterColumnIndex(0, true);
    }
  }, [columns, columnWidth]);

  // 行高发生变化,重置缓存
  useEffect(() => {
    if (ref.current) {
      // 重置0列以后所有缓存
      // 备注: 如果后期cellWidth变成函数, 需要考虑优化,否则外部使用不当会导致每次render都重置
      ref.current.resetAfterRowIndex(0, true);
    }
  }, [rowHeightCache]);

  return ref;
}

/**
 * 计算固定行列
 * @param header
 * @param columns 列配置
 * @param columnWidth 列宽计算函数
 * @returns result
 * @returns result.stickyHeight 冻结行高
 * @returns result.stickyColumnsCount 冻结列columns
 * @returns result.nonStrickyColumnsCount 非冻结列columns
 * @returns result.stickyWidth 总冻结列宽度
 * @returns result.columnLeftCache 列left位置集合
 * @returns result.columnWidthCache 宽度集合
 * @returns result.rowHeightCache 高度集合
 */
export function usePreprocess<RecordType>({ header, columns, columnWidth }: IPreproccessProps<RecordType>) {
  //  固定行列(50px)
  let stickyHeight = DEFAULT_HEADER_HEIGHT,
    stickyColumns = [],
    nonStrickyColumns = [];

  // 屏蔽header
  if (!header) stickyHeight = 0;

  // 使用用户定义高度
  if (header && typeof header === "number") stickyHeight = header;

  // 归类冻结与非冻结
  let isOver = false;
  for (let column of columns.values()) {
    const { fixed } = column;
    // "left" / "right"
    if (fixed && !isOver) {
      stickyColumns.push(column);
    } else {
      isOver = true;
      nonStrickyColumns.push(column);
    }
  }

  // 当所有列被冻结
  if (nonStrickyColumns.length === 0) {
    nonStrickyColumns = stickyColumns;
    stickyColumns = [];
  }

  // 计算所有宽度 columnWidth() -> column.width -> DEFAULT_COLUMN_WIDTH
  const columnWidthCache: number[] = columns.map((column, index) =>
    columnWidth ? columnWidth(index) : column.width ? Number(column.width) : DEFAULT_COLUMN_WIDTH
  );
  // 总冻结列宽度
  const stickyWidth = stickyColumns.reduce((totalWidth, column, index) => totalWidth + columnWidthCache[index], 0);
  // 非冻结列宽度
  const nonStrickyWidth = nonStrickyColumns.reduce(
    (totalWidth, column, index) => totalWidth + columnWidthCache[index + stickyColumns.length],
    0
  );
  // 非冻结列平均列宽
  const avergeColumnWidth = Math.ceil(nonStrickyWidth / nonStrickyColumns.length) || 0;

  // 计算所有列left偏移量
  const columnLeftCache = columns.reduce(
    (list, column, index) => {
      // 最后一列不用计算
      if (index === columns.length - 1) {
        return list;
      }
      return list.concat([columnWidthCache[index] + list[list.length - 1]]);
    },
    [0]
  );

  return {
    stickyHeight,
    stickyWidth,
    nonStrickyWidth,
    stickyColumnsCount: stickyColumns.length,
    // 当全部冻结的时候，由于基础表格没有列会导致所有国定列也不显示
    nonStrickyColumnsCount: nonStrickyColumns.length,
    columnLeftCache,
    columnWidthCache,
    avergeColumnWidth,
  };
}

/**
 * 初始化偏移值(只有组件初始化时才产生作用)
 * @param param0
 * @returns
 */
export function useInitialScroll<RecordType>({
  initialScrollLeft,
  initialScrollTop,
  initialScrollRowIndex,
  initialScrollColumnIndex,
  columns,
  stickyColumnsCount,
  flatRawData,
  columnWidthCache,
  rowHeightCache,
}: IInitialScrollProps<RecordType>) {
  const _initialScrollLeft = useMemo(() => {
    let index: number | undefined;
    if (typeof initialScrollColumnIndex === "number") {
      index = initialScrollColumnIndex;
    }
    if (typeof initialScrollColumnIndex === "function") {
      index = initialScrollColumnIndex(columns);
    }

    if (typeof index === "undefined") {
      return initialScrollLeft;
    }

    let left = 0;

    // index在冻结列范围内
    if (index < stickyColumnsCount) {
      return left;
    }

    // 超出冻结列
    for (let i = 0; i < index - stickyColumnsCount; i++) {
      left += columnWidthCache[i + stickyColumnsCount];
    }

    return left;
  }, []);

  const _initialScrollTop = useMemo(() => {
    let index: number | undefined;
    if (typeof initialScrollRowIndex === "number") {
      index = initialScrollRowIndex;
    }
    if (typeof initialScrollRowIndex === "function") {
      index = initialScrollRowIndex(flatRawData);
    }

    if (typeof index === "undefined") {
      return initialScrollTop;
    }

    let top = 0;

    for (let i = 0; i < index; i++) {
      top += rowHeightCache[i];
    }

    return top;
  }, []);

  return {
    _initialScrollLeft,
    _initialScrollTop,
  };
}
