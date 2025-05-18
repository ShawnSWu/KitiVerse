import { useEffect, useState, useCallback } from 'react';
import type { MutableRefObject } from 'react';

interface Size {
  width: number;
  height: number;
}

/**
 * A hook that will automatically resize a node based on its content
 */
export function useAutoResize(
  ref: MutableRefObject<HTMLElement | null>,
  defaultWidth = 200,
  defaultHeight = 100,
  minWidth = 100,
  minHeight = 50,
  maxWidth = 1200,
  maxHeight = 800
): Size {
  const [size, setSize] = useState<Size>({
    width: defaultWidth,
    height: defaultHeight,
  });

  const updateSize = useCallback(() => {
    if (!ref.current) return;

    // 獲取內容的實際尺寸
    const contentWidth = ref.current.scrollWidth;
    const contentHeight = ref.current.scrollHeight;

    // 添加一些內邊距
    const paddingWidth = 20;
    const paddingHeight = 20;

    // 計算新的尺寸，確保不小於最小值，不大於最大值
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, contentWidth + paddingWidth)
    );
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, contentHeight + paddingHeight)
    );

    // 只有當尺寸變化時才更新
    setSize((prevSize: Size) => {
      if (
        Math.abs(prevSize.width - newWidth) > 5 ||
        Math.abs(prevSize.height - newHeight) > 5
      ) {
        return {
          width: newWidth,
          height: newHeight,
        };
      }
      return prevSize;
    });
  }, [
    ref,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  ]);

  // 在組件掛載和內容變化時更新尺寸
  useEffect(() => {
    if (!ref.current) return;

    // 創建一個 ResizeObserver 實例
    const observer = new ResizeObserver(() => {
      updateSize();
    });

    // 開始觀察
    observer.observe(ref.current);

    // 初始尺寸更新
    updateSize();

    // 清理函數
    return () => {
      observer.disconnect();
    };
  }, [ref, updateSize]);

  // 監聽窗口大小變化
  useEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [updateSize]);

  return size;
};
