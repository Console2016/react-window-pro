import { ReactElement } from "react";
import { CSSProperties } from "styled-components";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from "./constant";
import { IColumnsStyle, IHeadersStyle, IPreproccessProps, TObject } from "./interfaces";

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
  if(maxColumn < 0){
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
export function preprocess<RecordType>({ header, columns, columnWidth }: IPreproccessProps<RecordType>) {
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
    nonStrickyColumnsCount: nonStrickyColumns.length,
    columnLeftCache,
    columnWidthCache,
  };
}

/**
 * 展平rawData
 * @param rawData
 */
function flatRawData(rawData: TObject[], columnsLength: number, childrenRawName: string, prefixKey = ""): TObject[] {
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
  rowHeight?: (index: number) => number;
  rawData: TObject[];
  columnsLength: number;
  childrenRawName: string;
}) {
  // 处理嵌套数据
  const _rowData = flatRawData(rawData, columnsLength, childrenRawName);

  // 计算行高及偏移
  let rowHeightCache: number[] = [],
    rowTopCache: number[] = [0];

  for (let [index] of _rowData.entries()) {
    // height cache
    rowHeightCache[index] = rowHeight ? rowHeight(index) : DEFAULT_ROW_HEIGHT;

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
