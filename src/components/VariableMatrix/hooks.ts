import { IRawItem, TRowHeight } from "./interfaces";
import { calculate } from "./helper";
import { useEffect, useRef } from "react";
import { VariableSizeGrid } from "react-window";

interface IPreprocess {
  groupRowHeight: ((index: number, raw: IRawItem) => number) | number;
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
      groupStyleMap: {},
    };
  }

  let columnCount = Math.floor(width / cellWidth);

  const { positionMap, positionCache, rowCursor, rowHeightCache, groupStyleMap } = calculate({
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
    // groupStyle,
    groupStyleMap,
  };
}

export function useRespond({ rowHeightCache, cellWidth }: { rowHeightCache: TRowHeight; cellWidth: number }) {
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
