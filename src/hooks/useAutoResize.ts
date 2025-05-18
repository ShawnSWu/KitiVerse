import { useEffect, useRef } from 'react';

const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const useAutoResize = (
  contentRef: React.RefObject<HTMLElement>,
  onResize: (width: number, height: number) => void,
  deps: any[] = []
) => {
  const prevSize = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!contentRef.current) return;

    const handleResize = debounce((entry: ResizeObserverEntry) => {
      const { width, height } = entry.contentRect;
      
      // 只在尺寸變化超過1px時觸發回調
      if (
        Math.abs(width - prevSize.current.width) > 1 ||
        Math.abs(height - prevSize.current.height) > 1
      ) {
        prevSize.current = { width, height };
        onResize(width, height);
      }
    }, 50);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        handleResize(entry);
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [contentRef, ...deps]);
};
