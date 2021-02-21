/*
 * @Author: sun.t
 * @Date: 2021-02-18 16:34:29
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-02-20 17:18:34
 */
import { useEffect, useRef } from "react";
import { VariableSizeGrid } from "react-window";
import { IRawItem } from "./interfaces";

interface IPreprocess {
  groupRowHeight: ((raw: IRawItem, index: number) => number) | number;
  cellHeight: number;
  cellWidth: number;
  rawData: IRawItem[];
  childrenRawName: string;
  width: number;
}
export function usePreprocess({ groupRowHeight, rawData, cellHeight, cellWidth, childrenRawName, width }: IPreprocess) {
  if (!rawData.length) {
    return {
      columnCount: 0,
      rowCount: 0,
      positionMap: {},
      positionCache: {},
      rowHeightCache: {},
    };
  }

  let columnCount = Math.floor(width / cellWidth);

  const { positionMap, positionCache, rowCursor, rowHeightCache } = calculate({
    rawData,
    columnCount,
    cellHeight,
    cellWidth,
    childrenRawName,
    groupRowHeight,
  });

  return {
    columnCount,
    rowCount: rowCursor + 1,
    positionMap,
    positionCache,
    rowHeightCache,
  };
}

interface ICalculate {
  rawData: IRawItem[];
  cellHeight: number;
  cellWidth: number;
  columnCount: number;
  childrenRawName: string;
  rowCursor?: number;
  prefixKey?: string;
  groupRowHeight: ((raw: IRawItem, index: number) => number) | number;
  accumulationTop?: number;
}
interface ICalculateReturn {
  positionMap: { [key: string]: IRawItem };
  positionCache: { [key: string]: { top: number; left: number } };
  rowHeightCache: { [key: string]: number };
  rowCursor: number;
  accumulationTop: number;
}

/**
 * 展平rawData
 * @param rawData
 */
function calculate({
  rawData,
  columnCount,
  cellHeight,
  cellWidth,
  childrenRawName,
  rowCursor = -1,
  prefixKey = "",
  groupRowHeight,
  accumulationTop = 0,
}: ICalculate): ICalculateReturn {
  let positionMap: { [key: string]: IRawItem } = {},
    rowHeightCache: { [key: string]: number } = {},
    _rowCursor = rowCursor + 1,
    _columnCursor = 0,
    _rowTop = accumulationTop,
    positionCache: { [key: string]: { top: number; left: number } } = {};

  for (let [index, raw] of rawData.entries()) {
    const _prefixKey = !prefixKey ? String(index) : `${prefixKey}-${index}`;
    if (raw[childrenRawName]) {
      // 位置对应数据
      positionMap[`${_rowCursor}-${_columnCursor}`] = { ...raw, key: _prefixKey };

      // 分组行高
      let _rowHeight = typeof groupRowHeight === "function" ? groupRowHeight(raw, index) : groupRowHeight;

      positionCache[`${_rowCursor}-${_columnCursor}`] = { top: _rowTop, left: 0 };

      rowHeightCache[_rowCursor] = _rowHeight;

      // 行标+1
      //   _rowCursor += 1;

      // 行偏移
      _rowTop += _rowHeight;

      // 递归计算子元素
      const {
        positionMap: childrenPositionMap,
        positionCache: childrenPositionCache,
        rowCursor: childrenRowCursor,
        rowHeightCache: childrenRowHeightCache,
        accumulationTop: childrenAccumulationTop,
      } = calculate({
        rawData: raw[childrenRawName],
        cellHeight,
        cellWidth,
        columnCount,
        childrenRawName,
        rowCursor: _rowCursor,
        prefixKey: _prefixKey,
        groupRowHeight,
        accumulationTop: _rowTop,
      });

      positionMap = { ...positionMap, ...childrenPositionMap };
      positionCache = { ...positionCache, ...childrenPositionCache };
      rowHeightCache = { ...rowHeightCache, ...childrenRowHeightCache };
      // 数组末尾不能加1,否则会出现连续增加
      _rowCursor = index === rawData.length - 1 ? childrenRowCursor : childrenRowCursor + 1;
      _rowTop = childrenAccumulationTop;
    } else {
      // 位置对应数据
      positionMap[`${_rowCursor}-${_columnCursor}`] = { ...raw, key: _prefixKey };

      positionCache[`${_rowCursor}-${_columnCursor}`] = { top: _rowTop, left: _columnCursor * cellWidth };

      // 重复设置多次
      rowHeightCache[_rowCursor] = cellHeight;

      // 移动列标
      _columnCursor += 1;

      // 是否超出列限制 & 任有循环
      if (_columnCursor >= columnCount && index < rawData.length - 1) {
        _columnCursor = 0;
        _rowCursor += 1;
        _rowTop += cellHeight;
      }
    }
  }
  // rowCursor 当前游标位置
  // accumulationTop 下一层偏移位置
  return { positionMap, positionCache, rowHeightCache, rowCursor: _rowCursor, accumulationTop: _rowTop + cellHeight };
}

export function useRespond({ rowHeightCache, cellWidth }: { rowHeightCache: { [key: string]: number }; cellWidth: number }) {
  const ref = useRef<VariableSizeGrid>();

  // item尺寸发生变化,重置缓存
  // 这里rawData, groupRowHeight, cellHeight, cellWidth, childrenRawName, width变化都会造成rowHeightCache重新计算
  useEffect(() => {
    if (ref.current) {
      ref.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  }, [rowHeightCache]);

  //   // 宽度发生变化,重置缓存
  //   useEffect(() => {
  //     if (ref.current) {
  //       // 重置0列以后所有缓存
  //       // 备注: 如果后期cellWidth变成函数, 需要考虑优化,否则外部使用不当会导致每次render都重置
  //       ref.current.resetAfterColumnIndex(0, true);
  //     }
  //   }, [cellWidth]);

  //   // 行高发生变化,重置缓存
  //   useEffect(() => {
  //     if (ref.current) {
  //       // 重置0列以后所有缓存
  //       // 备注: 如果后期cellWidth变成函数, 需要考虑优化,否则外部使用不当会导致每次render都重置
  //       ref.current.resetAfterRowIndex(0, true);
  //     }
  //   }, [rowHeightCache]);

  return ref;
}
