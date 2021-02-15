import React, { Ref, ReactNode } from 'react';
import { VariableSizeGrid, GridOnScrollProps } from 'react-window';
import { CSSProperties } from 'styled-components';

declare type TTitle = ReactNode | (({ dataIndex, column }: {
    dataIndex: string;
    column: IVariableColumn;
}) => ReactNode);
interface IVariableColumn<RecordType = any> {
    width: string | number;
    title?: TTitle;
    dataIndex: string;
    fixed?: boolean;
    render?: ({ columnIndex, rowIndex, dataIndex, value, record, }: {
        columnIndex: number;
        rowIndex: number;
        dataIndex: string;
        value: any;
        record: RecordType;
    }) => ReactNode;
    [prop: string]: any;
}
declare type TPlaceholder = ReactNode | (({ columnIndex, rowIndex }: {
    columnIndex: number;
    rowIndex: number;
}) => ReactNode);
declare type TRowRender = ({ columnIndex, data }: {
    columnIndex: number;
    data: TObject;
    width: number;
}) => ReactNode;
declare type TObject = {
    [key: string]: any;
};
interface IProps<RecordType> {
    ref?: Ref<VariableSizeGrid>;
    outerRef?: Ref<HTMLElement>;
    innerRef?: Ref<HTMLElement>;
    direction?: "ltr" | "rtl";
    rawData: TObject[];
    columnWidth?: (index: number) => number;
    rowHeight?: (index: number) => number;
    onScroll?: (props: GridOnScrollProps) => any;
    columns: IVariableColumn<RecordType>[];
    height: number;
    width: number;
    header?: boolean | number;
    placeholder?: TPlaceholder;
    initialScrollLeft: number;
    initialScrollTop: number;
    itemKey: ({ columnIndex, data, rowIndex }: {
        columnIndex: number;
        data: any;
        rowIndex: number;
    }) => string;
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

declare const _default: React.ForwardRefExoticComponent<Pick<IProps<unknown>, "childrenRawName" | "header" | "columns" | "columnWidth" | "rowHeight" | "rawData" | "style" | "placeholder" | "className" | "onScroll" | "height" | "width" | "useIsScrolling" | "groupRowRender" | "outerRef" | "innerRef" | "direction" | "itemKey" | "initialScrollLeft" | "initialScrollTop" | "overscanColumnCount" | "overscanRowCount" | "useStickyIsScrolling" | "innerClassName" | "bodyClassName" | "stickyBodyClassName" | "headerClassName" | "stickyHeaderClassName"> & React.RefAttributes<VariableSizeGrid>>;

export { _default as VariableTable };
