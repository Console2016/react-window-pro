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
    },
    [state.origin, onDrag, direction]
  );

  // drop
  const handleMouseUp = useCallback(() => {
    onDragEnd && onDragEnd({ translation: translationRef.current });
    setState((state) => ({
      ...state,
      isDragging: false,
    }));
  }, [onDragEnd]);

  // add|remove event
  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      setState((state) => ({ ...state, translation: { x: 0, y: 0 } }));
    }
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

// const Component = ({
//   style,
//   children,
//   direction,
//   onDrag,
//   onDragEnd,
// }: {
//   style: CSSProperties;
//   direction?: "vertical" | "horizontal";
//   children: ReactChild;
//   onDrag?: ({ translation }: { translation: TPosition }) => void;
//   onDragEnd?: ({ translation }: { translation: TPosition }) => void;
// }) => {
//   const translationRef = useRef(Position);

//   return (
//     <div style={styles} onMouseDown={handleMouseDown}>
//       {children}
//     </div>
//   );
// };

// export default Component;
