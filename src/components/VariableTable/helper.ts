import { ReactElement } from "react";

import { CSSProperties } from "styled-components";
import {  DEFAULT_ROW_HEIGHT } from "./constant";
import { IColumnsStyle, IHeadersStyle,  TObject, IRawItem } from "./interfaces";

// 缓存函数
export const memoize = (fun: any, getKey: (...args: any) => string) => {
  const cache: { [prop: string]: any } = {};

  return (...args: any[]) => {
    const key = getKey(...args);
    let result = null;

    if (cache.hasOwnProperty(key)) {
      result = cache[key];
    } else {
      result = fun(...args);
      cache[key] = result;
    }
    return result;
  };
};

// :[minRow:number, maxRow:number, minColumn:number, maxColumn:number, groupRows:TObject]
type TPrevProps = [
  number,
  number,
  number,
  number,
  { [key: string]: { style: CSSProperties; data: TObject; columnIndex: number; key: string } }
];
/**
 * 计算数据区间
 * @param children
 */
export const getRenderedCursor = ({
  children,
  childrenRawName,
  nonStrickyWidth,
}: {
  children: ReactElement[];
  childrenRawName: string;
  nonStrickyWidth: number;
}) =>
  children.reduce<TPrevProps>(
    ([minRow, maxRow, minColumn, maxColumn, rows], { props: { columnIndex, rowIndex, data, style } }) => {
      if (rowIndex < minRow) {
        minRow = rowIndex;
      }
      if (rowIndex > maxRow) {
        maxRow = rowIndex;
      }
      if (columnIndex < minColumn) {
        minColumn = columnIndex;
      }
      if (columnIndex > maxColumn) {
        maxColumn = columnIndex;
      }

      // 处理分组行
      const row = data[rowIndex],
        rowKey = row.key;
      if (row[childrenRawName] && !rows[rowKey]) {
        rows[rowKey] = {
          columnIndex,
          style: { ...style, left: 0, width: nonStrickyWidth },
          data: row,
          key: rowKey,
        };
      }

      return [minRow, maxRow, minColumn, maxColumn, rows];
    },
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, {}]
  );

/**
 * 固定行样式计算
 * @param minColumn
 * @param maxColumn
 * @param columnWidth
 * @param stickyHeight
 */
export const headerBuilder = ({
  minColumn,
  maxColumn,
  stickyHeight,
  columnLeftCache,
  columnWidthCache,
  offsetIndex,
  offsetWidth,
}: {
  minColumn: number;
  maxColumn: number;
  stickyHeight: number;
  columnLeftCache: number[];
  columnWidthCache: number[];
  offsetIndex: number;
  offsetWidth: number;
}): IHeadersStyle[] => {
  // 冻结列会出现该情况
  if (maxColumn < 0) {
    return [];
  }

  const columns = [];

  for (let i = minColumn; i <= maxColumn; i++) {
    columns.push({
      height: stickyHeight,
      width: columnWidthCache[i + offsetIndex],
      left: columnLeftCache[i + offsetIndex] - offsetWidth,
      columnIndex: i + offsetIndex,
    });
  }

  return columns;
};

/**
 * 固定列样式计算
 * @param minRow
 * @param maxRow
 * @param rowHeight
 * @param stickyWidth
 */
export const columnsBuilder = ({
  minRow,
  maxRow,
  stickyWidth,
  rowHeightCache,
  rowTopCache,
}: {
  minRow: number;
  maxRow: number;
  stickyWidth: number;
  rowHeightCache: number[];
  rowTopCache: number[];
}): IColumnsStyle[] => {
  const rows = [];

  for (let i = minRow; i <= maxRow; i++) {
    rows.push({
      height: rowHeightCache[i],
      width: stickyWidth,
      top: rowTopCache[i],
      rowIndex: i,
    });
  }

  return rows;
};


/**
 * 展平rawData
 * @param rawData
 */
function flatRawData(rawData: IRawItem[], columnsLength: number, childrenRawName: string, prefixKey = ""): TObject[] {
  let _rowData: TObject[] = [];

  for (let [index, raw] of rawData.entries()) {
    const _prefixKey = !prefixKey ? String(index) : `${prefixKey}-${index}`;
    if (raw[childrenRawName]) {
      // 添加分组数据
      _rowData.push({ ...raw, key: _prefixKey });

      _rowData = _rowData.concat(flatRawData(raw[childrenRawName], columnsLength, childrenRawName, _prefixKey));
    } else {
      _rowData.push({ ...raw, key: _prefixKey });
    }
  }

  return _rowData;
}

/**
 * 缓存行高和top偏移量
 * @param param rowHeight 计算高度函数
 * @param param rawData 数据集
 */
export function preprocessRawData({
  rowHeight,
  rawData,
  columnsLength,
  childrenRawName,
}: {
  rowHeight?: (index: number, data:IRawItem) => number;
  rawData: IRawItem[];
  columnsLength: number;
  childrenRawName: string;
}) {
  // 处理嵌套数据
  const _rowData = flatRawData(rawData, columnsLength, childrenRawName);

  // 计算行高及偏移
  let rowHeightCache: number[] = [],
    rowTopCache: number[] = [0];

  for (let [index, data] of _rowData.entries()) {
    // height cache
    rowHeightCache[index] = rowHeight ? rowHeight(index, data) : DEFAULT_ROW_HEIGHT;

    if (index > 0) {
      rowTopCache.push(rowHeightCache[index - 1] + rowTopCache[rowTopCache.length - 1]);
    }
  }

  return {
    rowHeightCache,
    rowTopCache,
    flatRawData: _rowData,
  };
}

