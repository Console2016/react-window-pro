import { useCallback } from "react";
// import { IVariableColumn } from "../../interfaces";

interface IProps {
  // column: IVariableColumn;
  dataIndex: string;
  onReposition: (from: string, to: string, position: "front" | "back") => void;
  toggleDragState: (isDraging: boolean) => void;
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

function useDrag({ dataIndex, onReposition, toggleDragState }: IProps) {
  const onDragStart = useCallback(
    (e) => {
      e.dataTransfer.setData("Text", dataIndex);

      const { x, y } = e.target.getBoundingClientRect();

      e.dataTransfer.effectAllowed = "move";

      dragingState = { dataIndex, position: { x, y } };

      toggleDragState && toggleDragState(true);
    },
    [toggleDragState]
  );

  const onDragEnd = useCallback(
    (e) => {
      // 恢复
      e.currentTarget.firstChild.style.transform = "none";

      toggleDragState && toggleDragState(false);
    },
    [toggleDragState]
  );

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
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move"
    const dataIndex = e.currentTarget.getAttribute("data-dataindex");
    if (dragingState.dataIndex === dataIndex) {
      return;
    }

    transform(e);
  }, []);

  const onDrop = useCallback(
    (e) => {
      const { clientX, clientY, currentTarget, dataTransfer } = e;

      const { x, y, width } = currentTarget.getBoundingClientRect();

      const dragDataIndex = dataTransfer.getData("Text");

      const dataIndex = currentTarget.getAttribute("data-dataindex");

      toggleDragState && toggleDragState(false);

      if (dragDataIndex === dataIndex) {
        return;
      }

      onReposition && onReposition(dragDataIndex, dataIndex, clientX - x > width / 2 ? "back" : "front");

      restore(e);
    },
    [toggleDragState, onReposition]
  );

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
