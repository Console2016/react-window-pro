/*
 * @Author: sun.t
 * @Date: 2021-02-18 16:34:29
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-02-28 19:28:57
 */
import { useEffect, useRef } from "react";
import { VariableSizeGrid } from "react-window";
import { IRawItem, TGroupSize, TGroupStyleMap, TPositionCache, TPositionMap, TRowHeight } from "./interfaces";

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
  positionMap: TPositionMap;
  positionCache: TPositionCache;
  rowHeightCache: TRowHeight;
  rowCursor: number;
  accumulationTop: number;
  groupStyle: TGroupSize;
  groupStyleMap: TGroupStyleMap;
}

const isLastOne = (index: number, length: number) => index === length - 1;

/**
 * 展平rawData
 * @param rawData
 */
export function calculate({
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
  let positionMap: TPositionMap = {},
    rowHeightCache: TRowHeight = {},
    _rowCursor = rowCursor + 1,
    _columnCursor = 0,
    _rowTop = accumulationTop,
    positionCache: TPositionCache = {},
    groupStyleMap: TGroupStyleMap = {};

  for (let [index, raw] of rawData.entries()) {
    const _prefixKey = !prefixKey ? String(index) : `${prefixKey}-${index}`;

    // (非)分组数据混用
    const prevRaw = rawData[index - 1];
    if (prevRaw && toString.call(prevRaw[childrenRawName]) !== toString.call(raw[childrenRawName])) {
      // 行指针需要下移
      _rowCursor += 1;
      // 列指针需要归0
      _columnCursor = 0;
      // 行高偏移调整
      _rowTop += Object.values(rowHeightCache).reduce((prev, curr) => prev + curr, 0);
    }

    if (raw[childrenRawName]) {
      // 位置对应数据
      positionMap[`${_rowCursor}-${_columnCursor}`] = { ...raw, key: _prefixKey };

      // 分组头行高
      let _rowHeight = typeof groupRowHeight === "function" ? groupRowHeight(raw, index) : groupRowHeight;

      // 分组头位置
      positionCache[`${_rowCursor}-${_columnCursor}`] = { top: _rowTop, left: 0 };

      // 分组头行高
      rowHeightCache[_rowCursor] = _rowHeight;

      // 行指针+1
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
        groupStyle: childrenGroupSize,
        groupStyleMap: childrenGroupSizeMap,
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

      // 合并子分组信息
      positionMap = { ...positionMap, ...childrenPositionMap };
      positionCache = { ...positionCache, ...childrenPositionCache };
      rowHeightCache = { ...rowHeightCache, ...childrenRowHeightCache };

      // 对递归计算中的当前行指针下移 (数组末尾不能加1,下面已无数据)
      _rowCursor = isLastOne(index, rawData.length) ? childrenRowCursor : childrenRowCursor + 1;

      // 当前分组属性
      childrenGroupSize.height += _rowHeight; // 循环高度 + 分组头高度 = 分组高度
      childrenGroupSize.top = _rowTop - _rowHeight; // 分组top位置需要上移(包含分组头)

      // 覆盖当前的行指针
      _rowTop = childrenAccumulationTop;

      // 追加当前分组样式信息
      groupStyleMap[_prefixKey] = {
        raw,
        style: childrenGroupSize,
      };

      // 追加合并子分组样式信息
      groupStyleMap = { ...groupStyleMap, ...childrenGroupSizeMap };
    } else {
      // 位置对应数据
      positionMap[`${_rowCursor}-${_columnCursor}`] = { ...raw, key: _prefixKey };

      positionCache[`${_rowCursor}-${_columnCursor}`] = { top: _rowTop, left: _columnCursor * cellWidth };

      // 重复设置多次
      rowHeightCache[_rowCursor] = cellHeight;

      // 移动列指针
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
  return {
    positionMap, // 当前循环位置对应关系
    positionCache, // 当前循环数据块样式缓存
    rowHeightCache, // 当前循环高度缓存
    rowCursor: _rowCursor, // 当前行指针位置
    accumulationTop: rawData[rawData.length - 1][childrenRawName] ? _rowTop : _rowTop + cellHeight, // 下一行数据top位置(累计行高), 如果最后一次循环为分组则不用追加行高
    groupStyle: {
      // 当前循环(分组)样式
      top: accumulationTop, // 存在偏移,未将分组头包含
      width: cellWidth * columnCount,
      left: 0,
      height: Object.values(rowHeightCache).reduce((prev, curr) => prev + curr, 0),
    },
    groupStyleMap, // 当前循环中的累计分组样式
  };
}

export function isValidKey<TRowHeight>(key: string | number | symbol, object: TRowHeight): key is keyof typeof object {
  return key in object;
}
