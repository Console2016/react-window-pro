import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSSProperties } from "styled-components";

type TPosition = { x: number; y: number };

const Position: TPosition = { x: 0, y: 0 },
  EmptyStyle = {};

interface IProps {
  style?: CSSProperties;
  direction?: "vertical" | "horizontal";
  onDrag?: ({ translation }: { translation: TPosition }) => void;
  onDragEnd?: ({ translation }: { translation: TPosition }) => void;
}

const useDragOffset = function ({ direction, style = EmptyStyle, onDrag, onDragEnd }: IProps) {
  const translationRef = useRef(Position);
  const [state, setState] = useState({
    isDragging: false,
    origin: Position, // 起始位置
    translation: Position, // 偏移量
  });

  // drag start
  const handleMouseDown = useCallback((e) => {
    const { clientX, clientY } = e;
    // 阻止浏览器默认行为
    e.preventDefault();
    setState((state) => ({
      ...state,
      isDragging: true,
      origin: { x: clientX, y: clientY },
    }));
    // console.log("down");
  }, []);

  // move
  const handleMouseMove = useCallback(
    ({ clientX, clientY }) => {
      let x = clientX - state.origin.x,
        y = clientY - state.origin.y;

      if (direction === "vertical") {
        x = 0;
      } else if (direction === "horizontal") {
        y = 0;
      }

      const translation = { x, y };

      setState((state) => ({
        ...state,
        translation,
      }));

      translationRef.current = translation;

      onDrag && onDrag({ translation });
      // console.log("move");
    },
    [state.origin, onDrag, direction]
  );

  // drop
  const handleMouseUp = useCallback(() => {
    
    setState((state) => ({
      ...state,
      translation: { x: 0, y: 0 },
      isDragging: false,
    }));

    onDragEnd && onDragEnd({ translation: translationRef.current });
  }, [onDragEnd]);

  // add|remove event
  useEffect(() => {
    // console.log(state.isDragging);
    if (state.isDragging) {
      // console.log("addEventListener");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      // console.log("return1 removeEventListener"); // why twice
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  // didmount
  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const styles: CSSProperties = useMemo(() => {
    let transform = `translate(${state.translation.x}px, ${state.translation.y}px)`;

    const { cursor, ...args } = style;

    let _cursor = cursor || (state.isDragging ? "-webkit-grabbing" : "-webkit-grab");

    return {
      cursor: _cursor,
      transform,
      transition: state.isDragging ? "none" : "transform 500ms",
      zIndex: state.isDragging ? 2 : 1,
      position: state.isDragging ? "absolute" : "relative",
      ...args,
    };
  }, [style, state.isDragging, state.translation]);

  return {
    styles,
    handleMouseDown,
  };
};

export default useDragOffset;