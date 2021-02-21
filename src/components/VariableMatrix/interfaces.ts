/*
 * @Author: sun.t
 * @Date: 2021-02-18 13:26:10
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-02-20 20:38:43
 */
import { CSSProperties, ReactNode, Ref } from "react";
import { VariableSizeGrid, GridOnScrollProps } from "react-window";

export type TRowRender = ({
  rowIndex,
  columnIndex,
  data,
  style,
}: {
  rowIndex: number; // number
  columnIndex: number;
  data: IRawItem;
  style: CSSProperties;
}) => ReactNode;

export type TCellRender = ({
  rowIndex,
  columnIndex,
  data,
  style,
}: {
  rowIndex: number;
  columnIndex: number;
  data: IRawItem;
  style: CSSProperties;
}) => ReactNode;

export type TPlaceholder =
  | ReactNode
  | (({ columnIndex, rowIndex, data }: { columnIndex: number; rowIndex: number; data: IRawItem }) => ReactNode);

export interface IRawItem {
  [key: string]: any;
  children?: IRawItem[];
}

export interface IProps<T> {
  ref?: Ref<VariableSizeGrid>;
  outerRef?: Ref<HTMLElement>;
  innerRef?: Ref<HTMLElement>;
  groupRowHeight?: ((raw: IRawItem, index: number) => number) | number;
  cellHeight: number;
  cellWidth: number;
  height: number;
  width: number;
  scrollbarSize: number;
  rawData: IRawItem[];
  itemKey: ({ columnIndex, data, rowIndex }: { columnIndex: number; data: any; rowIndex: number }) => string;
  placeholder?: TPlaceholder;
  groupRowRender?: TRowRender;
  cellRender?: TCellRender;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  useIsScrolling?: boolean;
  overscanRowCount?: number;
  childrenRawName?: string;
  isShowEmptyGroup?: boolean;
  // initialScrollLeft: number;
  initialScrollTop: number;
  onScroll?: (props: GridOnScrollProps) => any;
}

export interface IContext {
  innerClassName: string;
  scrollbarSize: number;
}
