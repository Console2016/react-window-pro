import {useState,useLayoutEffect } from 'react';

// 帮助函数
function getSize(element) {
  if (!element) {
    return {};
  }

  return {
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

// 帮助函数
export function useComponentSize(ref) {
  let [ComponentSize, setComponentSize] = useState(getSize(ref.current));

  const onResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    onResize();

    let resizeObserver = new ResizeObserver(() => onResize());

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect(ref.current);
      resizeObserver = null;
    };
  }, [ref.current]);

  return ComponentSize;
}

