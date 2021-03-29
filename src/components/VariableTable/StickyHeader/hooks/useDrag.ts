import { useCallback } from "react";
import { IVariableColumn } from "../../interfaces";

interface IProps {
  column: IVariableColumn;
  dataIndex: string;
  onReposition: (from: string, to: string, position: "front" | "back") => void;
}

interface IDragingState {
  dataIndex?: string;
  position?: { x: number; y: number };
}

let dragingState: IDragingState = {};

function transform(e: any) {
  const { clientX, clientY, currentTarget } = e;

  const { x, y, width } = currentTarget.getBoundingClientRect();

  if (clientX - x > width / 2) {
    currentTarget.firstChild.style.transform = "translateX(-10px)";
  } else {
    currentTarget.firstChild.style.transform = "translateX(10px)";
  }
}

function restore(e: any) {
  const { currentTarget } = e;
  if (currentTarget) {
    currentTarget.firstChild.style.transform = "none";
  }
}

function useDrag({ column, dataIndex, onReposition }: IProps) {
  const onDragStart = useCallback((e) => {
    e.dataTransfer.setData("Text", dataIndex);

    const { x, y } = e.target.getBoundingClientRect();

    dragingState = { dataIndex, position: { x, y } };
  }, []);

  const onDragEnd = useCallback((e) => {
    // 恢复
    e.currentTarget.firstChild.style.transform = "none";
  }, []);

  const onDragEnter = useCallback((e) => {
    // 阻止浏览器默认行为
    e.preventDefault();
    const dataIndex = e.currentTarget.getAttribute("data-dataindex");
    if (dragingState.dataIndex === dataIndex) {
      return;
    }

    transform(e);
  }, []);

  const onDragLeave = useCallback((e) => {
    // 阻止浏览器默认行为
    e.preventDefault();
    const dataIndex = e.currentTarget.getAttribute("data-dataindex");
    if (dragingState.dataIndex === dataIndex) {
      return;
    }

    restore(e);
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault(); //取消dragover的默认行为
    const dataIndex = e.currentTarget.getAttribute("data-dataindex");
    if (dragingState.dataIndex === dataIndex) {
      return;
    }

    transform(e);
  }, []);

  const onDrop = useCallback((e) => {
    const { clientX, clientY, currentTarget, dataTransfer } = e;

    const { x, y, width } = currentTarget.getBoundingClientRect();

    const dragDataIndex = dataTransfer.getData("Text");

    const dataIndex = currentTarget.getAttribute("data-dataindex");

    if (dragDataIndex === dataIndex) {
      return;
    }

    onReposition && onReposition(dragDataIndex, dataIndex, clientX - x > width / 2 ? "back" : "front");

    restore(e);
  }, []);

  return {
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
  };
}

export default useDrag;
