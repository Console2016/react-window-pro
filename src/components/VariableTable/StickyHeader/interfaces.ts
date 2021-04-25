import { CSSProperties, ReactNode } from "react";
import { IVariableColumn } from "../interfaces";

export interface ICellProps {
  style: CSSProperties;
  children: ReactNode[];
  column: IVariableColumn;
  onReposition: (from: string, to: string, position: "front" | "back") => void;
  toggleDragState: (isDraging: boolean) => void;
  isDraging: boolean;
}
