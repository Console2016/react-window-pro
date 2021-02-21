/*
 * @Author: sun.t
 * @Date: 2020-09-16 09:35:50
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-02-18 13:35:40
 */
import { VariableSizeGrid, GridOnScrollProps } from "react-window";
import { ReactNode, Ref } from "react";
import { CSSProperties } from "styled-components";

export type TTitle = ReactNode | (({ dataIndex, column }: { dataIndex: string; column: IVariableColumn }) => ReactNode);

export interface IVariableColumn<RecordType = any> {
  width: string | number;
  title?: TTitle;
  dataIndex: string;
  fixed?: boolean;
  render?: ({
    columnIndex,
    rowIndex,
    dataIndex,
    value,
    record,
  }: {
    columnIndex: number;
    rowIndex: number;
    dataIndex: string;
    value: any;
    record: RecordType;
  }) => ReactNode;
  [prop: string]: any;
}

// export interface IHeader {
//   height: number;
//   baseRender: () => ReactNode;
// }

export type TPlaceholder = ReactNode | (({ columnIndex, rowIndex }: { columnIndex: number; rowIndex: number }) => ReactNode);

type TRowRender = ({ columnIndex, data }: { columnIndex: number; data: TObject; width: number }) => ReactNode;

export type TObject = {
  [key: string]: any;
  children?: TObject[];
};

export interface IRawItem {
  [key: string]: any;
  children?: IRawItem[];
}

export interface IProps<RecordType> {
  ref?: Ref<VariableSizeGrid>;
  outerRef?: Ref<HTMLElement>;
  innerRef?: Ref<HTMLElement>;
  direction?: "ltr" | "rtl";
  rawData: IRawItem[];
  columnWidth?: (index: number) => number; // todo 兼容number类型
  rowHeight?: (index: number) => number; // todo 兼容number类型
  onScroll?: (props: GridOnScrollProps) => any;
  columns: IVariableColumn<RecordType>[];
  height: number;
  width: number;
  header?: boolean | number;
  placeholder?: TPlaceholder;
  initialScrollLeft: number;
  initialScrollTop: number;
  itemKey: ({ columnIndex, data, rowIndex }: { columnIndex: number; data: any; rowIndex: number }) => string;
  className?: string;
  style?: CSSProperties;
  innerClassName?: string;
  bodyClassName?: string;
  stickyBodyClassName?: string;
  headerClassName?: string;
  stickyHeaderClassName?: string;
  useStickyIsScrolling?: boolean;
  useIsScrolling?: boolean;
  overscanColumnCount?: number;
  overscanRowCount?: number;
  childrenRawName?: string;
  groupRowRender?: TRowRender;
}

export interface IStickyContext {
  stickyHeight: number; // 冻结行总高度
  stickyWidth: number; // 冻结列总宽度
  nonStrickyWidth: number; // 非冻结列总宽度
  columns: IVariableColumn[]; // 原始列
  stickyColumnsCount: number; // 冻结列数量
  // nonStrickyColumnsCount: number; // 非冻结列
  columnLeftCache: number[]; // 每列position:left集合
  columnWidthCache: number[]; // 调用columnWidth结果集合
  rowHeightCache: number[]; // 调用rowHeight结果集合
  rowTopCache: number[]; // 每行position:top集合
  rawData: TObject[];
  childrenRawName: string;
  innerClassName: string;
  bodyClassName: string;
  stickyBodyClassName: string;
  headerClassName: string;
  stickyHeaderClassName: string;
  // columnWidth?: (index: number) => number;
  // rowHeight?: (index: number) => number;
  placeholder?: TPlaceholder;
  useStickyIsScrolling?: boolean;
  groupRowRender?: TRowRender;
}

// 单行表头样式计算结果
export interface IHeadersStyle {
  height: number;
  width: number;
  left: number;
  columnIndex: number;
}

// 单列样式计算结果
export interface IColumnsStyle {
  height: number;
  width: number;
  top: number;
  rowIndex: number;
}

export interface IStickyHeaderProps {
  stickyHeight: number;
  stickyWidth: number;
  headerColumns: IHeadersStyle[];
  columns: IVariableColumn[];
  stickyHeaderColumns: IHeadersStyle[];
  stickyClassName: string;
  className: string;
}

export interface IStickyColumnsProps {
  rows: IColumnsStyle[];
  stickyHeight: number;
  stickyWidth: number;
  stickyColumnsCount: number;
  columns: IVariableColumn[];
  rawData: TObject[];
  columnWidthCache: number[];
  className?: string;
  isScrolling: boolean;
  placeholder: TPlaceholder;
  useIsScrolling?: boolean;
  groupRowRender?: TRowRender;
  childrenRawName: string;
}

export interface IPreproccessProps<RecordType> {
  header?: boolean | number;
  columns: IVariableColumn<RecordType>[];
  columnWidth?: (index: number) => number;
}

export interface IPlaceholderProps {
  style: CSSProperties;
  placeholder: TPlaceholder;
  columnIndex: number;
  rowIndex: number;
}

// export type GridComponent<RecordType = any> = (
//   props: IProps<RecordType>,
//   ref?: Ref<VariableSizeGrid>
// ) => ReactElement | null

// export interface GridComponent<RecordType> {
//   <RecordType = any>(props: IProps<RecordType>, ref?: Ref<VariableSizeGrid>): ReactElement | null;
// }
